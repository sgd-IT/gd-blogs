"use client";

import { useState } from "react";
import { getCreateDraft } from "@/lib/storage";

export default function PostPreviewPage() {
  const [{ title, content }] = useState(() => {
    const draft = getCreateDraft();
    return {
      title: draft?.title || "预览",
      content: draft?.content || "",
    };
  });

  return (
    <main className="min-h-screen bg-[#f5f6f7] p-8">
      <div className="mx-auto w-full max-w-[900px] bg-white rounded-md border border-gray-100 p-10 dark:bg-[#111] dark:border-gray-900">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{title}</h1>
        {content ? (
          <article
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            暂无草稿内容，请先在“发布文章”页输入内容并保存草稿。
          </div>
        )}
      </div>
    </main>
  );
}


