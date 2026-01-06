"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { PostVO } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownToc from "@/components/business/MarkdownToc";
import type { ReactElement, ReactNode } from "react";
import { isValidElement } from "react";
import rehypeHighlight from "rehype-highlight";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

function looksLikeHtml(text: string) {
  return /<[^>]+>/.test(text);
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=\[\]{}\\|;:'",.<>/?]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return extractText(el.props.children ?? "");
  }
  return "";
}

function makeHeadingId(text: string, used: Map<string, number>) {
  const base = slugify(text) || "section";
  const n = (used.get(base) ?? 0) + 1;
  used.set(base, n);
  return n === 1 ? base : `${base}-${n}`;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [post, setPost] = useState<PostVO | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/get/login`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.code === 0 && data.data) {
          setCurrentUserId(data.data.id);
        }
      } catch (err) {
        console.error("获取用户信息失败", err);
      }
    };

    const fetchPost = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`${API_BASE_URL}/post/get/vo?id=${postId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.code === 0 && data.data) {
          setPost(data.data);
        } else {
          setErrorMsg(data.message ?? "文章不存在");
        }
      } catch (err) {
        setErrorMsg("加载失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    void fetchCurrentUser();
    void fetchPost();
  }, [postId]);

  const isAuthor = currentUserId && post?.userId === currentUserId;

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-black pt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-sm text-gray-600 dark:text-gray-300">加载中...</div>
        </div>
      </main>
    );
  }

  if (errorMsg || !post) {
    return (
      <main className="min-h-screen bg-white dark:bg-black pt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
            {errorMsg || "文章不存在"}
          </div>
        </div>
      </main>
    );
  }

  const content = post.content || "";
  const isHtml = looksLikeHtml(content);
  const usedHeadingIds = new Map<string, number>();

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="container mx-auto px-4 max-w-6xl pb-12">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← 返回
          </button>
        </div>

        <div className="flex gap-8">
          {/* 左侧目录（仅 Markdown 时展示） */}
          {!isHtml ? <MarkdownToc markdown={content} /> : null}

          {/* 文章内容 */}
          <article className="flex-1 rounded-xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-black">
            {/* 封面图 */}
            {post.coverImage ? (
              <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full max-h-[360px] object-cover"
                />
              </div>
            ) : null}

            {/* 标题 */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {post.user?.userName && <span>作者：{post.user.userName}</span>}
              {post.createTime && <span>发布于：{post.createTime}</span>}
              {post.updateTime && post.updateTime !== post.createTime && (
                <span>更新于：{post.updateTime}</span>
              )}
            </div>

            {/* 标签 */}
            {post.tagList && post.tagList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tagList.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 分割线 */}
            <hr className="my-6 border-gray-200 dark:border-gray-800" />

            {/* 正文内容：HTML 或 Markdown */}
            {isHtml ? (
              <div
                className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                  components={{
                    h1: ({ children, ...props }) => {
                      const text = extractText(children).trim();
                      const id = makeHeadingId(text, usedHeadingIds);
                      return (
                        <h1 id={id} {...props}>
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const text = extractText(children).trim();
                      const id = makeHeadingId(text, usedHeadingIds);
                      return (
                        <h2 id={id} {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const text = extractText(children).trim();
                      const id = makeHeadingId(text, usedHeadingIds);
                      return (
                        <h3 id={id} {...props}>
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children, ...props }) => {
                      const text = extractText(children).trim();
                      const id = makeHeadingId(text, usedHeadingIds);
                      return (
                        <h4 id={id} {...props}>
                          {children}
                        </h4>
                      );
                    },
                    h5: ({ children, ...props }) => {
                      const text = extractText(children).trim();
                      const id = makeHeadingId(text, usedHeadingIds);
                      return (
                        <h5 id={id} {...props}>
                          {children}
                        </h5>
                      );
                    },
                    h6: ({ children, ...props }) => {
                      const text = extractText(children).trim();
                      const id = makeHeadingId(text, usedHeadingIds);
                      return (
                        <h6 id={id} {...props}>
                          {children}
                        </h6>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}

            {/* 操作按钮（仅作者可见） */}
            {isAuthor && (
              <div className="mt-8 flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
                <Link
                  href={`/post/edit/${post.id}`}
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  编辑文章
                </Link>
              </div>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}

