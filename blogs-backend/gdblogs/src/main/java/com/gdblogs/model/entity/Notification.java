package com.gdblogs.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 通知（站内通知）
 */
@TableName(value = "notification")
@Data
public class Notification implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 通知类型：comment / reply / thumb / favour / system
     */
    private String type;

    /**
     * 通知内容（展示文案）
     */
    private String content;

    /**
     * 接收者用户 id
     */
    private Long receiverId;

    /**
     * 触发者用户 id
     */
    private Long senderId;

    /**
     * 关联帖子 id
     */
    private Long postId;

    /**
     * 关联评论 id
     */
    private Long commentId;

    /**
     * 状态：0未读 / 1已读
     */
    private Integer status;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除
     */
    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}

