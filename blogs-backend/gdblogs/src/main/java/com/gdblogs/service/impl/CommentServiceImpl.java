package com.gdblogs.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdblogs.constant.CommonConstant;
import com.gdblogs.exception.BusinessException;
import com.gdblogs.exception.ErrorCode;
import com.gdblogs.exception.ThrowUtils;
import com.gdblogs.mapper.CommentMapper;
import com.gdblogs.model.dto.comment.CommentQueryRequest;
import com.gdblogs.model.entity.Comment;
import com.gdblogs.model.entity.User;
import com.gdblogs.model.vo.CommentVO;
import com.gdblogs.service.CommentService;
import com.gdblogs.service.UserService;
import com.gdblogs.utils.HtmlUtils;
import com.gdblogs.utils.SqlUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 评论服务实现
 */
@Service
@Slf4j
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {

    @Resource
    private UserService userService;

    /**
     * 评论内容最大长度
     */
    private static final int MAX_CONTENT_LENGTH = 1000;

    /**
     * 防止极端情况一次性拉取过多子评论
     */
    private static final int MAX_CHILD_FETCH = 5000;

    @Override
    public void validComment(Comment comment, boolean add) {
        if (comment == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String content = comment.getContent();
        Long postId = comment.getPostId();
        Long parentId = comment.getParentId();

        // 创建时，参数不能为空
        if (add) {
            ThrowUtils.throwIf(StrUtil.isBlank(content), ErrorCode.PARAMS_ERROR, "评论内容不能为空");
            ThrowUtils.throwIf(postId == null || postId <= 0, ErrorCode.PARAMS_ERROR, "postId 不能为空");
        }

        // 有参数则校验
        if (StrUtil.isNotBlank(content)) {
            String trimmed = content.trim();
            boolean contentLooksLikeHtml = trimmed.matches("(?s).*<\\s*[a-zA-Z][^>]*>.*");
            // 仅当内容看起来是 HTML 时才清洗（Markdown 不应该走 HTML 白名单清洗）
            String storedContent = contentLooksLikeHtml ? HtmlUtils.cleanHtml(trimmed) : trimmed;
            comment.setContent(storedContent);
            if (storedContent.length() > MAX_CONTENT_LENGTH) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "评论内容过长");
            }
        }

        // parentId 可空，但若传入需确认存在且同属同一 post
        if (ObjectUtil.isNotNull(parentId) && parentId > 0) {
            Comment parentComment = this.getById(parentId);
            ThrowUtils.throwIf(parentComment == null, ErrorCode.PARAMS_ERROR, "父评论不存在");
            if (postId != null && !ObjectUtil.equal(parentComment.getPostId(), postId)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "父评论与帖子不匹配");
            }
            // 若未传 postId，可从父评论补齐（兼容某些调用方）
            if (postId == null) {
                comment.setPostId(parentComment.getPostId());
            }
        }
    }

    @Override
    public QueryWrapper<Comment> getQueryWrapper(CommentQueryRequest commentQueryRequest) {
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        if (commentQueryRequest == null) {
            return queryWrapper;
        }
        Long id = commentQueryRequest.getId();
        Long postId = commentQueryRequest.getPostId();
        Long userId = commentQueryRequest.getUserId();
        Long parentId = commentQueryRequest.getParentId();
        String sortField = commentQueryRequest.getSortField();
        String sortOrder = commentQueryRequest.getSortOrder();

        queryWrapper.eq(ObjectUtil.isNotNull(id), "id", id);
        queryWrapper.eq(ObjectUtil.isNotNull(postId), "postId", postId);
        queryWrapper.eq(ObjectUtil.isNotNull(userId), "userId", userId);
        queryWrapper.eq(ObjectUtil.isNotNull(parentId), "parentId", parentId);
        queryWrapper.eq("isDelete", 0);

        if (SqlUtils.validSortField(sortField)) {
            boolean asc = CommonConstant.SORT_ORDER_ASC.equals(sortOrder);
            queryWrapper.orderBy(true, asc, sortField);
        } else {
            // 默认按创建时间倒序
            queryWrapper.orderByDesc("createTime");
        }
        return queryWrapper;
    }

    @Override
    public CommentVO getCommentVO(Comment comment, HttpServletRequest request) {
        CommentVO commentVO = CommentVO.objToVo(comment);
        if (commentVO == null) {
            return null;
        }
        // 关联查询用户信息
        Long userId = comment.getUserId();
        User user = null;
        if (userId != null && userId > 0) {
            user = userService.getById(userId);
        }
        commentVO.setUser(userService.getLoginUserVO(user));
        return commentVO;
    }

    @Override
    public Page<CommentVO> getCommentVOPage(Page<Comment> commentPage, HttpServletRequest request) {
        List<Comment> commentList = commentPage.getRecords();
        Page<CommentVO> commentVOPage = new Page<>(commentPage.getCurrent(), commentPage.getSize(), commentPage.getTotal());
        if (CollUtil.isEmpty(commentList)) {
            commentVOPage.setRecords(Collections.emptyList());
            return commentVOPage;
        }
        // 1. 批量查询用户信息
        Set<Long> userIdSet = commentList.stream()
                .map(Comment::getUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, User> userIdUserMap = userService.listByIds(userIdSet).stream()
                .collect(Collectors.toMap(User::getId, Function.identity(), (a, b) -> a));

        // 2. 填充信息
        List<CommentVO> commentVOList = commentList.stream().map(comment -> {
            CommentVO commentVO = CommentVO.objToVo(comment);
            commentVO.setUser(userService.getLoginUserVO(userIdUserMap.get(comment.getUserId())));
            return commentVO;
        }).collect(Collectors.toList());

        commentVOPage.setRecords(commentVOList);
        return commentVOPage;
    }

    /**
     * 只分页顶级评论（parentId is null），children 不分页，且 records 内每条都已挂载 children
     */
    @Override
    public Page<CommentVO> listCommentVOByPage(CommentQueryRequest commentQueryRequest, HttpServletRequest request) {
        if (commentQueryRequest == null || commentQueryRequest.getPostId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "postId 不能为空");
        }
        long current = commentQueryRequest.getPageNum() <= 0 ? 1L : commentQueryRequest.getPageNum();
        long size = commentQueryRequest.getPageSize() <= 0 ? 10L : commentQueryRequest.getPageSize();
        Long postId = commentQueryRequest.getPostId();

        // 1) 顶级评论分页
        QueryWrapper<Comment> topQueryWrapper = new QueryWrapper<>();
        topQueryWrapper.eq("postId", postId)
                .isNull("parentId")
                .eq("isDelete", 0)
                .orderByDesc("createTime");
        Page<Comment> topCommentPage = this.page(new Page<>(current, size), topQueryWrapper);

        List<Comment> topComments = topCommentPage.getRecords();
        Page<CommentVO> commentVOPage = new Page<>(topCommentPage.getCurrent(), topCommentPage.getSize(), topCommentPage.getTotal());
        if (CollUtil.isEmpty(topComments)) {
            commentVOPage.setRecords(Collections.emptyList());
            return commentVOPage;
        }

        List<Long> topIds = topComments.stream()
                .map(Comment::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // 2) 一次性查出这些顶级评论的所有后代评论（递归按层拉取）
        List<Comment> descendants = new ArrayList<>();
        List<Long> parentIds = new ArrayList<>(topIds);
        while (CollUtil.isNotEmpty(parentIds)) {
            if (descendants.size() >= MAX_CHILD_FETCH) {
                log.warn("comment children exceed limit, postId={}, topCount={}, fetched={}", postId, topIds.size(), descendants.size());
                break;
            }
            QueryWrapper<Comment> childQueryWrapper = new QueryWrapper<>();
            childQueryWrapper.eq("postId", postId)
                    .in("parentId", parentIds)
                    .eq("isDelete", 0)
                    .orderByAsc("createTime");
            List<Comment> levelChildren = this.list(childQueryWrapper);
            if (CollUtil.isEmpty(levelChildren)) {
                break;
            }
            descendants.addAll(levelChildren);
            parentIds = levelChildren.stream()
                    .map(Comment::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        // 3) 批量查询用户信息
        Set<Long> userIdSet = new HashSet<>();
        topComments.forEach(c -> {
            if (c.getUserId() != null) {
                userIdSet.add(c.getUserId());
            }
        });
        descendants.forEach(c -> {
            if (c.getUserId() != null) {
                userIdSet.add(c.getUserId());
            }
        });
        Map<Long, User> userIdUserMap = userService.listByIds(userIdSet).stream()
                .collect(Collectors.toMap(User::getId, Function.identity(), (a, b) -> a));

        // 4) 组装 children（按 parentId groupBy，再递归挂载）
        Map<Long, List<Comment>> parentIdChildrenMap = descendants.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Comment::getParentId));
        // 保证同一父节点下按 createTime 升序
        parentIdChildrenMap.values().forEach(list -> list.sort(Comparator.comparing(Comment::getCreateTime,
                Comparator.nullsLast(Comparator.naturalOrder()))));

        List<CommentVO> topCommentVOList = topComments.stream()
                .map(top -> buildCommentTree(top, parentIdChildrenMap, userIdUserMap))
                .collect(Collectors.toList());
        commentVOPage.setRecords(topCommentVOList);
        return commentVOPage;
    }

    private CommentVO buildCommentTree(Comment comment, Map<Long, List<Comment>> parentIdChildrenMap, Map<Long, User> userIdUserMap) {
        CommentVO commentVO = CommentVO.objToVo(comment);
        if (commentVO == null) {
            return null;
        }
        commentVO.setUser(userService.getLoginUserVO(userIdUserMap.get(comment.getUserId())));
        List<Comment> children = parentIdChildrenMap.getOrDefault(comment.getId(), Collections.emptyList());
        if (CollUtil.isEmpty(children)) {
            commentVO.setChildren(Collections.emptyList());
            return commentVO;
        }
        List<CommentVO> childVOList = children.stream()
                .map(child -> buildCommentTree(child, parentIdChildrenMap, userIdUserMap))
                .collect(Collectors.toList());
        commentVO.setChildren(childVOList);
        return commentVO;
    }
}

