"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";

import EditorToolbar from "./EditorToolbar";
import EditorToc from "./EditorToc";
import MarkdownPreview from "./MarkdownPreview";
import PublishSettingsPanel from "./PublishSettingsPanel";
import {
  CustomHeading,
  CustomTable,
  CustomTableRow,
  CustomTableCell,
  CustomTableHeader,
  CustomTextStyle,
  CustomColor,
  CustomHighlight,
} from "./extensions";
import { countWords } from "@/lib/html";
import {
  saveCreateDraft,
  getCreateDraft,
  clearCreateDraft,
  saveEditDraft,
  getEditDraft,
  clearEditDraft,
  formatSavedTime,
} from "@/lib/storage";
import { getExcerpt } from "@/lib/html";
import type { EditorMode, PostVO, PublishSettings as PublishSettingsType } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

const looksLikeHtml = (text: string) => /<[^>]+>/.test((text ?? "").trim());

// 自动保存间隔（毫秒）
const AUTO_SAVE_INTERVAL = 30000; // 30秒

interface TiptapEditorProps {
  mode: EditorMode;
  postId?: string; // 编辑模式需要
}

export default function TiptapEditor({ mode, postId }: TiptapEditorProps) {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === "edit");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [publishSettings, setPublishSettings] = useState<PublishSettingsType>({});
  const publishSettingsRef = useRef<HTMLDivElement | null>(null);
  const [draftMenuOpen, setDraftMenuOpen] = useState(false);
  const draftMenuRef = useRef<HTMLDivElement | null>(null);

  // 侧边栏宽度拖拽
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const [isResizing, setIsResizing] = useState(false);
  
  // 处理拖拽逻辑
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // 限制最小宽度 260px，最大宽度 520px（更接近 CSDN）
      const newWidth = Math.max(260, Math.min(520, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  
  // 用于防止重复恢复草稿
  const draftRestored = useRef(false);

  // 保存草稿下拉：点击外部/ESC 关闭
  useEffect(() => {
    if (!draftMenuOpen) return;

    const onDown = (e: MouseEvent) => {
      const el = draftMenuRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setDraftMenuOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDraftMenuOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [draftMenuOpen]);

  const looksLikeMarkdown = (text: string) => {
    // 轻量级启发式：只要命中一些常见 MD 语法就按 Markdown 解析
    const t = text.trim();
    if (!t) return false;
    return (
      /^#{1,6}\s/m.test(t) || // 标题
      /```/.test(t) || // fenced code
      /^\s*[-*+]\s+/m.test(t) || // 无序列表
      /^\s*\d+\.\s+/m.test(t) || // 有序列表
      /\[.+?\]\(.+?\)/.test(t) || // 链接
      /\*\*[^*]+\*\*/.test(t) || // 加粗
      /__[^_]+__/.test(t) || // 加粗（另一种）
      /(^|\n)\s*>\s+/m.test(t) // 引用
    );
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // 禁用默认 heading，使用自定义的
      }),
      // Markdown：用于导入/导出 Markdown（例如从 Markdown 源码弹窗“应用”）
      Markdown,
      CustomHeading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: "开始写作...",
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-purple-600 underline cursor-pointer",
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      CustomTable,
      CustomTableRow,
      CustomTableCell,
      CustomTableHeader,
      CustomTextStyle,
      CustomColor,
      CustomHighlight,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-4 dark:prose-invert",
      },
      handlePaste: (_view, event) => {
        // 当剪贴板只有纯文本且看起来像 Markdown 时，按 Markdown 解析插入
        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        const html = clipboard.getData("text/html");
        const text = clipboard.getData("text/plain");

        // 有 HTML 就交给默认逻辑（比如从网页复制富文本）
        if (html && html.trim().length > 0) return false;
        if (!text || text.trim().length === 0) return false;

        if (!looksLikeMarkdown(text)) return false;

        event.preventDefault();
        editor?.commands.insertContent(text, { contentType: "markdown" });
        return true;
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // 实时更新字数统计
      const html = editor.getHTML();
      setWordCount(countWords(html));
    },
  });

  // 保存草稿函数
  const saveDraft = useCallback(() => {
    if (!editor) return;
    
    const content = editor.getHTML();
    const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
    
    if (mode === "create") {
      saveCreateDraft({ title, content, tags });
    } else if (postId) {
      saveEditDraft(postId, { title, content, tags });
    }
    
    setLastSavedAt(Date.now());
  }, [editor, title, tagsText, mode, postId]);

  // 自动保存草稿
  useEffect(() => {
    if (!editor) return;
    
    const interval = setInterval(() => {
      // 只有有内容时才保存
      const content = editor.getHTML();
      if (title.trim() || countWords(content) > 0) {
        saveDraft();
      }
    }, AUTO_SAVE_INTERVAL);
    
    return () => clearInterval(interval);
  }, [editor, saveDraft, title]);

  // 创建模式：恢复草稿
  useEffect(() => {
    if (mode !== "create" || !editor || draftRestored.current) return;
    
    const draft = getCreateDraft();
    if (draft && (draft.title || countWords(draft.content) > 0)) {
      // 有草稿，询问是否恢复
      const shouldRestore = window.confirm(
        `发现上次编辑的草稿（${formatSavedTime(draft.savedAt)}），是否恢复？`
      );
      
      if (shouldRestore) {
        setTitle(draft.title);
        setTagsText(draft.tags.join(", "));
        editor.commands.setContent(draft.content);
        setWordCount(countWords(draft.content));
        setLastSavedAt(draft.savedAt);
      } else {
        clearCreateDraft();
      }
    }
    
    draftRestored.current = true;
  }, [mode, editor]);

  // 编辑模式：获取文章数据
  useEffect(() => {
    if (mode !== "edit" || !editor || !postId) return;
    
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/post/get/vo?id=${postId}`, {
          credentials: "include",
        });
        const data = await res.json();
        
        if (data.code === 0 && data.data) {
          const post: PostVO = data.data;
          
          // 检查是否有本地草稿
          const draft = getEditDraft(postId);
          if (draft && draft.savedAt > new Date(post.updateTime || 0).getTime()) {
            const shouldRestore = window.confirm(
              `发现本地草稿（${formatSavedTime(draft.savedAt)}）比服务器版本更新，是否恢复？`
            );
            
            if (shouldRestore) {
              setTitle(draft.title);
              setTagsText(draft.tags.join(", "));
              editor.commands.setContent(draft.content);
              setWordCount(countWords(draft.content));
              setLastSavedAt(draft.savedAt);
            } else {
              // 使用服务器数据
              setTitle(post.title || "");
              setTagsText(post.tagList?.join(", ") || "");
              setPublishSettings({
                categoryId: post.categoryId,
                type: post.type,
                coverImage: post.coverImage,
                summary: post.summary,
                isHome: post.isHome,
              });
              const serverContent = post.content || "";
              if (looksLikeHtml(serverContent)) {
                editor.commands.setContent(serverContent);
                setWordCount(countWords(serverContent));
              } else {
                editor.commands.setContent(serverContent, { contentType: "markdown" });
                setWordCount(serverContent.replace(/\s/g, "").length);
              }
              clearEditDraft(postId);
            }
          } else {
            // 直接使用服务器数据
            setTitle(post.title || "");
            setTagsText(post.tagList?.join(", ") || "");
            setPublishSettings({
              categoryId: post.categoryId,
              type: post.type,
              coverImage: post.coverImage,
              summary: post.summary,
              isHome: post.isHome,
            });
            const serverContent = post.content || "";
            if (looksLikeHtml(serverContent)) {
              editor.commands.setContent(serverContent);
              setWordCount(countWords(serverContent));
            } else {
              editor.commands.setContent(serverContent, { contentType: "markdown" });
              setWordCount(serverContent.replace(/\s/g, "").length);
            }
          }
        } else {
          setErrorMsg(data.message ?? "文章不存在");
        }
      } catch (err) {
        setErrorMsg("加载失败");
      } finally {
        setFetching(false);
      }
    };
    
    void fetchPost();
  }, [mode, editor, postId]);

  // 提交处理
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!editor) return;

    const textContent = editor.getText();

    if (!title.trim()) {
      setErrorMsg("标题不能为空");
      return;
    }
    
    if (textContent.trim().length < 10) {
      setErrorMsg("内容至少需要10个字");
      return;
    }

    // 创建模式：滚动到下半部分发布设置（类似 CSDN）
    if (mode === "create") {
      publishSettingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setSuccessMsg("请在下方完善发布设置，然后点击“确认发布”");
      setTimeout(() => setSuccessMsg(null), 2000);
      return;
    }

    // 编辑模式：直接提交（使用当前发布设置）
    await handlePublish(publishSettings);
  };

  // 实际的发布/更新逻辑
  const handlePublish = async (settings: PublishSettingsType) => {
    if (!editor) return;

    setLoading(true);

    try {
      const mdContent = editor.getMarkdown();
      const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
      
      // 生成摘要（如果用户未提供）
      const plainText = editor.getText().replace(/\s+/g, " ").trim();
      const finalSummary =
        settings.summary || (plainText.length > 200 ? `${plainText.slice(0, 200)}...` : plainText);
      
      const url = mode === "create" 
        ? `${API_BASE_URL}/post/add`
        : `${API_BASE_URL}/post/edit`;
      
      const body = mode === "create"
        ? {
            title,
            content: mdContent,
            tags,
            categoryId: settings.categoryId,
            type: settings.type || "original",
            coverImage: settings.coverImage,
            summary: finalSummary,
            isHome: settings.isHome,
          }
        : {
            id: Number(postId),
            title,
            content: mdContent,
            tags,
            categoryId: settings.categoryId,
            type: settings.type || "original",
            coverImage: settings.coverImage,
            summary: finalSummary,
            isHome: settings.isHome,
          };

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (data.code === 0) {
        // 发布/更新成功，清除草稿
        if (mode === "create") {
          clearCreateDraft();
          setSuccessMsg("发布成功！正在跳转...");
          setTimeout(() => {
            router.push("/post/my");
          }, 800);
        } else if (postId) {
          clearEditDraft(postId);
          setSuccessMsg("更新成功！正在跳转...");
          setTimeout(() => {
            router.push(`/post/${postId}`);
          }, 800);
        }
        return;
      }
      
      setErrorMsg(data.message ?? (mode === "create" ? "发布失败" : "更新失败"));
    } catch (err) {
      setErrorMsg(mode === "create" ? "发布失败，请稍后重试" : "更新失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const addLink = () => {
    const url = window.prompt("请输入链接地址");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("请输入图片地址");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // 手动保存草稿
  const handleSaveDraft = () => {
    saveDraft();
    setSuccessMsg("草稿已保存");
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleSaveAndPreview = () => {
    handleSaveDraft();
    setDraftMenuOpen(false);

    // edit：直接预览线上文章
    if (mode === "edit" && postId) {
      window.open(`/post/${postId}`, "_blank");
      return;
    }

    // create：预览本地草稿
    window.open("/post/preview", "_blank");
  };

  if (fetching || !editor) {
    return (
      <main className="min-h-screen bg-white dark:bg-black pt-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-sm text-gray-600 dark:text-gray-300">加载中...</div>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f5f6f7] flex flex-col">
      <form onSubmit={onSubmit} className="flex-1 flex flex-col">
        {/* 顶部工具栏 */}
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur px-4 py-2 dark:border-gray-800 dark:bg-black/80">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* 左：导航区 */}
            <div className="flex items-center gap-3 min-w-0">
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  返回
                </button>
              )}
              <div className="min-w-0 text-sm text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">发布文章</span>
                <span className="mx-2 text-gray-300 dark:text-gray-700">/</span>
                <span className="truncate text-gray-700 dark:text-gray-200">
                  {title?.trim() ? title : "未命名"}
                </span>
              </div>
            </div>

            {/* 中：工具区（真正居中） */}
            <div className="justify-self-center">
              <EditorToolbar
                editor={editor}
                onAddLink={addLink}
                onAddImage={addImage}
                onShowMarkdown={() => setShowMarkdown(true)}
              />
            </div>

            {/* 右：操作区 */}
            <div className="flex items-center justify-end gap-3">
              {/* 保存草稿▼ */}
              <div ref={draftMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDraftMenuOpen((v) => !v)}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  aria-haspopup="menu"
                  aria-expanded={draftMenuOpen}
                >
                  保存草稿 <span className="text-xs align-middle">▼</span>
                </button>
                {draftMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-black"
                    role="menu"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900"
                      onClick={handleSaveAndPreview}
                    >
                      保存并预览
                    </button>
                  </div>
                )}
              </div>

              {/* 定时发布（UI 占位） */}
              <button
                type="button"
                onClick={() => alert("定时发布：待接入（可先做 UI，后续接入后端）")}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                定时发布
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`rounded-md px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 transition-colors ${
                  mode === "create"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {loading
                  ? mode === "create"
                    ? "发布中..."
                    : "保存中..."
                  : mode === "create"
                  ? "发布博客"
                  : "保存修改"}
              </button>
            </div>
          </div>
        </div>

        {/* 主体区域：包含左侧目录、中间编辑器、右侧工具 */}
        <div className="flex-1 flex relative">
          {/* 左侧目录栏 - 固定宽度，白色背景，独立滚动 */}
          <aside 
            className="hidden lg:flex shrink-0 flex-col bg-white border-r border-gray-200 dark:bg-black dark:border-gray-800 sticky top-0 h-[calc(100dvh-56px)] self-start group relative"
            style={{ width: sidebarWidth }}
          >
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-200">目录</span>
                {/* 模拟收起图标 */}
                <span className="text-gray-400 cursor-pointer text-xs">|&lt;</span>
              </div>
              <div className="p-2">
                <EditorToc editor={editor} />
              </div>
            </div>
            
            {/* 拖拽手柄 */}
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-purple-500/50 active:bg-purple-600 transition-colors z-10"
              onMouseDown={() => setIsResizing(true)}
            />
          </aside>

          {/* 中间区域 - 让页面自然滚动（更像 CSDN），并保证纸张真正居中 */}
          <div className="flex-1 flex justify-center p-8 pb-24">
            <div className="w-full max-w-[900px] flex flex-col gap-6">
              {/* 编辑器纸张 - 白色背景，阴影，略更自然的圆角/边框 */}
              <div className="bg-white min-h-[800px] shadow-sm rounded-md border border-gray-100 px-10 py-9 dark:bg-[#111] dark:border-gray-900">
                {/* 标题输入 */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入文章标题（5～100个字）"
                  maxLength={100}
                  className="w-full border-none text-3xl font-bold text-gray-900 placeholder-gray-300 outline-none dark:bg-[#111] dark:text-white dark:placeholder-gray-700 mb-6"
                />

                {/* 标签输入 */}
                <div className="mb-8 flex items-center gap-2 bg-gray-50 p-2 rounded dark:bg-gray-900">
                  <span className="text-xs text-gray-400 select-none">#</span>
                  <input
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder="标签 (如: Java, Spring Boot)"
                    className="flex-1 bg-transparent border-none text-sm text-gray-600 placeholder-gray-400 outline-none dark:text-gray-300"
                  />
                </div>

                {/* 富文本编辑器 */}
                <div className="tiptap-editor min-h-[500px]">
                  <EditorContent editor={editor} />
                </div>
              </div>

              {/* 下半部分：发布设置（类似 CSDN） */}
              <div
                ref={publishSettingsRef}
                className="bg-white shadow-sm rounded-md border border-gray-100 px-10 py-8 dark:bg-[#111] dark:border-gray-900"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">发布设置</h2>
                  <button
                    type="button"
                    onClick={() =>
                      publishSettingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    title="回到发布设置"
                  >
                    置顶本区块
                  </button>
                </div>

                <PublishSettingsPanel
                  value={publishSettings}
                  autoSummary={getExcerpt(editor.getHTML(), 200)}
                  onChange={setPublishSettings}
                />

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handlePublish(publishSettings)}
                    className={`rounded-md px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 transition-colors ${
                      mode === "create"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {loading
                      ? mode === "create"
                        ? "发布中..."
                        : "保存中..."
                      : mode === "create"
                      ? "确认发布"
                      : "确认保存"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧对称留白：宽度与目录一致，让中间纸张视觉上真正居中 */}
          <div className="hidden lg:block shrink-0" style={{ width: sidebarWidth }} aria-hidden="true" />
        </div>

        {/* 底部状态栏 - 固定 */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-black shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="w-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                共 {wordCount} 字
              </div>
              <button
                type="button"
                onClick={() => publishSettingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer flex items-center gap-1 dark:text-gray-400 dark:hover:text-white"
              >
                发文设置 <span className="text-xs">▼</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              {lastSavedAt && (
                <span className="text-xs text-gray-400">
                  草稿保存于 {formatSavedTime(lastSavedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 错误/成功提示 */}
        {(errorMsg || successMsg) && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50">
            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-lg dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-200">
                {successMsg}
              </div>
            )}
          </div>
        )}
      </form>

      {/* Markdown 预览弹窗 */}
      {showMarkdown && (
        <MarkdownPreview
          editor={editor}
          onClose={() => setShowMarkdown(false)}
        />
      )}
    </div>
  );
}

