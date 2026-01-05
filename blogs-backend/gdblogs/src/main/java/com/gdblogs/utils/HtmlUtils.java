package com.gdblogs.utils;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

/**
 * HTML 清洗工具类，防止 XSS 攻击
 */
public class HtmlUtils {

    /**
     * 清洗 HTML，只保留安全的标签和属性
     */
    public static String cleanHtml(String html) {
        if (html == null || html.isEmpty()) {
            return html;
        }

        // 自定义白名单：允许常见的富文本标签
        Safelist safelist = Safelist.relaxed()
                // 允许的标签
                .addTags("h1", "h2", "h3", "h4", "h5", "h6")
                .addTags("p", "br", "span", "div")
                .addTags("strong", "b", "em", "i", "u", "s", "del")
                .addTags("ul", "ol", "li")
                .addTags("blockquote", "pre", "code")
                .addTags("a", "img")
                // 允许的属性
                .addAttributes("a", "href", "title", "target")
                .addAttributes("img", "src", "alt", "title", "width", "height")
                .addAttributes("*", "class")
                // 允许的协议
                .addProtocols("a", "href", "http", "https", "mailto")
                .addProtocols("img", "src", "http", "https", "data");

        return Jsoup.clean(html, safelist);
    }

    /**
     * 移除所有 HTML 标签，只保留纯文本
     */
    public static String stripHtml(String html) {
        if (html == null || html.isEmpty()) {
            return html;
        }
        return Jsoup.parse(html).text();
    }
}

