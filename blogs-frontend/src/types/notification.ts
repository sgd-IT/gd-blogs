import type { LoginUserVO, ApiResp, PageResp } from "./post";

export type NotificationType = "comment" | "reply" | "thumb" | "favour" | "system";

export interface NotificationVO {
  id: number;
  type: NotificationType | string;
  content: string;
  receiverId?: number;
  senderId?: number;
  postId?: number;
  commentId?: number;
  status?: number; // 0 未读 / 1 已读
  createTime?: string;
  updateTime?: string;
  sender?: LoginUserVO;
}

export interface NotificationQueryRequest {
  pageNum?: number;
  pageSize?: number;
  status?: number;
  type?: NotificationType;
  sortField?: string;
  sortOrder?: string;
}

export interface NotificationReadRequest {
  ids: number[];
}

export type NotificationApiResp<T> = ApiResp<T>;
export type NotificationPageResp<T> = PageResp<T>;
