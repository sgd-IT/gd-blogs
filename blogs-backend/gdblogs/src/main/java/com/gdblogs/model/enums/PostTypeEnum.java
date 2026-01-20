package com.gdblogs.model.enums;

/**
 * 文章类型枚举
 */
public enum PostTypeEnum {

    ORIGINAL("原创", "original"),
    SHARE("分享", "share");

    private final String text;

    private final String value;

    PostTypeEnum(String text, String value) {
        this.text = text;
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public String getText() {
        return text;
    }
}
