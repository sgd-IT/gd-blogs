package com.gdblogs.controller;

import com.gdblogs.common.BaseResponse;
import com.gdblogs.common.ResultUtils;
import com.gdblogs.model.entity.Category;
import com.gdblogs.service.CategoryService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类接口
 */
@RestController
@RequestMapping("/category")
@Slf4j
public class CategoryController {

    @Resource
    private CategoryService categoryService;

    /**
     * 获取所有分类列表
     *
     * @return 分类列表
     */
    @GetMapping("/list")
    public BaseResponse<List<Category>> listCategories() {
        List<Category> categories = categoryService.list();
        return ResultUtils.success(categories);
    }
}

