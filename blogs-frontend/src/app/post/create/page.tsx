"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

export default function PostCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const tags = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`${API_BASE_URL}/post/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          tags,
        }),
      });
      const data = await res.json();
      if (data.code === 0) {
        setSuccessMsg("发布成功");
        setTitle("");
        setContent("");
        setTagsText("");
        // 发布成功后跳转到“我的文章”
        setTimeout(() => {
          window.location.href = "/post/my";
        }, 400);
        return;
      }
      setErrorMsg(data.message ?? "发布失败");
    } catch (err) {
      setErrorMsg("发布失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">写文章</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">最小可用创作页：标题、内容、标签。</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">标题</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-800 dark:bg-black dark:text-white"
              placeholder="请输入标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 min-h-[220px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-800 dark:bg-black dark:text-white"
              placeholder="请输入内容"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">标签（逗号分隔）</label>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-800 dark:bg-black dark:text-white"
              placeholder="例如：Java, SpringBoot, MyBatisPlus"
            />
          </div>

          {errorMsg ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {errorMsg}
            </div>
          ) : null}

          {successMsg ? (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-200">
              {successMsg}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "发布中..." : "发布"}
          </button>
        </form>
      </div>
    </main>
  );
}


