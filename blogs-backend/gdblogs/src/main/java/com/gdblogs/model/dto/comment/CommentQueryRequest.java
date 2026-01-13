package com.gdblogs.model.dto.comment;

import com.gdblogs.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 评论查询请求
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class CommentQueryRequest extends PageRequest implements Serializable {

    /**
     * 评论 id
     */
    private Long id;

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

    private static final long serialVersionUID = 1L;
}
