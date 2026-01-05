"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Github, Search, Sparkles } from "lucide-react";
import { stripHtml } from "@/lib/html";
import type { LoginUserVO, PostVO, PageResp, ApiResp } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

const OPEN_SOURCE_PROJECTS = [
  {
    name: "gd-blogs",
    desc: "个人全栈博客（权限 / 发布 / 文章管理 / 列表检索）",
    tags: ["Next.js", "Spring Boot", "MySQL"],
    repoUrl: "https://github.com/yourname/gd-blogs",
    homeUrl: "",
  },
  {
    name: "PaddleOCR-VL",
    desc: "开源视觉语言 OCR 工具，多模态识别提升文档处理效率",
    tags: ["Python", "OCR", "VLM"],
    repoUrl: "https://github.com/PaddlePaddle/PaddleOCR",
    homeUrl: "https://github.com/PaddlePaddle/PaddleOCR",
  },
];

export default function BlogsPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState<PageResp<PostVO> | null>(null);

  const hasQuery = useMemo(
    () => submittedQuery.trim().length > 0,
    [submittedQuery]
  );

  useEffect(() => {
    const fetchPosts = async (searchText: string) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`${API_BASE_URL}/post/list/page/vo`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageNum: 1,
            pageSize: 10,
            searchText: searchText?.trim() || undefined,
            sortField: "updateTime",
            sortOrder: "descend",
          }),
        });

        const data: ApiResp<PageResp<PostVO>> = await res.json();
        if (data.code === 0 && data.data) {
          setPage(data.data);
          return;
        }
        setErrorMsg(data.message ?? "获取失败");
      } catch {
        setErrorMsg("获取失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts(submittedQuery);
  }, [submittedQuery]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query);
  };

  const onAISearch = () => {
    // 先按普通搜索走通；后续你接入 AI 检索/摘要时再替换这里
    setSubmittedQuery(query);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 1) 搜索框 */}
        <section className="py-6">
          <div className="rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-md p-5 shadow-sm dark:border-gray-800 dark:bg-black/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  博客检索
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  搜索文章标题/内容（后端接口：/post/list/page/vo）
                </div>
              </div>
            </div>

            <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-800 dark:bg-black dark:text-white"
                  placeholder="输入关键词：例如「时序图 / Triton / Java / 前端」"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                搜索
              </button>

              <button
                type="button"
                onClick={onAISearch}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                <Sparkles className="h-4 w-4" />
                AI 搜索
              </button>
            </form>

            {hasQuery ? (
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                当前关键词：
                <span className="ml-1 font-semibold text-gray-800 dark:text-gray-200">
                  {submittedQuery}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        {/* 2) 开源项目 */}
        <section className="py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                开源项目
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                先用 mock，后续你再接真实数据源
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPEN_SOURCE_PROJECTS.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {p.name}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {p.desc}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
                    >
                      <Github className="h-4 w-4" />
                      Repo
                    </a>
                    {p.homeUrl ? (
                      <a
                        href={p.homeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
                      >
                        <ExternalLink className="h-4 w-4" />
                        详情
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3) 博客文章 */}
        <section className="py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                博客文章
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                分页列表（默认按 updateTime 倒序）
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/post/create"
                className="text-sm font-semibold text-orange-600 hover:underline"
              >
                写文章
              </Link>
              <Link
                href="/post/my"
                className="text-sm font-semibold text-purple-600 hover:underline"
              >
                我的文章
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              加载中...
            </div>
          ) : errorMsg ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {errorMsg}
            </div>
          ) : (
            <div className="space-y-4">
              {(page?.records ?? []).length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600 dark:border-gray-800 dark:bg-black dark:text-gray-300">
                  暂无文章数据，你可以先去{" "}
                  <Link className="text-purple-600 hover:underline" href="/post/create">
                    写一篇
                  </Link>
                  。
                </div>
              ) : (
                (page?.records ?? []).map((p) => (
                  <Link
                    href={`/post/${p.id}`}
                    key={p.id}
                    className="block rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow dark:border-gray-800 dark:bg-black"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                          {p.title}
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {stripHtml(p.content)}
                        </div>

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

                        {p.user?.userName ? (
                          <div className="mt-3 text-xs text-gray-400">
                            作者：{p.user.userName}
                          </div>
                        ) : null}
                      </div>

                      <div className="text-xs text-gray-400 shrink-0">
                        {p.updateTime ?? p.createTime ?? ""}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

