/**
 * 文章相关类型定义
 */

// 登录用户信息
export interface LoginUserVO {
  id?: number;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
}

// 文章视图对象
export interface PostVO {
  id: number;
  title: string;
  content: string;
  categoryId?: number;
  coverImage?: string;
  summary?: string;
  createTime?: string;
  updateTime?: string;
  tagList?: string[];
  thumbNum?: number;
  favourNum?: number;
  userId?: number;
  user?: LoginUserVO;
  isHome?: number;
}

// 分页响应
export interface PageResp<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// API 响应
export interface ApiResp<T> {
  code: number;
  data?: T;
  message?: string;
}

// 文章创建请求
export interface PostAddRequest {
  title: string;
  content: string;
  tags: string[];
  categoryId?: number;
  coverImage?: string;
  summary?: string;
  isHome?: number;
}

// 文章更新请求
export interface PostUpdateRequest {
  id: number;
  title: string;
  content: string;
  tags: string[];
  categoryId?: number;
  coverImage?: string;
  summary?: string;
  isHome?: number;
}

// 编辑器模式
export type EditorMode = "create" | "edit";

// 编辑器数据
export interface EditorData {
  title: string;
  content: string;
  tags: string[];
}

// 草稿数据
export interface DraftData extends EditorData {
  savedAt: number; // 时间戳
  postId?: number; // 编辑模式下的文章 ID
}

// 发布设置
export interface PublishSettings {
  categoryId?: number;
  coverImage?: string;
  summary?: string;
  isHome?: number;
}
