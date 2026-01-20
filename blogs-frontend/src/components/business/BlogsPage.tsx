"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Github, Search, Sparkles, Eye, ThumbsUp, Heart } from "lucide-react";
import { stripRichText } from "@/lib/html";
import type { LoginUserVO, PostVO, PageResp, ApiResp } from "@/types";
import { API_PREFIX } from "@/lib/api-config";

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
        const res = await fetch(`${API_PREFIX}/post/list/page/vo`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageNum: 1,
            pageSize: 10,
            searchText: searchText?.trim() || undefined,
            sortField: "createTime", // 改为 createTime 可能更符合常见的博客流
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
    setSubmittedQuery(query);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="container mx-auto px-4 max-w-5xl">
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
                  搜索文章标题/内容
                </div>
              </div>
            </div>

            <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-800 dark:bg-black dark:text-white"
                  placeholder="输入关键词..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                搜索
              </button>
              <button
                type="button"
                onClick={onAISearch}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                AI 搜索
              </button>
            </form>
          </div>
        </section>

        {/* 2) 博客文章列表 */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              最新文章
            </h2>
            <div className="flex items-center gap-4">
              <Link
                href="/post/create"
                className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                写文章
              </Link>
              <Link
                href="/post/my"
                className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
              >
                我的文章
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              加载中...
            </div>
          ) : errorMsg ? (
            <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
              {errorMsg}
            </div>
          ) : (
            <div className="space-y-4">
              {(page?.records ?? []).length === 0 ? (
                <div className="py-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  暂无文章，
                  <Link href="/post/create" className="text-purple-600 hover:underline">
                    来写一篇吧
                  </Link>
                </div>
              ) : (
                (page?.records ?? []).map((p) => (
                  <Link
                    href={`/post/${p.id}`}
                    key={p.id}
                    className="group block rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition-all dark:bg-black border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex gap-6">
                      {/* 左侧：内容区 */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        {/* 顶部：作者与时间 */}
                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                           {p.user?.userAvatar ? (
                              <img src={p.user.userAvatar} alt={p.user.userName} className="w-5 h-5 rounded-full object-cover" />
                           ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                           )}
                           <span className="font-medium text-gray-700 dark:text-gray-300">{p.user?.userName || "匿名用户"}</span>
                           <span className="text-gray-300 dark:text-gray-700">|</span>
                           <span>{p.createTime?.substring(0, 10)}</span>
                        </div>

                        {/* 标题 */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                          {p.title}
                        </h3>

                        {/* 摘要：优先使用 summary，否则截取 content */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                           {p.summary || stripRichText(p.content).substring(0, 120)}
                        </p>

                        {/* 底部：数据统计 */}
                        <div className="flex items-center gap-5 text-xs text-gray-400">
                           {/* 模拟阅读量 */}
                           <div className="flex items-center gap-1.5">
                             <Eye size={14} />
                             <span>{Math.floor(Math.random() * 2000) + 100}</span> 
                           </div>
                           <div className="flex items-center gap-1.5">
                             <ThumbsUp size={14} className={p.thumbNum ? "text-gray-400" : ""} />
                             <span>{p.thumbNum || 0}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                             <Heart size={14} />
                             <span>{p.favourNum || 0}</span>
                           </div>
                           
                           {/* 标签 */}
                           {p.tagList && p.tagList.length > 0 && (
                             <div className="flex items-center gap-2 ml-auto">
                               {p.tagList.slice(0, 2).map(tag => (
                                 <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px]">
                                   {tag}
                                 </span>
                               ))}
                             </div>
                           )}
                        </div>
                      </div>

                      {/* 右侧：封面图 (如果有) */}
                      {p.coverImage && (
                        <div className="shrink-0 w-[140px] h-[96px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                          <img 
                            src={p.coverImage} 
                            alt={p.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
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
