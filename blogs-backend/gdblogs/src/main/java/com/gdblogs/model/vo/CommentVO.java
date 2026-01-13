package com.gdblogs.model.vo;

import com.gdblogs.model.entity.Comment;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 评论视图对象
 */
@Data
public class CommentVO implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 帖子 id
     */
    private Long postId;

    /**
     * 评论用户 id
     */
    private Long userId;

    /**
     * 父评论 id
     */
    private Long parentId;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 评论用户信息
     */
    private LoginUserVO user;

    /**
     * 子评论
     */
    private List<CommentVO> children;

    /**
     * 对象转包装类
     */
    public static CommentVO objToVo(Comment comment) {
        if (comment == null) {
            return null;
        }
        CommentVO commentVO = new CommentVO();
        BeanUtils.copyProperties(comment, commentVO);
        return commentVO;
    }

    private static final long serialVersionUID = 1L;
}
