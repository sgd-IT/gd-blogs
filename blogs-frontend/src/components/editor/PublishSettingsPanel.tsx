"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { fetchCategories } from "@/services/category";
import { uploadImage } from "@/services/upload";
import type { Category, PublishSettings as PublishSettingsType } from "@/types";

interface PublishSettingsPanelProps {
  value: PublishSettingsType;
  autoSummary: string;
  onChange: (next: PublishSettingsType) => void;
}

export default function PublishSettingsPanel({ value, autoSummary, onChange }: PublishSettingsPanelProps) {
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
        onChange({ ...value, coverImage: url });
      } catch {
        alert("封面上传失败");
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const summaryValue = value.summary ?? "";

  return (
    <div className="space-y-6">
      {/* 分类选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          文章分类
        </label>
        <select
          value={value.categoryId ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              categoryId: e.target.value ? Number(e.target.value) : undefined,
            })
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
          {value.coverImage ? (
            <div className="relative w-52 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <img
                src={value.coverImage}
                alt="封面"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange({ ...value, coverImage: undefined })}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                title="移除封面"
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
          建议尺寸：1200×630，最大 5MB
        </p>
      </div>

      {/* 文章摘要 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          文章摘要
        </label>
        <textarea
          value={summaryValue}
          onChange={(e) => onChange({ ...value, summary: e.target.value })}
          maxLength={500}
          className="w-full min-h-[110px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="输入文章摘要（不填将自动提取正文前 200 字）"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>不填写时将自动生成摘要：{autoSummary ? "已就绪" : "暂不可用"}</span>
          <span>{summaryValue.length}/500 字</span>
        </div>
      </div>
    </div>
  );
}


