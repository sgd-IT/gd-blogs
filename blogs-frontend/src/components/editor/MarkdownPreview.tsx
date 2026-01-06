"use client";

import { useState, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { X } from "lucide-react";

interface MarkdownPreviewProps {
  editor: Editor;
  onClose: () => void;
}

export default function MarkdownPreview({ editor, onClose }: MarkdownPreviewProps) {
  const [markdown, setMarkdown] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 直接从 Tiptap 的 Markdown 扩展导出（更准确）
    setMarkdown(editor.getMarkdown());
  }, [editor]);

  const handleApplyMarkdown = () => {
    // 将 Markdown 解析为富文本并更新编辑器
    editor.commands.setContent(markdown, { contentType: "markdown" });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[80vh] mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-900">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Markdown 源码
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-sm text-purple-600 hover:underline dark:text-purple-400"
              >
                编辑
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={handleApplyMarkdown}
                className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                应用
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {isEditing ? (
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full min-h-[400px] rounded-md border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="输入 Markdown..."
            />
          ) : (
            <pre className="w-full min-h-[400px] rounded-md border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 overflow-auto dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              {markdown}
            </pre>
          )}
        </div>

        {/* 提示 */}
        <div className="border-t border-gray-200 px-6 py-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          提示：可以复制 Markdown 到其他平台，或直接在此编辑后应用
        </div>
      </div>
    </div>
  );
}

