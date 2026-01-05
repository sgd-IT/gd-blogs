"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";

interface ColorPickerProps {
  editor: Editor;
  type: "text" | "background";
}

const COLORS = [
  { name: "黑色", value: "#000000" },
  { name: "深灰", value: "#4B5563" },
  { name: "红色", value: "#EF4444" },
  { name: "橙色", value: "#F97316" },
  { name: "黄色", value: "#EAB308" },
  { name: "绿色", value: "#22C55E" },
  { name: "蓝色", value: "#3B82F6" },
  { name: "紫色", value: "#A855F7" },
  { name: "粉色", value: "#EC4899" },
  { name: "默认", value: "" },
];

export default function ColorPicker({ editor, type }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    if (type === "text") {
      if (color) {
        editor.chain().focus().setColor(color).run();
      } else {
        editor.chain().focus().unsetColor().run();
      }
    } else {
      if (color) {
        editor.chain().focus().setHighlight({ color }).run();
      } else {
        editor.chain().focus().unsetHighlight().run();
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded dark:hover:bg-gray-800"
        title={type === "text" ? "文字颜色" : "背景色"}
      >
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">A</span>
          <div
            className={`w-3 h-0.5 ${
              type === "text" ? "bg-current" : "bg-yellow-400"
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-20 w-48 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              {type === "text" ? "选择文字颜色" : "选择背景色"}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value || "default"}
                  type="button"
                  onClick={() => handleColorSelect(color.value)}
                  className={`h-8 w-8 rounded border border-gray-300 hover:scale-110 transition-transform dark:border-gray-600 ${
                    !color.value ? "bg-white dark:bg-gray-800" : ""
                  }`}
                  style={{
                    backgroundColor: color.value || "transparent",
                  }}
                  title={color.name}
                >
                  {!color.value && (
                    <span className="text-xs text-gray-400">✕</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

