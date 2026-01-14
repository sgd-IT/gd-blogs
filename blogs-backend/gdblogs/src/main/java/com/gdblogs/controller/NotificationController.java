package com.gdblogs.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdblogs.annotation.AuthCheck;
import com.gdblogs.common.BaseResponse;
import com.gdblogs.common.ResultUtils;
import com.gdblogs.constant.UserConstant;
import com.gdblogs.exception.BusinessException;
import com.gdblogs.exception.ErrorCode;
import com.gdblogs.exception.ThrowUtils;
import com.gdblogs.model.dto.notification.NotificationQueryRequest;
import com.gdblogs.model.dto.notification.NotificationReadRequest;
import com.gdblogs.model.vo.NotificationVO;
import com.gdblogs.service.NotificationService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 通知接口
 */
@RestController
@RequestMapping("/notification")
@Slf4j
public class NotificationController {

    @Resource
    private NotificationService notificationService;

    /**
     * 未读数
     */
    @AuthCheck(mustRole = UserConstant.DEFAULT_ROLE)
    @GetMapping("/unread/count")
    public BaseResponse<Long> getUnreadCount(HttpServletRequest request) {
        return ResultUtils.success(notificationService.getUnreadCount(request));
    }

    /**
     * 分页获取通知列表（VO）
     */
    @AuthCheck(mustRole = UserConstant.DEFAULT_ROLE)
    @PostMapping("/list/page/vo")
    public BaseResponse<Page<NotificationVO>> listNotificationVOByPage(@RequestBody NotificationQueryRequest notificationQueryRequest,
                                                                       HttpServletRequest request) {
        if (notificationQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        long current = notificationQueryRequest.getPageNum() <= 0 ? 1L : notificationQueryRequest.getPageNum();
        long size = notificationQueryRequest.getPageSize() <= 0 ? 10L : notificationQueryRequest.getPageSize();
        ThrowUtils.throwIf(size > 50, ErrorCode.PARAMS_ERROR);
        notificationQueryRequest.setPageNum((int) current);
        notificationQueryRequest.setPageSize((int) size);
        return ResultUtils.success(notificationService.listNotificationVOByPage(notificationQueryRequest, request));
    }

    /**
     * 批量标记已读
     */
    @AuthCheck(mustRole = UserConstant.DEFAULT_ROLE)
    @PostMapping("/read")
    public BaseResponse<Boolean> read(@RequestBody NotificationReadRequest notificationReadRequest, HttpServletRequest request) {
        if (notificationReadRequest == null || notificationReadRequest.getIds() == null || notificationReadRequest.getIds().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "ids 不能为空");
        }
        return ResultUtils.success(notificationService.readNotifications(notificationReadRequest.getIds(), request));
    }
}

