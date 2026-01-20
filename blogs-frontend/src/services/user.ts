import { API_PREFIX } from "@/lib/api-config";

export async function updateMyUser(data: {
  userName?: string;
  userAvatar?: string;
  userProfile?: string;
}) {
  const res = await fetch(`${API_PREFIX}/user/update/my`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function getLoginUser() {
  const res = await fetch(`${API_PREFIX}/user/get/login`, {
    method: "GET",
  });
  return await res.json();
}

export async function userLogout() {
  const res = await fetch(`${API_PREFIX}/user/logout`, {
    method: "POST",
  });
  return await res.json();
}
