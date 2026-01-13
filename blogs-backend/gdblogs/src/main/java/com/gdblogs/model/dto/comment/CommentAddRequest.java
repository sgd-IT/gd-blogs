package com.gdblogs.model.dto.comment;

import lombok.Data;

import java.io.Serializable;

/**
 * 创建评论请求
 */
@Data
public class CommentAddRequest implements Serializable {

    /**
     * 评论内容
     */
    private String content;

    /**
     * 帖子 id
     */
    private Long postId;

    /**
     * 父评论 id（回复时使用）
     */
    private Long parentId;

    private static final long serialVersionUID = 1L;
}
