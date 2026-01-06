"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link2,
  ImageIcon,
  CodeIcon,
  Minus,
  Upload,
  Table,
  FileCode,
} from "lucide-react";
import { uploadImage } from "@/services/upload";
import ColorPicker from "@/components/ui/ColorPicker";

interface EditorToolbarProps {
  editor: Editor;
  onAddLink: () => void;
  onAddImage: () => void;
  onShowMarkdown: () => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, disabled, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 hover:bg-gray-100 rounded disabled:opacity-30 dark:hover:bg-gray-800 ${
        active ? "bg-gray-200 dark:bg-gray-700" : ""
      }`}
      title={title}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-2 h-5 w-px bg-gray-300 dark:bg-gray-700" />;
}

export default function EditorToolbar({ editor, onAddLink, onAddImage, onShowMarkdown }: EditorToolbarProps) {
  // 处理图片上传
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // 插入上传中提示
        const loadingText = "⏳ 图片上传中...";
        editor.chain().focus().insertContent(loadingText).run();

        // 上传图片
        const url = await uploadImage(file);

        // 删除上传中提示，插入图片
        const { from, to } = editor.state.selection;
        editor
          .chain()
          .focus()
          .deleteRange({ from: from - loadingText.length, to: from })
          .setImage({ src: url })
          .run();
      } catch (error) {
        // 删除上传中提示
        const { from } = editor.state.selection;
        const loadingText = "⏳ 图片上传中...";
        editor
          .chain()
          .focus()
          .deleteRange({ from: from - loadingText.length, to: from })
          .run();
        
        alert("图片上传失败，请重试");
        console.error("上传失败:", error);
      }
    };

    input.click();
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {/* 撤销/重做 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="撤销 (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="重做 (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* 标题 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="一级标题 (Ctrl+Alt+1)"
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="二级标题 (Ctrl+Alt+2)"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="三级标题 (Ctrl+Alt+3)"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* 格式 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="加粗 (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="斜体 (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="删除线 (Ctrl+Shift+S)"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="行内代码 (Ctrl+E)"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* 颜色 */}
      <ColorPicker editor={editor} type="text" />
      <ColorPicker editor={editor} type="background" />

      <ToolbarDivider />

      {/* 列表 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="无序列表"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="有序列表"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="引用"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="代码块"
      >
        <CodeIcon className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* 水平分割线 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="水平分割线"
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* 表格 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        active={editor.isActive("table")}
        title="插入表格 (3x3)"
      >
        <Table className="h-4 w-4" />
      </ToolbarButton>

      {/* 链接和图片 */}
      <ToolbarButton
        onClick={onAddLink}
        active={editor.isActive("link")}
        title="插入链接"
      >
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={onAddImage} title="插入图片（URL）">
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={handleImageUpload} title="上传图片">
        <Upload className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Markdown */}
      <ToolbarButton onClick={onShowMarkdown} title="查看/编辑 Markdown">
        <FileCode className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

