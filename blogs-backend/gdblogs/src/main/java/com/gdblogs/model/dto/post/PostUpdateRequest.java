package com.gdblogs.model.dto.post;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

/**
 * 更新请求
 */
@Data
public class PostUpdateRequest implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 标签列表
     */
    private List<String> tags;

    /**
     * 封面图片
     */
    private String coverImage;

    /**
     * 文章摘要
     */
    private String summary;

    /**
     * 分类 id
     */
    private Long categoryId;

    /**
     * 是否精选
     */
    private Integer isFeatured;

    /**
     * 外部链接
     */
    private String externalLink;

    /**
     * 是否展示在主页
     */
    private Integer isHome;

    private static final long serialVersionUID = 1L;
}

