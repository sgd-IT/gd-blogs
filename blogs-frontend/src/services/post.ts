import { ApiResp, PageResp, PostVO } from "@/types";
import { API_PREFIX } from "@/lib/api-config";

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
  type?: string; // 文章类型：original(原创)/share(分享)
}

export async function listPostVoByPage(params: PostQueryRequest) {
  const res = await fetch(`${API_PREFIX}/post/list/page/vo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data: ApiResp<PageResp<PostVO>> = await res.json();
  return data;
}

