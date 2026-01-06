package com.gdblogs.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gdblogs.model.entity.Post;
import org.apache.ibatis.annotations.Mapper;

/**
 * 帖子数据库操作
 */
@Mapper
public interface PostMapper extends BaseMapper<Post> {

}

