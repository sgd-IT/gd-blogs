package com.gdblogs.model.dto.post;

import com.gdblogs.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;
import java.util.List;

/**
 * 查询请求
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class PostQueryRequest extends PageRequest implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * id 列表
     */
    private List<Long> ids;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 搜索词
     */
    private String searchText;

    /**
     * 标签列表
     */
    private List<String> tags;

    /**
     * 创建用户 id
     */
    private Long userId;

    /**
     * 分类 id
     */
    private Long categoryId;

    /**
     * 文章类型：original(原创)/share(分享)
     */
    private String type;

    /**
     * 是否精选
     */
    private Integer isFeatured;

    /**
     * 是否展示在主页
     */
    private Integer isHome;

    private static final long serialVersionUID = 1L;
}

