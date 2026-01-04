package com.gdblogs.aop;

import cn.hutool.core.util.StrUtil;
import com.gdblogs.annotation.AuthCheck;
import com.gdblogs.exception.ErrorCode;
import com.gdblogs.constant.UserConstant;
import com.gdblogs.exception.BusinessException;
import com.gdblogs.model.entity.User;
import com.gdblogs.model.enums.UserRoleEnum;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * 权限校验 AOP
 */
@Aspect
@Component
public class AuthInterceptor {

    /**
     * 执行拦截
     *
     * @param joinPoint 切入点
     * @param authCheck 注解
     * @return 结果
     */
    @Around("@annotation(authCheck)")
    public Object doInterceptor(ProceedingJoinPoint joinPoint, AuthCheck authCheck) throws Throwable {
        String mustRole = authCheck.mustRole();
        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();

        // 获取当前登录用户
        Object userObj = request.getSession().getAttribute(UserConstant.USER_LOGIN_STATE);
        User loginUser = (User) userObj;

        // 必须有该权限才通过
        if (StrUtil.isNotBlank(mustRole)) {
            // 1. 如果用户未登录，直接报错
            if (loginUser == null) {
                throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
            }

            // 获取当前用户的角色
            String userRole = loginUser.getUserRole();

            // 2. 如果当前用户没有任何角色（权限缺失），拒绝
            if (StrUtil.isBlank(userRole)) {
                throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
            }

            // 3. 具体权限判断逻辑
            // 如果要求的权限是 "admin" (管理员)
            if (UserRoleEnum.ADMIN.getValue().equals(mustRole)) {
                // 如果当前用户不是 "admin"（例如是 "user"），则拒绝
                if (!UserRoleEnum.ADMIN.getValue().equals(userRole)) {
                    throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
                }
            }
            // 如果要求的权限是 "user" (普通用户)，通常管理员也能访问，或者必须完全匹配
            // 这里实现为：只要角色匹配或者当前用户是管理员，都放行
            else if (UserRoleEnum.USER.getValue().equals(mustRole)) {
                // 如果既不是 user 也不是 admin，拒绝（防止未来有其他角色）
                if (!UserRoleEnum.USER.getValue().equals(userRole) && !UserRoleEnum.ADMIN.getValue().equals(userRole)) {
                    throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
                }
            }
        }

        // 如果 mustRole 为空，或者校验通过，继续执行原方法
        return joinPoint.proceed();
    }
}

