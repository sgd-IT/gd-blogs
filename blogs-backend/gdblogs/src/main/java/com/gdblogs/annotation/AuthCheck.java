package com.gdblogs.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 权限校验注解
 * 加上该注解的方法，会拦截并判断是否具有特定权限
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthCheck {

    /**
     * 必须具备的角色，如果不传则默认不需要特定权限（只要登录即可）
     */
    String mustRole() default "";

}

