"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

interface TocItem {
  id: string;
  level: number;
  text: string;
  pos: number; // 在文档中的位置
}

interface EditorTocProps {
  editor: Editor | null;
}

export default function EditorToc({ editor }: EditorTocProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // 提取标题生成目录
  useEffect(() => {
    if (!editor) return;

    const updateToc = () => {
      const items: TocItem[] = [];
      let headingIndex = 0;

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "heading") {
          const id = `heading-${headingIndex++}`;
          const level = node.attrs.level;
          const text = node.textContent;

          items.push({ id, level, text, pos });
        }
      });

      setToc(items);
    };

    // 监听编辑器更新
    editor.on("update", updateToc);
    updateToc();

    return () => {
      editor.off("update", updateToc);
    };
  }, [editor]);

  // 滚动到标题
  const scrollToHeading = (item: TocItem) => {
    if (!editor) return;
    
    // 设置光标位置到该标题
    editor.chain().focus().setTextSelection(item.pos).run();
    
    // 滚动到可视区域
    const editorElement = document.querySelector(".ProseMirror");
    if (editorElement) {
      const headingElements = editorElement.querySelectorAll("h1, h2, h3");
      const targetElement = Array.from(headingElements).find(
        (el) => el.textContent === item.text
      );
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        setActiveId(item.id);
      }
    }
  };

  if (toc.length === 0) {
    return (
      <div className="text-sm text-gray-400 dark:text-gray-600 p-4">
        为文章增加标题，这里将生成目录
      </div>
    );
  }

  return (
    <nav className="space-y-1 p-4">
      {toc.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToHeading(item)}
          className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
            item.level === 1
              ? "font-bold"
              : item.level === 2
              ? "pl-4"
              : "pl-6 text-xs"
          } ${
            activeId === item.id
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          }`}
        >
          {item.text}
        </button>
      ))}
    </nav>
  );
}

