import type {
  ApiResp,
  CommentAddRequest,
  CommentQueryRequest,
  CommentVO,
  PageResp,
} from "@/types";
import { API_PREFIX } from "@/lib/api-config";

export async function listCommentVoByPage(params: CommentQueryRequest) {
  const res = await fetch(`${API_PREFIX}/comment/list/page/vo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(params),
  });
  const data: ApiResp<PageResp<CommentVO>> = await res.json();
  return data;
}

export async function addComment(data: CommentAddRequest) {
  const res = await fetch(`${API_PREFIX}/comment/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const resp: ApiResp<number> = await res.json();
  return resp;
}

export async function deleteComment(id: number) {
  const res = await fetch(`${API_PREFIX}/comment/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id }),
  });
  const resp: ApiResp<boolean> = await res.json();
  return resp;
}
