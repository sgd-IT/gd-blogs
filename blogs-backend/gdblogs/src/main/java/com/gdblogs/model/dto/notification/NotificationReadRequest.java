package com.gdblogs.model.dto.notification;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 批量标记通知已读请求
 */
@Data
public class NotificationReadRequest implements Serializable {

    /**
     * 通知 id 列表
     */
    private List<Long> ids;

    private static final long serialVersionUID = 1L;
}

