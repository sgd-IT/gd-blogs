"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CommentVO } from "@/types";
import { addComment, deleteComment, listCommentVoByPage } from "@/services";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  postId: number;
  currentUserId?: number | null;
};

type ReplyState = {
  parentId: number | null;
  content: string;
};

const PAGE_SIZE = 10;

function formatTime(time?: string) {
  if (!time) return "";
  const d = new Date(time);
  return d.toLocaleString();
}

export default function CommentSection({ postId, currentUserId }: Props) {
  const [comments, setComments] = useState<CommentVO[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [replyState, setReplyState] = useState<ReplyState>({ parentId: null, content: "" });
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // 后端已返回顶级评论 records，并在每条记录内填充 children（无需前端再 buildTree）
  const commentTree = useMemo(() => comments ?? [], [comments]);

  const fetchComments = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCommentVoByPage({ postId, pageNum, pageSize: PAGE_SIZE });
      if (res.code === 0 && res.data) {
        setComments(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        setCurrent(res.data.current ?? pageNum);
      } else {
        setError(res.message ?? "加载评论失败");
      }
    } catch {
      setError("加载评论失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchComments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleAdd = async (parentId?: number | null) => {
    if (!currentUserId) {
      setError("请先登录再发表评论");
      return;
    }
    const text = parentId ? replyState.content.trim() : content.trim();
    if (!text) {
      setError("评论内容不能为空");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await addComment({ content: text, postId, parentId: parentId ?? null });
      if (res.code === 0) {
        if (parentId) {
          setReplyState({ parentId: null, content: "" });
        } else {
          setContent("");
        }
        setExpandedIds((prev) => {
          const next = new Set(prev);
          if (parentId) next.add(parentId);
          return next;
        });
        await fetchComments(current);
      } else {
        setError(res.message ?? "提交失败");
      }
    } catch {
      setError("提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!currentUserId) {
      setError("请先登录");
      return;
    }
    setError(null);
    const res = await deleteComment(id);
    if (res.code === 0) {
      await fetchComments(current);
    } else {
      setError(res.message ?? "删除失败");
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const showReplyBox = (parentId: number) => {
    setReplyState({ parentId, content: "" });
    setExpandedIds((prev) => new Set(prev).add(parentId));
  };

  const renderItem = (item: CommentVO, depth = 0) => {
    const isOwner = currentUserId != null && item.userId === currentUserId;
    const hasChildren = (item.children?.length ?? 0) > 0;
    const expanded = expandedIds.has(item.id);
    return (
      <div key={item.id} className="space-y-2">
        <div className="flex gap-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden">
            {item.user?.userAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.user.userAvatar} alt="avatar" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">
                {item.user?.userName ?? "用户"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(item.createTime)}</span>
            </div>
            <div className="text-sm text-gray-800 dark:text-gray-200">
              <div className="prose prose-sm prose-gray max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                  components={{
                    p: ({ children, ...props }) => (
                      <p className="whitespace-pre-wrap" {...props}>
                        {children}
                      </p>
                    ),
                  }}
                >
                  {item.content ?? ""}
                </ReactMarkdown>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <button
                onClick={() => showReplyBox(item.id)}
                className="hover:text-purple-600 dark:hover:text-purple-400"
              >
                回复
              </button>
              {isOwner && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="hover:text-red-600 dark:hover:text-red-400"
                >
                  删除
                </button>
              )}
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="hover:text-purple-600 dark:hover:text-purple-400"
                >
                  {expanded ? "收起回复" : `展开回复(${item.children?.length ?? 0})`}
                </button>
              )}
            </div>
            {replyState.parentId === item.id && (
              <div className="mt-2">
                <textarea
                  value={replyState.content}
                  onChange={(e) => setReplyState({ parentId: item.id, content: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900"
                  placeholder="回复内容..."
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleAdd(item.id)}
                    disabled={submitting}
                    className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "提交中..." : "提交回复"}
                  </button>
                  <button
                    onClick={() => setReplyState({ parentId: null, content: "" })}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {hasChildren && expanded && (
          <div className="ml-10 space-y-4 border-l border-gray-200 pl-4 dark:border-gray-800">
            {item.children?.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="comments" className="mt-12 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-black">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">评论</h2>

      {!currentUserId && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          发表评论前请{" "}
          <Link href="/user/login" className="text-purple-600 hover:underline dark:text-purple-400">
            登录
          </Link>
          。
        </div>
      )}

      <div className="mt-4 space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="写下你的看法..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-900"
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">支持 Markdown</div>
          <button
            onClick={() => handleAdd(null)}
            disabled={submitting}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "提交中..." : "发表评论"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-6">
        {loading ? (
          <div className="text-sm text-gray-600 dark:text-gray-300">加载中...</div>
        ) : commentTree.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">还没有评论，来抢沙发吧~</div>
        ) : (
          commentTree.map((item) => renderItem(item))
        )}
      </div>

      {total > PAGE_SIZE && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            共 {total} 条 · 第 {current} 页
          </div>
          <div className="flex gap-2">
            <button
              disabled={current <= 1 || loading}
              onClick={() => fetchComments(current - 1)}
              className="rounded-md border border-gray-200 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              上一页
            </button>
            <button
              disabled={current * PAGE_SIZE >= total || loading}
              onClick={() => fetchComments(current + 1)}
              className="rounded-md border border-gray-200 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
