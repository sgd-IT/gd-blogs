"use client";

import { motion } from "framer-motion";
import { BookMarked, FileText, ArrowUpRight, Link2 } from "lucide-react";

// 模拟外部文章链接数据
const READING_LIST = [
  {
    title: "React Server Components 深度解析",
    source: "Dan Abramov",
    url: "https://overreacted.io/",
    tags: ["React", "RSC"],
    date: "2024-01-15"
  },
  {
    title: "Tailwind CSS v4 的新特性前瞻",
    source: "Adam Wathan",
    url: "https://tailwindcss.com/",
    tags: ["CSS", "Design"],
    date: "2024-02-10"
  },
  {
    title: "Rust for JavaScript Developers",
    source: "Shuttle.rs",
    url: "https://www.shuttle.rs/",
    tags: ["Rust", "Backend"],
    date: "2024-03-05"
  }
];

// 模拟飞书/个人笔记数据
const NOTES = [
  {
    title: "Next.js 缓存机制踩坑记录",
    summary: "fetch 在服务端组件中默认缓存及其 revalidate 策略，以及如何正确使用 unstable_noStore。",
    category: "Next.js",
    lastUpdated: "2 days ago"
  },
  {
    title: "TypeScript 高级类型体操",
    summary: "使用 infer 关键字提取 Promise 返回类型的技巧，以及 Template Literal Types 的妙用。",
    category: "TypeScript",
    lastUpdated: "1 week ago"
  }
];

export function SectionKnowledge() {
  return (
    <section className="py-24 px-4 md:px-8 bg-white dark:bg-black/50 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* 左栏：Reading List */}
        <div className="space-y-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <Link2 size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Must Read</h3>
           </div>
           
           <div className="space-y-4">
              {READING_LIST.map((item, i) => (
                <motion.a 
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group block p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                >
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                           {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                           <span>{item.source}</span>
                           <span>•</span>
                           <span>{item.date}</span>
                           {item.tags.map(tag => (
                               <span key={tag} className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-[10px]">{tag}</span>
                           ))}
                        </div>
                     </div>
                     <ArrowUpRight size={16} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </motion.a>
              ))}
           </div>
        </div>

        {/* 右栏：Personal Notes */}
        <div className="space-y-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                <BookMarked size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Dev Notes</h3>
           </div>

           <div className="space-y-4">
              {NOTES.map((note, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-solid hover:border-purple-300 dark:hover:border-purple-800 bg-transparent hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all cursor-pointer group"
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
                 </motion.div>
              ))}
              
              {/* More Link */}
              <div className="text-center pt-4">
                 <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors">
                    <FileText size={16} /> View all notes
                 </a>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}

