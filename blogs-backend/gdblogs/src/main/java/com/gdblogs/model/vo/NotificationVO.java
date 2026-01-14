package com.gdblogs.model.vo;

import com.gdblogs.model.entity.Notification;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;

/**
 * 通知视图对象
 */
@Data
public class NotificationVO implements Serializable {

    private Long id;

    /**
     * 通知类型
     */
    private String type;

    /**
     * 通知内容（展示文案）
     */
    private String content;

    /**
     * 接收者
     */
    private Long receiverId;

    /**
     * 触发者
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

    private Date createTime;

    private Date updateTime;

    /**
     * 触发者用户信息（脱敏）
     */
    private LoginUserVO sender;

    public static NotificationVO objToVo(Notification notification) {
        if (notification == null) {
            return null;
        }
        NotificationVO notificationVO = new NotificationVO();
        BeanUtils.copyProperties(notification, notificationVO);
        return notificationVO;
    }

    private static final long serialVersionUID = 1L;
}

