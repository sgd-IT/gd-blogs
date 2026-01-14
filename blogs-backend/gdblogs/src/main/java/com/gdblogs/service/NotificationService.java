package com.gdblogs.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gdblogs.model.dto.notification.NotificationQueryRequest;
import com.gdblogs.model.entity.Comment;
import com.gdblogs.model.entity.Notification;
import com.gdblogs.model.entity.User;
import com.gdblogs.model.vo.NotificationVO;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

/**
 * 通知服务
 */
public interface NotificationService extends IService<Notification> {

    /**
     * 未读数
     */
    long getUnreadCount(HttpServletRequest request);

    /**
     * 分页获取通知（VO）
     */
    Page<NotificationVO> listNotificationVOByPage(NotificationQueryRequest notificationQueryRequest, HttpServletRequest request);

    /**
     * 批量标记已读（仅能标记自己的通知）
     */
    boolean readNotifications(List<Long> ids, HttpServletRequest request);

    /**
     * 由评论/回复生成通知（最小可用版）
     */
    void createByComment(Comment comment, User sender);
}

