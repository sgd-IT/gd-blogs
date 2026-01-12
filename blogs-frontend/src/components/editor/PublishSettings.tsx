"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { PublishSettings as PublishSettingsType } from "@/types";
import PublishSettingsPanel from "./PublishSettingsPanel";

interface PublishSettingsProps {
  initialSettings?: PublishSettingsType;
  autoSummary: string; // 自动生成的摘要
  onConfirm: (settings: PublishSettingsType) => void;
  onCancel: () => void;
}

export default function PublishSettings({
  initialSettings,
  autoSummary,
  onConfirm,
  onCancel,
}: PublishSettingsProps) {
  const [value, setValue] = useState<PublishSettingsType>({
    categoryId: initialSettings?.categoryId,
    coverImage: initialSettings?.coverImage,
    summary: initialSettings?.summary ?? "",
    isHome: initialSettings?.isHome,
  });

  const handleConfirm = () => {
    onConfirm({
      categoryId: value.categoryId,
      coverImage: value.coverImage || undefined,
      summary: value.summary?.trim() || autoSummary,
      isHome: value.isHome,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-900">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            发布设置
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          <PublishSettingsPanel value={value} autoSummary={autoSummary} onChange={setValue} />
        </div>

        {/* 底部按钮 */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            确认发布
          </button>
        </div>
      </div>
    </div>
  );
}

