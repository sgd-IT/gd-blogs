"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

export default function UserLoginPage() {
  const [userAccount, setUserAccount] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAccount,
          userPassword,
        }),
      });
      const data = await res.json();
      if (data.code === 0) {
        // Navbar 位于 layout，不会自动重新挂载；这里直接刷新以更新登录态
        window.location.href = "/";
        return;
      }
      setErrorMsg(data.message ?? "登录失败");
    } catch (err) {
      setErrorMsg("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-md px-4 pt-28">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">登录</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">使用你的账号密码登录。</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">账号</label>
            <input
              value={userAccount}
              onChange={(e) => setUserAccount(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-800 dark:bg-black dark:text-white"
              placeholder="请输入账号"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">密码</label>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-800 dark:bg-black dark:text-white"
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </div>

          {errorMsg ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {errorMsg}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </main>
  );
}


