import { ApiResp, PageResp, PostVO } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

export interface PostQueryRequest {
  current?: number;
  pageSize?: number;
  pageNum?: number;
  sortField?: string;
  sortOrder?: string;
  isHome?: number;
  isFeatured?: number;
  searchText?: string;
  categoryId?: number;
}

export async function listPostVoByPage(params: PostQueryRequest) {
  const res = await fetch(`${API_BASE_URL}/post/list/page/vo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data: ApiResp<PageResp<PostVO>> = await res.json();
  return data;
}

