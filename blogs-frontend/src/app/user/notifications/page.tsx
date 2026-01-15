"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  MessageCircle,
  Reply,
  ThumbsUp,
  Heart,
  Check,
} from "lucide-react";
import type { NotificationVO, PageResp } from "@/types";
import {
  getNotificationUnreadCount,
  listNotificationVoByPage,
  readNotifications,
} from "@/services";

type FilterType = "all" | "unread";

const PAGE_SIZE = 10;

function formatTime(time?: string) {
  if (!time) return "";
  const date = new Date(time);
  return date.toLocaleString();
}

function getTypeMeta(type?: string) {
  switch (type) {
    case "comment":
      return { label: "评论", icon: MessageCircle };
    case "reply":
      return { label: "回复", icon: Reply };
    case "thumb":
      return { label: "点赞", icon: ThumbsUp };
    case "favour":
      return { label: "收藏", icon: Heart };
    default:
      return { label: "通知", icon: Bell };
  }
}

function buildLink(item: NotificationVO) {
  if (item.postId) {
    return `/post/${item.postId}${item.commentId ? "#comments" : ""}`;
  }
  return "";
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState<PageResp<NotificationVO> | null>(null);
  const [current, setCurrent] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadIds = useMemo(
    () => (page?.records ?? []).filter((n) => n.status === 0).map((n) => n.id),
    [page]
  );

  const fetchUnreadCount = async () => {
    const res = await getNotificationUnreadCount();
    if (res.code === 0 && typeof res.data === "number") {
      setUnreadCount(res.data);
    }
  };

  const fetchNotifications = async (pageNum = 1, nextFilter = filter) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await listNotificationVoByPage({
        pageNum,
        pageSize: PAGE_SIZE,
        status: nextFilter === "unread" ? 0 : undefined,
        sortField: "createTime",
        sortOrder: "descend",
      });
      if (res.code === 0 && res.data) {
        setPage(res.data);
        setCurrent(res.data.current ?? pageNum);
        return;
      }
      setErrorMsg(res.message ?? "获取失败");
    } catch {
      setErrorMsg("获取失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUnreadCount();
    void fetchNotifications(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (nextFilter: FilterType) => {
    setFilter(nextFilter);
    setCurrent(1);
    void fetchNotifications(1, nextFilter);
  };

  const handleMarkRead = async (ids: number[]) => {
    if (!ids.length) return;
    const res = await readNotifications({ ids });
    if (res.code === 0) {
      await fetchUnreadCount();
      await fetchNotifications(current);
    }
  };

  const records = page?.records ?? [];

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              通知中心
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              关注你的评论与互动动态
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
              未读 {unreadCount}
            </span>
            <button
              type="button"
              onClick={() => void handleMarkRead(unreadIds)}
              disabled={unreadIds.length === 0}
              className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40 dark:border-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              全部已读
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {(["all", "unread"] as FilterType[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleFilterChange(key)}
              className={[
                "rounded-full px-4 py-1.5 text-sm transition-colors",
                filter === key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
              ].join(" ")}
            >
              {key === "all" ? "全部" : "未读"}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">加载中...</div>
          ) : errorMsg ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {errorMsg}
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600 dark:border-gray-800 dark:bg-black dark:text-gray-300">
              暂无通知
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-0 h-full w-px bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-6">
                {records.map((item) => {
                  const { label, icon: Icon } = getTypeMeta(item.type);
                  const link = buildLink(item);
                  const isUnread = item.status === 0;
                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-black"
                    >
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                            {label}
                          </span>
                          <span>{formatTime(item.createTime)}</span>
                          {isUnread && (
                            <span className="ml-auto rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-600 dark:text-orange-300">
                              未读
                            </span>
                          )}
                        </div>

                        <div className="flex items-start gap-3">
                          {item.sender?.userAvatar ? (
                            <img
                              src={item.sender.userAvatar}
                              alt={item.sender.userName ?? "user"}
                              className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800" />
                          )}
                          <div className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                            <div className="font-medium">
                              {item.sender?.userName ?? "有人"}
                            </div>
                            <div className="mt-1 text-gray-600 dark:text-gray-300">
                              {item.content}
                            </div>
                            {link ? (
                              <Link
                                href={link}
                                className="mt-2 inline-flex items-center gap-1 text-purple-600 hover:underline dark:text-purple-400"
                              >
                                查看详情
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => void handleMarkRead([item.id])}
                          className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:text-white"
                        >
                          <Check className="h-3 w-3" />
                          标记已读
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {page && page.total > PAGE_SIZE && (
          <div className="mt-8 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div>
              共 {page.total} 条 · 第 {current} 页
            </div>
            <div className="flex gap-2">
              <button
                disabled={current <= 1 || loading}
                onClick={() => void fetchNotifications(current - 1)}
                className="rounded-md border border-gray-200 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-900"
              >
                上一页
              </button>
              <button
                disabled={current * PAGE_SIZE >= (page.total ?? 0) || loading}
                onClick={() => void fetchNotifications(current + 1)}
                className="rounded-md border border-gray-200 px-3 py-1 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-900"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
