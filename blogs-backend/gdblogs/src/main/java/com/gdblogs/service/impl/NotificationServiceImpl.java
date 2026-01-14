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
import com.gdblogs.mapper.NotificationMapper;
import com.gdblogs.model.dto.notification.NotificationQueryRequest;
import com.gdblogs.model.entity.Comment;
import com.gdblogs.model.entity.Notification;
import com.gdblogs.model.entity.Post;
import com.gdblogs.model.entity.User;
import com.gdblogs.model.enums.NotificationTypeEnum;
import com.gdblogs.model.vo.LoginUserVO;
import com.gdblogs.model.vo.NotificationVO;
import com.gdblogs.service.CommentService;
import com.gdblogs.service.NotificationService;
import com.gdblogs.service.PostService;
import com.gdblogs.service.UserService;
import com.gdblogs.utils.SqlUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 通知服务实现
 */
@Service
@Slf4j
public class NotificationServiceImpl extends ServiceImpl<NotificationMapper, Notification> implements NotificationService {

    @Resource
    private UserService userService;

    @Resource
    private PostService postService;

    @Resource
    private CommentService commentService;

    private static final int MAX_CONTENT_LENGTH = 1024;

    @Override
    public long getUnreadCount(HttpServletRequest request) {
        LoginUserVO loginUser = userService.getLoginUser(request);
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("receiverId", loginUser.getId())
                .eq("status", 0)
                .eq("isDelete", 0);
        return this.count(queryWrapper);
    }

    @Override
    public Page<NotificationVO> listNotificationVOByPage(NotificationQueryRequest notificationQueryRequest, HttpServletRequest request) {
        if (notificationQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        LoginUserVO loginUser = userService.getLoginUser(request);

        long current = notificationQueryRequest.getPageNum() <= 0 ? 1L : notificationQueryRequest.getPageNum();
        long size = notificationQueryRequest.getPageSize() <= 0 ? 10L : notificationQueryRequest.getPageSize();

        QueryWrapper<Notification> queryWrapper = getQueryWrapper(notificationQueryRequest, loginUser.getId());
        Page<Notification> page = this.page(new Page<>(current, size), queryWrapper);
        return toNotificationVOPage(page);
    }

    @Override
    public boolean readNotifications(List<Long> ids, HttpServletRequest request) {
        if (CollUtil.isEmpty(ids)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "ids 不能为空");
        }
        LoginUserVO loginUser = userService.getLoginUser(request);
        // 仅更新自己的通知
        Notification update = new Notification();
        update.setStatus(1);
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("receiverId", loginUser.getId())
                .in("id", ids)
                .eq("isDelete", 0);
        return this.update(update, queryWrapper);
    }

    @Override
    public void createByComment(Comment comment, User sender) {
        if (comment == null || sender == null || sender.getId() == null) {
            return;
        }
        Long senderId = sender.getId();
        Long postId = comment.getPostId();
        Long parentId = comment.getParentId();

        if (postId == null || postId <= 0) {
            return;
        }

        // 评论：通知文章作者
        if (parentId == null || parentId <= 0) {
            Post post = postService.getById(postId);
            if (post == null || post.getUserId() == null) {
                log.warn("create notification skipped, post not found, postId={}", postId);
                return;
            }
            Long receiverId = post.getUserId();
            if (ObjectUtil.equal(receiverId, senderId)) {
                return;
            }
            String senderName = safeUserName(sender);
            String postTitle = StrUtil.blankToDefault(post.getTitle(), "你的文章");
            String content = String.format("%s 评论了你的文章：%s", senderName, postTitle);
            saveNotification(NotificationTypeEnum.COMMENT.getValue(), content, receiverId, senderId, postId, comment.getId());
            return;
        }

        // 回复：通知父评论作者
        Comment parentComment = commentService.getById(parentId);
        if (parentComment == null || parentComment.getUserId() == null) {
            log.warn("create notification skipped, parentComment not found, parentId={}", parentId);
            return;
        }
        Long receiverId = parentComment.getUserId();
        if (ObjectUtil.equal(receiverId, senderId)) {
            return;
        }
        String senderName = safeUserName(sender);
        String content = String.format("%s 回复了你的评论", senderName);
        saveNotification(NotificationTypeEnum.REPLY.getValue(), content, receiverId, senderId, postId, comment.getId());
    }

    private void saveNotification(String type, String content, Long receiverId, Long senderId, Long postId, Long commentId) {
        if (StrUtil.isBlank(type) || StrUtil.isBlank(content) || receiverId == null || senderId == null) {
            return;
        }
        String finalContent = content.trim();
        if (finalContent.length() > MAX_CONTENT_LENGTH) {
            finalContent = finalContent.substring(0, MAX_CONTENT_LENGTH);
        }
        Notification notification = new Notification();
        notification.setType(type);
        notification.setContent(finalContent);
        notification.setReceiverId(receiverId);
        notification.setSenderId(senderId);
        notification.setPostId(postId);
        notification.setCommentId(commentId);
        notification.setStatus(0);
        boolean saved = this.save(notification);
        if (!saved) {
            log.warn("save notification failed, type={}, receiverId={}, senderId={}, postId={}, commentId={}",
                    type, receiverId, senderId, postId, commentId);
        }
    }

    private QueryWrapper<Notification> getQueryWrapper(NotificationQueryRequest req, Long receiverId) {
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("receiverId", receiverId);
        queryWrapper.eq("isDelete", 0);

        Integer status = req.getStatus();
        String type = req.getType();
        String sortField = req.getSortField();
        String sortOrder = req.getSortOrder();

        queryWrapper.eq(status != null, "status", status);
        queryWrapper.eq(StrUtil.isNotBlank(type), "type", type);

        if (SqlUtils.validSortField(sortField)) {
            boolean asc = CommonConstant.SORT_ORDER_ASC.equals(sortOrder);
            queryWrapper.orderBy(true, asc, sortField);
        } else {
            queryWrapper.orderByDesc("createTime");
        }
        return queryWrapper;
    }

    private Page<NotificationVO> toNotificationVOPage(Page<Notification> notificationPage) {
        List<Notification> list = notificationPage.getRecords();
        Page<NotificationVO> voPage = new Page<>(notificationPage.getCurrent(), notificationPage.getSize(), notificationPage.getTotal());
        if (CollUtil.isEmpty(list)) {
            voPage.setRecords(Collections.emptyList());
            return voPage;
        }

        Set<Long> senderIds = list.stream()
                .map(Notification::getSenderId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, User> senderIdUserMap = userService.listByIds(senderIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity(), (a, b) -> a));

        List<NotificationVO> voList = list.stream().map(n -> {
            NotificationVO vo = NotificationVO.objToVo(n);
            User sender = senderIdUserMap.get(n.getSenderId());
            vo.setSender(userService.getLoginUserVO(sender));
            return vo;
        }).collect(Collectors.toList());

        voPage.setRecords(voList);
        return voPage;
    }

    private String safeUserName(User sender) {
        if (sender == null) {
            return "有人";
        }
        String name = sender.getUserName();
        if (StrUtil.isBlank(name)) {
            name = sender.getUserAccount();
        }
        return StrUtil.blankToDefault(name, "有人");
    }
}

