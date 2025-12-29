"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, ArrowRight, Terminal, Clock, Code2, Database, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

// 模拟项目数据
const FEATURED_PROJECT = {
  title: "CloudTaste Delivery",
  description: "基于 Spring Cloud 微服务架构的分布式外卖系统，支持高并发订单处理。",
  tags: ["Spring Cloud", "Docker", "Vue 3", "Redis"],
  image: "bg-gradient-to-br from-blue-900 to-slate-900" // 这里可以用真实图片 URL 替换
};

// 模拟最近提交数据
const CODING_STATS = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 8 },
  { day: "Wed", count: 15 },
  { day: "Thu", count: 22 },
  { day: "Fri", count: 5 },
  { day: "Sat", count: 30 },
  { day: "Sun", count: 10 },
];

// --- 辅助组件：卡片容器 ---
const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={cn(
      "group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur-md p-6 hover:shadow-xl dark:hover:bg-white/5 transition-all duration-300",
      className
    )}
  >
    {children}
  </motion.div>
);

export function SectionBento() {
  return (
    <section className="py-24 px-4 md:px-8 bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative transition-colors duration-300">
      {/* 标题 */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
          Selected Works & Stats
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        
        {/* 1. 核心项目展示 (Featured Project) - 2x2 */}
        <BentoCard className="md:col-span-2 md:row-span-2 relative group cursor-pointer border-blue-500/20 bg-gray-900 text-white">
          <div className={`absolute inset-0 ${FEATURED_PROJECT.image} transition-transform duration-700 group-hover:scale-105 opacity-50`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-end z-10 p-2">
            <div className="flex gap-2 mb-3">
              {FEATURED_PROJECT.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs rounded-md bg-white/10 border border-white/20 text-blue-200">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-3xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {FEATURED_PROJECT.title}
            </h3>
            <p className="text-gray-300 text-sm mb-6 line-clamp-2">
              {FEATURED_PROJECT.description}
            </p>
            
            <div className="flex gap-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <button className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors">
                <Github size={16} /> View Code
              </button>
              <button className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors">
                <ExternalLink size={16} /> Live Demo
              </button>
            </div>
          </div>
        </BentoCard>

        {/* 2. 技术栈 (The Toolkit) - 1x1 */}
        <BentoCard delay={0.1} className="flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.03] dark:bg-grid-white/[0.03]" />
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4 z-10">Toolkit</div>
          
          <Marquee className="[--duration:20s] w-full" pauseOnHover>
            {[Code2, Database, LayoutTemplate, Terminal, Clock].map((Icon, i) => (
              <div key={i} className="mx-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 transition-colors">
                <Icon size={24} className="text-gray-400 dark:text-gray-300" />
              </div>
            ))}
          </Marquee>
          
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />
        </BentoCard>

        {/* 3. 最近修仙 (Coding Stats) - 1x2 (Vertical on grid) - Keeping structure as requested, adjusted for grid flow */}
        <BentoCard delay={0.2} className="md:col-span-1 md:row-span-1 flex flex-col justify-between">
           <div className="flex items-center justify-between mb-2">
             <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Activity</div>
             <div className="text-xs text-green-500 dark:text-green-400">Online</div>
           </div>
           
           <div className="flex items-end justify-between gap-1 h-24">
             {CODING_STATS.map((stat, i) => (
               <div key={i} className="flex flex-col items-center gap-2 flex-1 group/bar">
                  <div 
                    className="w-full bg-green-500/10 dark:bg-green-500/20 rounded-sm relative overflow-hidden group-hover/bar:bg-green-500/20 dark:group-hover/bar:bg-green-500/40 transition-colors"
                    style={{ height: `${(stat.count / 30) * 100}%` }}
                  >
                     {/* 模拟进度条动画 */}
                     <motion.div 
                       initial={{ height: 0 }}
                       whileInView={{ height: '100%' }}
                       transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                       className="absolute bottom-0 left-0 w-full bg-green-500"
                     />
                  </div>
               </div>
             ))}
           </div>
           <div className="text-xs text-gray-400 text-right mt-2">
             Code never sleeps
           </div>
        </BentoCard>
        
        {/* 4. 最新技术笔记 (Latest Thought) - 1x2 (Vertical) */}
        <BentoCard delay={0.3} className="md:col-span-1 md:row-span-2 flex flex-col justify-between group cursor-pointer hover:border-gray-300 dark:hover:border-white/30">
          <div>
            <div className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-2">Latest Post</div>
            <div className="text-xs text-gray-500 mb-6">Oct 24, 2024</div>
            <h3 className="text-xl font-bold leading-tight mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
              深入理解 JVM 内存模型与 GC 调优
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
              Java 虚拟机内存模型是 Java 开发者进阶必须要掌握的核心知识点。本文将深度解析堆、栈、方法区...
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
             Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </BentoCard>

        {/* 5. 正在折腾 (Now Building) - 1x1 */}
        <BentoCard delay={0.4} className="flex flex-col justify-center items-center text-center">
           <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-white/10" />
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 rounded-full border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent"
             />
             <span className="text-xs font-bold text-gray-900 dark:text-white">45%</span>
           </div>
           <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Sora API Integration</div>
           <div className="text-xs text-gray-500 mt-1">Learning in progress</div>
        </BentoCard>

        {/* 6. 快捷代码片段 (Snippet) - 1x1 */}
        <BentoCard delay={0.5} className="md:col-span-1 overflow-hidden font-mono text-xs p-0 bg-[#1e1e1e] border-gray-800 text-gray-300">
           <div className="flex items-center gap-1.5 px-4 py-3 bg-[#252526] border-b border-white/5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
             <div className="ml-2 text-[10px] text-gray-500">script.sh</div>
           </div>
           <div className="p-4 text-gray-300 leading-relaxed opacity-80">
             <span className="text-purple-400">while</span> true; <span className="text-purple-400">do</span><br/>
             &nbsp;&nbsp;echo <span className="text-green-400">"Keep coding"</span><br/>
             &nbsp;&nbsp;sleep 1<br/>
             <span className="text-purple-400">done</span>
           </div>
        </BentoCard>

      </div>
    </section>
  );
}
