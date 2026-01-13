import type { ApiResp, LoginUserVO, PageResp } from "./post";

export interface CommentVO {
  id: number;
  content: string;
  postId: number;
  userId: number;
  parentId?: number | null;
  createTime?: string;
  updateTime?: string;
  user?: LoginUserVO;
  children?: CommentVO[];
}

export interface CommentAddRequest {
  content: string;
  postId: number;
  parentId?: number | null;
}

export interface CommentQueryRequest {
  postId: number;
  pageNum?: number;
  pageSize?: number;
  parentId?: number | null;
}

// 便捷再导出，复用已有通用响应类型
export type CommentApiResp<T> = ApiResp<T>;
export type CommentPageResp<T> = PageResp<T>;
