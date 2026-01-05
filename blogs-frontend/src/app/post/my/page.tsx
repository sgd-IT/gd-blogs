"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { stripHtml } from "@/lib/html";
import type { PostVO, PageResp } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

export default function MyPostsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState<PageResp<PostVO> | null>(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`${API_BASE_URL}/post/my/list/page/vo`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageNum: 1,
            pageSize: 10,
          }),
        });
        const data = await res.json();
        if (data.code === 0 && data.data) {
          setPage(data.data);
          return;
        }
        setErrorMsg(data.message ?? "获取失败");
      } catch (err) {
        setErrorMsg("获取失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };
    void fetchMyPosts();
  }, []);

  const handleDelete = async (postId: number) => {
    if (!confirm("确定要删除这篇文章吗？")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/post/delete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });
      const data = await res.json();
      if (data.code === 0) {
        alert("删除成功");
        // 刷新页面
        window.location.reload();
      } else {
        alert(data.message ?? "删除失败");
      }
    } catch (err) {
      alert("删除失败，请稍后重试");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">我的文章</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">这里展示你创建的帖子列表。</p>
          </div>
          <Link
            href="/post/create"
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            + 创作
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">加载中...</div>
          ) : errorMsg ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {errorMsg}
            </div>
          ) : (
            <div className="space-y-4">
              {(page?.records ?? []).length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600 dark:border-gray-800 dark:bg-black dark:text-gray-300">
                  你还没有发布文章，去 <Link className="text-purple-600 hover:underline" href="/post/create">写一篇</Link> 吧。
                </div>
              ) : (
                (page?.records ?? []).map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link href={`/post/${p.id}`} className="block">
                          <div className="text-lg font-bold text-gray-900 dark:text-white hover:text-purple-600 transition-colors">{p.title}</div>
                          <div className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                            {stripHtml(p.content)}
                          </div>
                        </Link>
                        {p.tagList?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {p.tagList.map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-2 text-xs text-gray-400">
                          {p.updateTime ?? p.createTime ?? ""}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 shrink-0 pt-1">
                        <Link
                          href={`/post/${p.id}`}
                          className="text-xs font-medium text-gray-500 hover:text-purple-600 hover:underline"
                        >
                          查看
                        </Link>
                        <Link
                          href={`/post/edit/${p.id}`}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs font-medium text-red-600 hover:underline text-left"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
