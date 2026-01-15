import type {
  NotificationQueryRequest,
  NotificationReadRequest,
  NotificationVO,
  ApiResp,
  PageResp,
} from "@/types";

const API_PREFIX = "/api";

export async function getNotificationUnreadCount() {
  const res = await fetch(`${API_PREFIX}/notification/unread/count`, {
    method: "GET",
    credentials: "include",
  });
  const data: ApiResp<number> = await res.json();
  return data;
}

export async function listNotificationVoByPage(params: NotificationQueryRequest) {
  const res = await fetch(`${API_PREFIX}/notification/list/page/vo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(params),
  });
  const data: ApiResp<PageResp<NotificationVO>> = await res.json();
  return data;
}

export async function readNotifications(data: NotificationReadRequest) {
  const res = await fetch(`${API_PREFIX}/notification/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const resp: ApiResp<boolean> = await res.json();
  return resp;
}
