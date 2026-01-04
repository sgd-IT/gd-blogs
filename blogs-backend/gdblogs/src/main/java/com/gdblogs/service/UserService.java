package com.gdblogs.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.gdblogs.model.dto.user.UserLoginRequest;
import com.gdblogs.model.dto.user.UserRegisterRequest;
import com.gdblogs.model.entity.User;
import com.gdblogs.model.vo.LoginUserVO;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 用户服务
 */
public interface UserService extends IService<User> {

    /**
     * 用户注册
     *
     * @param userRegisterRequest 注册信息
     * @return 新用户 id
     */
    long userRegister(UserRegisterRequest userRegisterRequest);

    /**
     * 用户登录
     *
     * @param userLoginRequest  登录信息
     * @param request           HttpServletRequest
     * @return 脱敏后的用户信息
     */
    LoginUserVO userLogin(UserLoginRequest userLoginRequest, HttpServletRequest request);

    /**
     * 获取当前登录用户
     *
     * @param request HttpServletRequest
     * @return 脱敏后的用户信息
     */
    LoginUserVO getLoginUser(HttpServletRequest request);

    /**
     * 获取脱敏后的用户信息
     *
     * @param user
     * @return
     */
    LoginUserVO getLoginUserVO(User user);

    /**
     * 是否为管理员
     *
     * @param request HttpServletRequest
     * @return true/false
     */
    boolean isAdmin(HttpServletRequest request);

    /**
     * 用户注销
     *
     * @param request HttpServletRequest
     * @return 是否成功
     */
    boolean userLogout(HttpServletRequest request);
}

