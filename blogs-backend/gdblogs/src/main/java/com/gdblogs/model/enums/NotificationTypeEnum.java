package com.gdblogs.model.enums;

/**
 * 通知类型枚举
 */
public enum NotificationTypeEnum {

    COMMENT("评论", "comment"),
    REPLY("回复", "reply"),
    THUMB("点赞", "thumb"),
    FAVOUR("收藏", "favour"),
    SYSTEM("系统", "system");

    private final String text;

    private final String value;

    NotificationTypeEnum(String text, String value) {
        this.text = text;
        this.value = value;
    }

    public String getText() {
        return text;
    }

    public String getValue() {
        return value;
    }
}

