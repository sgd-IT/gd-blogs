package com.gdblogs.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdblogs.mapper.CategoryMapper;
import com.gdblogs.model.entity.Category;
import com.gdblogs.service.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 分类服务实现
 */
@Service
@Slf4j
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {
}

