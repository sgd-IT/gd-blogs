/**
 * HTML 处理工具函数
 */

/**
 * 移除 HTML 标签，返回纯文本
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

/**
 * 计算文本字数（排除 HTML 标签和空白字符）
 */
export function countWords(html: string): number {
  const text = stripHtml(html);
  // 移除所有空白字符后计算长度
  return text.replace(/\s/g, "").length;
}

/**
 * 截取文本摘要
 */
export function getExcerpt(html: string, maxLength: number = 200): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

