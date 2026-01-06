"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookMarked, FileText, ArrowUpRight, Sparkles } from "lucide-react";
import { listPostVoByPage } from "@/services/post";
import { stripRichText } from "@/lib/html";
import type { PostVO } from "@/types";

type PickItem = {
  title: string;
  reason: string;
  tags: string[];
  date: string;
  pinned?: boolean;
  url?: string; // 可选：后续你决定跳 GitHub/站内详情页时再补
};

// 左侧：技术栈精选（你自己维护）
const TECH_STACK_PICKS: PickItem[] = [
  {
    pinned: true,
    title: "Next.js + RSC：内容型站点的默认答案（目前最推荐）",
    reason: "开发体验、性能与架构取舍最均衡，适合博客/作品集这类内容产品。",
    tags: ["Next.js", "RSC", "Performance"],
    date: "2026-01-04",
    url: "https://nextjs.org/"
  },
  {
    title: "TailwindCSS：快速落地设计系统的效率工具",
    reason: "统一间距/色彩/排版的心智成本低，适合快速迭代 UI。",
    tags: ["Tailwind", "CSS"],
    date: "2026-01-02",
    url: "https://tailwindcss.com/"
  },
  {
    title: "TypeScript 高级类型：写得少、约束强、可维护",
    reason: "关键路径用类型兜底，减少线上回归成本。",
    tags: ["TypeScript"],
    date: "2025-12-28"
  }
];

// 左侧：项目精选（你自己维护）
const PROJECT_PICKS: PickItem[] = [
  {
    pinned: true,
    title: "gd-blogs：个人全栈博客（权限 / 发布 / 我的文章）",
    reason: "用一个可迭代的真实项目，把前后端与产品体验都串起来。",
    tags: ["Next.js", "Spring Boot", "MySQL"],
    date: "2025-12-20"
  },
  {
    title: "分布式外卖系统：Spring Cloud 微服务实战（高并发订单）",
    reason: "把注册中心、网关、限流、缓存、消息队列这些点完整走一遍。",
    tags: ["Spring Cloud", "Redis", "Docker"],
    date: "2025-11-08"
  }
];

function PickCard({
  item,
  index,
}: {
  item: PickItem;
  index: number;
}) {
  const className = [
    "group block p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all",
    item.url ? "cursor-pointer" : "cursor-default",
  ].join(" ");

  const cardBody = (
    <div className="flex justify-between items-start gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {item.pinned && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
              置顶
            </span>
          )}
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>

        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
          {item.title}
        </h4>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {item.reason}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-gray-500">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ArrowUpRight
        size={16}
        className={[
          "text-gray-400 transition-all",
          item.url
            ? "group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            : "opacity-40",
        ].join(" ")}
      />
    </div>
  );

  if (item.url) {
    return (
      <motion.a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        className={className}
      >
        {cardBody}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={className}
    >
      {cardBody}
    </motion.div>
  );
}

export function SectionKnowledge() {
  const techPicks = [...TECH_STACK_PICKS].sort(
    (a, b) => Number(!!b.pinned) - Number(!!a.pinned)
  );
  const projectPicks = [...PROJECT_PICKS].sort(
    (a, b) => Number(!!b.pinned) - Number(!!a.pinned)
  );

  type NoteCard = {
    title: string;
    summary: string;
    category: string;
    lastUpdated: string;
    href: string;
  };

  const [notes, setNotes] = useState<NoteCard[]>([]);

  useEffect(() => {
    const fetchHomeNotes = async () => {
      try {
        const res = await listPostVoByPage({
          pageSize: 5,
          isHome: 1,
          sortField: "createTime",
          sortOrder: "descend",
        });

        if (res.code === 0 && res.data?.records) {
          const records = res.data.records as PostVO[];
          const mappedNotes: NoteCard[] = records.map((post) => ({
            title: post.title,
            summary:
              post.summary ||
              (() => {
                const text = stripRichText(post.content);
                return text.length > 60 ? `${text.slice(0, 60)}...` : text;
              })(),
            category: post.tagList?.[0] || "Blog",
            lastUpdated: post.createTime?.substring(0, 10) ?? "",
            href: `/post/${post.id}`,
          }));
          setNotes(mappedNotes);
        }
      } catch (error) {
        console.error("Failed to fetch home notes:", error);
      }
    };

    fetchHomeNotes();
  }, []);

  return (
    <section className="py-24 px-4 md:px-8 bg-white dark:bg-black/50 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300 relative overflow-hidden">
      {/* 顶部过渡：承接上一分区的浅灰底，让衔接更顺 */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-50 to-transparent dark:from-black z-0" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 左栏：技术栈精选（上）+ 项目精选（下） */}
        <div className="flex flex-col h-full space-y-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <Sparkles size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">精选分享</h3>
           </div>
           
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                技术栈精选
              </div>
              <div className="text-xs text-gray-400">Top picks</div>
            </div>
            <div className="space-y-4">
              {techPicks.map((item, i) => (
                <PickCard key={`tech-${i}`} item={item} index={i} />
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                项目精选
              </div>
              <div className="text-xs text-gray-400">Featured projects</div>
            </div>
            <div className="space-y-4">
              {projectPicks.map((item, i) => (
                <PickCard key={`project-${i}`} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* 右栏：Personal Notes */}
        <div className="flex flex-col h-full space-y-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                <BookMarked size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">学习笔记 / 博客</h3>
           </div>

          <div className="flex flex-col flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                最近更新
              </div>
              <div className="text-xs text-gray-400">Recent posts</div>
            </div>
            <div className="space-y-4">
              {notes.length === 0 ? (
                 <div className="text-sm text-gray-400 p-4 border border-dashed rounded-xl text-center">
                    暂无精选笔记 (isHome=1)
                 </div>
              ) : (
                  notes.map((note, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: 20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.1 }}
                     >
                        <Link
                          href={note.href}
                          className="block p-5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-solid hover:border-purple-300 dark:hover:border-purple-800 bg-transparent hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-2">
                             <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {note.category}
                             </span>
                             <span className="text-xs text-gray-400">{note.lastUpdated}</span>
                          </div>
                          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-purple-600 transition-colors">
                             {note.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                             {note.summary}
                          </p>
                        </Link>
                     </motion.div>
                  ))
              )}
            </div>

              {/* More Link */}
              <div className="mt-auto text-center pt-4">
                 <Link href="/post/my" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors">
                    <FileText size={16} /> 查看全部笔记
                 </Link>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
