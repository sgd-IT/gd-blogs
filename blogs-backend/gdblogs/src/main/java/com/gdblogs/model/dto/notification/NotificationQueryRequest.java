package com.gdblogs.model.dto.notification;

import com.gdblogs.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 通知查询请求
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class NotificationQueryRequest extends PageRequest implements Serializable {

    /**
     * 状态：0未读 / 1已读
     */
    private Integer status;

    /**
     * 类型：comment / reply / thumb / favour / system
     */
    private String type;

    private static final long serialVersionUID = 1L;
}

