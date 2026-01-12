export async function updateMyUser(data: {
  userName?: string;
  userAvatar?: string;
  userProfile?: string;
}) {
  const res = await fetch("/api/user/update/my", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function getLoginUser() {
  const res = await fetch("/api/user/get/login", {
    method: "GET",
  });
  return await res.json();
}

export async function userLogout() {
  const res = await fetch("/api/user/logout", {
    method: "POST",
  });
  return await res.json();
}
