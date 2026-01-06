package com.gdblogs.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdblogs.exception.ErrorCode;
import com.gdblogs.constant.CommonConstant;
import com.gdblogs.exception.BusinessException;
import com.gdblogs.exception.ThrowUtils;
import com.gdblogs.mapper.PostMapper;
import com.gdblogs.model.dto.post.PostQueryRequest;
import com.gdblogs.model.entity.Post;
import com.gdblogs.model.entity.User;
import com.gdblogs.model.vo.PostVO;
import com.gdblogs.model.vo.LoginUserVO;
import com.gdblogs.service.PostService;
import com.gdblogs.service.UserService;
import com.gdblogs.utils.HtmlUtils;
import com.gdblogs.utils.SqlUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 帖子服务实现
 */
@Service
@Slf4j
public class PostServiceImpl extends ServiceImpl<PostMapper, Post> implements PostService {

    @Resource
    private UserService userService;

    @Override
    public void validPost(Post post, boolean add) {
        if (post == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String title = post.getTitle();
        String content = post.getContent();
        String tags = post.getTags();
        boolean contentLooksLikeHtml = StrUtil.isNotBlank(content) && content.matches("(?s).*<\\s*[a-zA-Z][^>]*>.*");
        // 创建时，参数不能为空
        if (add) {
            ThrowUtils.throwIf(StrUtil.hasBlank(title, content, tags), ErrorCode.PARAMS_ERROR);
        }
        // 有参数则校验
        if (StrUtil.isNotBlank(title) && title.length() > 80) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标题过长");
        }
        if (StrUtil.isNotBlank(content)) {
            // 仅当内容看起来是 HTML 时才清洗（Markdown 不应该走 HTML 白名单清洗）
            String storedContent = contentLooksLikeHtml ? HtmlUtils.cleanHtml(content) : content;
            post.setContent(storedContent);
            // 校验长度
            if (storedContent.length() > 50000) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "内容过长");
            }
        }
    }

    /**
     * 获取查询包装类
     *
     * @param postQueryRequest
     * @return
     */
    @Override
    public QueryWrapper<Post> getQueryWrapper(PostQueryRequest postQueryRequest) {
        QueryWrapper<Post> queryWrapper = new QueryWrapper<>();
        if (postQueryRequest == null) {
            return queryWrapper;
        }
        String searchText = postQueryRequest.getSearchText();
        String sortField = postQueryRequest.getSortField();
        String sortOrder = postQueryRequest.getSortOrder();
        Long id = postQueryRequest.getId();
        String title = postQueryRequest.getTitle();
        String content = postQueryRequest.getContent();
        List<String> tagList = postQueryRequest.getTags();
        Long userId = postQueryRequest.getUserId();
        Long categoryId = postQueryRequest.getCategoryId();
        Integer isFeatured = postQueryRequest.getIsFeatured();
        Integer isHome = postQueryRequest.getIsHome();
        
        // 拼接查询条件
        if (StrUtil.isNotBlank(searchText)) {
            queryWrapper.and(qw -> qw.like("title", searchText).or().like("content", searchText));
        }
        queryWrapper.like(StrUtil.isNotBlank(title), "title", title);
        queryWrapper.like(StrUtil.isNotBlank(content), "content", content);
        if (CollUtil.isNotEmpty(tagList)) {
            for (String tag : tagList) {
                queryWrapper.like("tags", "\"" + tag + "\"");
            }
        }
        queryWrapper.eq(ObjectUtil.isNotNull(id), "id", id);
        queryWrapper.eq(ObjectUtil.isNotNull(userId), "userId", userId);
        queryWrapper.eq(ObjectUtil.isNotNull(categoryId), "categoryId", categoryId);
        queryWrapper.eq(ObjectUtil.isNotNull(isFeatured), "isFeatured", isFeatured);
        queryWrapper.eq(ObjectUtil.isNotNull(isHome), "isHome", isHome);
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        return queryWrapper;
    }

    @Override
    public PostVO getPostVO(Post post, HttpServletRequest request) {
        PostVO postVO = PostVO.objToVo(post);
        long postId = post.getId();
        // 1. 关联查询用户信息
        Long userId = post.getUserId();
        User user = null;
        if (userId != null && userId > 0) {
            user = userService.getById(userId);
        }
        postVO.setUser(userService.getLoginUserVO(user));
        // 2. 将 tags json 字符串转为 List
        String tagsStr = post.getTags();
        if (StrUtil.isNotBlank(tagsStr)) {
            List<String> tags = JSONUtil.toList(tagsStr, String.class);
            postVO.setTagList(tags);
        }
        return postVO;
    }

    @Override
    public Page<PostVO> getPostVOPage(Page<Post> postPage, HttpServletRequest request) {
        List<Post> postList = postPage.getRecords();
        Page<PostVO> postVOPage = new Page<>(postPage.getCurrent(), postPage.getSize(), postPage.getTotal());
        if (CollUtil.isEmpty(postList)) {
            return postVOPage;
        }
        // 1. 关联查询用户信息
        Set<Long> userIdSet = postList.stream().map(Post::getUserId).collect(Collectors.toSet());
        Map<Long, List<User>> userIdUserListMap = userService.listByIds(userIdSet).stream()
                .collect(Collectors.groupingBy(User::getId));
        
        // 2. 填充信息
        List<PostVO> postVOList = postList.stream().map(post -> {
            PostVO postVO = PostVO.objToVo(post);
            Long userId = post.getUserId();
            User user = null;
            if (userIdUserListMap.containsKey(userId)) {
                user = userIdUserListMap.get(userId).get(0);
            }
            postVO.setUser(userService.getLoginUserVO(user));
            // tags 转换
            String tagsStr = post.getTags();
            if (StrUtil.isNotBlank(tagsStr)) {
                List<String> tags = JSONUtil.toList(tagsStr, String.class);
                postVO.setTagList(tags);
            }
            return postVO;
        }).collect(Collectors.toList());
        postVOPage.setRecords(postVOList);
        return postVOPage;
    }
}

