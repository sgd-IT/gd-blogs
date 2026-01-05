/**
 * 草稿存储工具
 * 使用 localStorage 实现自动保存和恢复
 */

import type { DraftData } from "@/types";

const DRAFT_KEY_PREFIX = "blog_draft_";
const CREATE_DRAFT_KEY = `${DRAFT_KEY_PREFIX}create`;

/**
 * 获取编辑模式的草稿 key
 */
function getEditDraftKey(postId: number | string): string {
  return `${DRAFT_KEY_PREFIX}edit_${postId}`;
}

/**
 * 保存创建模式的草稿
 */
export function saveCreateDraft(data: { title: string; content: string; tags: string[] }): void {
  if (typeof window === "undefined") return;
  
  const draft: DraftData = {
    ...data,
    savedAt: Date.now(),
  };
  
  try {
    localStorage.setItem(CREATE_DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error("保存草稿失败:", error);
  }
}

/**
 * 获取创建模式的草稿
 */
export function getCreateDraft(): DraftData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const data = localStorage.getItem(CREATE_DRAFT_KEY);
    if (!data) return null;
    return JSON.parse(data) as DraftData;
  } catch (error) {
    console.error("读取草稿失败:", error);
    return null;
  }
}

/**
 * 清除创建模式的草稿
 */
export function clearCreateDraft(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(CREATE_DRAFT_KEY);
  } catch (error) {
    console.error("清除草稿失败:", error);
  }
}

/**
 * 保存编辑模式的草稿
 */
export function saveEditDraft(
  postId: number | string,
  data: { title: string; content: string; tags: string[] }
): void {
  if (typeof window === "undefined") return;
  
  const draft: DraftData = {
    ...data,
    savedAt: Date.now(),
    postId: Number(postId),
  };
  
  try {
    localStorage.setItem(getEditDraftKey(postId), JSON.stringify(draft));
  } catch (error) {
    console.error("保存草稿失败:", error);
  }
}

/**
 * 获取编辑模式的草稿
 */
export function getEditDraft(postId: number | string): DraftData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const data = localStorage.getItem(getEditDraftKey(postId));
    if (!data) return null;
    return JSON.parse(data) as DraftData;
  } catch (error) {
    console.error("读取草稿失败:", error);
    return null;
  }
}

/**
 * 清除编辑模式的草稿
 */
export function clearEditDraft(postId: number | string): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(getEditDraftKey(postId));
  } catch (error) {
    console.error("清除草稿失败:", error);
  }
}

/**
 * 格式化保存时间
 */
export function formatSavedTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;
  
  // 1分钟内
  if (diff < 60 * 1000) {
    return "刚刚";
  }
  
  // 1小时内
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }
  
  // 今天
  if (date.toDateString() === now.toDateString()) {
    return `今天 ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }
  
  // 其他
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

