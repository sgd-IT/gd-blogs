package com.gdblogs.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gdblogs.model.dto.comment.CommentQueryRequest;
import com.gdblogs.model.entity.Comment;
import com.gdblogs.model.vo.CommentVO;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 评论服务
 */
public interface CommentService extends IService<Comment> {

    /**
     * 校验
     *
     * @param comment 评论
     * @param add     是否为创建
     */
    void validComment(Comment comment, boolean add);

    /**
     * 获取查询包装类
     *
     * @param commentQueryRequest 查询条件
     * @return QueryWrapper
     */
    QueryWrapper<Comment> getQueryWrapper(CommentQueryRequest commentQueryRequest);

    /**
     * 评论转视图
     *
     * @param comment 评论实体
     * @param request 请求
     * @return CommentVO
     */
    CommentVO getCommentVO(Comment comment, HttpServletRequest request);

    /**
     * 评论分页转视图
     *
     * @param commentPage 评论分页
     * @param request     请求
     * @return CommentVO 分页
     */
    Page<CommentVO> getCommentVOPage(Page<Comment> commentPage, HttpServletRequest request);

    /**
     * 分页获取帖子评论（只分页顶级评论，并在每条记录内填充 children）
     *
     * @param commentQueryRequest 查询条件（至少包含 postId）
     * @param request             请求
     * @return CommentVO 分页（records 为顶级评论列表，且已填充 children）
     */
    Page<CommentVO> listCommentVOByPage(CommentQueryRequest commentQueryRequest, HttpServletRequest request);
}
