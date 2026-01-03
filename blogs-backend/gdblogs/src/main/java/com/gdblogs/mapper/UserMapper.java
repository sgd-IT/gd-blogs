package com.gdblogs.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gdblogs.model.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户数据库操作
 */

public interface UserMapper extends BaseMapper<User> {
}

