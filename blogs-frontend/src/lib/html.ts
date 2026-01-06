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
 * 移除 Markdown 语法，返回尽量干净的纯文本（轻量级实现）
 */
export function stripMarkdown(md: string): string {
  if (!md) return "";
  let text = md;
  // 去掉 fenced code block
  text = text.replace(/```[\s\S]*?```/g, "");
  // 去掉行内 code
  text = text.replace(/`([^`]+)`/g, "$1");
  // 图片 ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
  // 链接 [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // 标题/引用/列表标记
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  text = text.replace(/^\s{0,3}>\s+/gm, "");
  text = text.replace(/^\s{0,3}[-*+]\s+/gm, "");
  text = text.replace(/^\s{0,3}\d+\.\s+/gm, "");
  // 粗体/斜体/删除线
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");
  text = text.replace(/~~([^~]+)~~/g, "$1");
  // 表格分隔符/多余符号
  text = text.replace(/\|/g, " ");
  text = text.replace(/-{3,}/g, " ");
  // 合并空白
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

/**
 * 兼容 HTML / Markdown：自动剥离为纯文本
 */
export function stripRichText(content: string): string {
  if (!content) return "";
  const looksLikeHtml = /<[^>]+>/.test(content);
  return looksLikeHtml ? stripHtml(content) : stripMarkdown(content);
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

