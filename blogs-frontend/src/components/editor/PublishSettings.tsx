"use client";

import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { fetchCategories } from "@/services/category";
import { uploadImage } from "@/services/upload";
import type { Category, PublishSettings as PublishSettingsType } from "@/types";

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
  const [categoryId, setCategoryId] = useState<number | undefined>(
    initialSettings?.categoryId
  );
  const [coverImage, setCoverImage] = useState(
    initialSettings?.coverImage || ""
  );
  const [summary, setSummary] = useState(
    initialSettings?.summary || autoSummary
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    void loadCategories();
  }, []);

  const handleCoverUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const url = await uploadImage(file);
        setCoverImage(url);
      } catch (error) {
        alert("封面上传失败");
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const handleConfirm = () => {
    onConfirm({
      categoryId,
      coverImage: coverImage || undefined,
      summary: summary.trim() || autoSummary,
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
        <div className="p-6 space-y-5">
          {/* 分类选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文章分类
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) =>
                setCategoryId(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">请选择分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 封面图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              封面图片
            </label>
            <div className="flex items-center gap-3">
              {coverImage ? (
                <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                  <img
                    src={coverImage}
                    alt="封面"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCoverUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "上传中..." : "上传封面"}
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              建议尺寸：1200x630，最大 5MB
            </p>
          </div>

          {/* 文章摘要 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文章摘要
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={500}
              className="w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="输入文章摘要（不填将自动提取前 200 字）"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {summary.length}/500 字
            </p>
          </div>
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

