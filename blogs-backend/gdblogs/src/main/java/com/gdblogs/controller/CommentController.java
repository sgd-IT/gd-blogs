package com.gdblogs.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdblogs.annotation.AuthCheck;
import com.gdblogs.common.BaseResponse;
import com.gdblogs.common.DeleteRequest;
import com.gdblogs.common.ResultUtils;
import com.gdblogs.constant.UserConstant;
import com.gdblogs.exception.BusinessException;
import com.gdblogs.exception.ErrorCode;
import com.gdblogs.exception.ThrowUtils;
import com.gdblogs.model.dto.comment.CommentAddRequest;
import com.gdblogs.model.dto.comment.CommentQueryRequest;
import com.gdblogs.model.entity.Comment;
import com.gdblogs.model.entity.User;
import com.gdblogs.model.vo.CommentVO;
import com.gdblogs.service.CommentService;
import com.gdblogs.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

/**
 * 评论接口
 */
@RestController
@RequestMapping("/comment")
@Slf4j
public class CommentController {

    @Resource
    private CommentService commentService;

    @Resource
    private UserService userService;

    /**
     * 创建评论
     */
    @AuthCheck(mustRole = UserConstant.DEFAULT_ROLE)
    @PostMapping("/add")
    public BaseResponse<Long> addComment(@RequestBody CommentAddRequest commentAddRequest, HttpServletRequest request) {
        if (commentAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        Comment comment = new Comment();
        BeanUtils.copyProperties(commentAddRequest, comment);
        User loginUser = (User) request.getSession().getAttribute("user_login");
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        comment.setUserId(loginUser.getId());
        commentService.validComment(comment, true);
        boolean result = commentService.save(comment);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(comment.getId());
    }

    /**
     * 删除评论（本人或管理员）
     */
    @AuthCheck(mustRole = UserConstant.DEFAULT_ROLE)
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteComment(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = (User) request.getSession().getAttribute("user_login");
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        long id = deleteRequest.getId();
        Comment oldComment = commentService.getById(id);
        ThrowUtils.throwIf(oldComment == null, ErrorCode.NOT_FOUND_ERROR);
        if (!oldComment.getUserId().equals(loginUser.getId()) && !userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean result = commentService.removeById(id);
        return ResultUtils.success(result);
    }

    /**
     * 分页获取帖子评论列表
     */
    @PostMapping("/list/page/vo")
    public BaseResponse<Page<CommentVO>> listCommentVOByPage(@RequestBody CommentQueryRequest commentQueryRequest,
                                                             HttpServletRequest request) {
        if (commentQueryRequest == null || commentQueryRequest.getPostId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "postId 不能为空");
        }
        long current = commentQueryRequest.getPageNum() <= 0 ? 1L : commentQueryRequest.getPageNum();
        long size = commentQueryRequest.getPageSize() <= 0 ? 10L : commentQueryRequest.getPageSize();
        ThrowUtils.throwIf(size > 50, ErrorCode.PARAMS_ERROR);
        commentQueryRequest.setPageNum((int) current);
        commentQueryRequest.setPageSize((int) size);
        return ResultUtils.success(commentService.listCommentVOByPage(commentQueryRequest, request));
    }
}
