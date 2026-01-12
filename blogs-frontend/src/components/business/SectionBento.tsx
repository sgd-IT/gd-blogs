"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Github, ExternalLink, ArrowRight, Terminal, Clock, Code2, Database, LayoutTemplate,
  Cpu, Globe, Zap, Shield, Bot, Workflow 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { MagneticButton } from "@/components/ui/magnetic-button";

// 模拟项目数据
const FEATURED_PROJECT = {
  title: "CloudTaste Delivery",
  description: "基于 Spring Cloud 微服务架构的分布式外卖系统，支持高并发订单处理。",
  tags: ["Spring Cloud", "Docker", "Vue 3", "Redis"],
  image: "bg-gradient-to-br from-blue-900 to-slate-900" 
};

// 模拟最近代码量数值 (纯数据)
const MOCK_COUNTS = [2450, 3200, 1890, 4100, 1200, 5600, 1800];

// --- 辅助组件：卡片容器 ---
const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  // 分离布局类名（给外层 motion.div）和样式类名（给内层 div）
  const isColSpan = className?.includes("col-span");
  const isRowSpan = className?.includes("row-span");
  
  // 提取布局相关的类名
  const layoutClasses = [
    isColSpan || isRowSpan ? "" : "col-span-1",
    className?.match(/col-span-\d+/)?.[0],
    className?.match(/row-span-\d+/)?.[0],
    className?.match(/md:col-span-\d+/)?.[0],
    className?.match(/md:row-span-\d+/)?.[0],
  ].filter(Boolean).join(" ");

  // 移除布局类名，剩下的给内部容器作为样式
  const styleClasses = className?.replace(/col-span-\d+|row-span-\d+|md:col-span-\d+|md:row-span-\d+/g, "").trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={cn("h-full", layoutClasses)}
    >
      <div 
        className={cn(
          // 基础卡片样式
          "group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur-md p-6 hover:shadow-xl dark:hover:bg-white/5 transition-all duration-300 h-full",
          // 关键修复：强制 GPU 渲染层，解决 Safari/Chrome 圆角溢出 bug (Black corners fix)
          "transform-gpu [transform:translateZ(0)]",
          styleClasses
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

export function SectionBento() {
  const [codingStats, setCodingStats] = React.useState(
    MOCK_COUNTS.map(count => ({ count, date: "", day: "" }))
  );

  React.useEffect(() => {
    const today = new Date();
    const newStats = MOCK_COUNTS.map((count, index) => {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - (6 - index));
      return {
        count,
        date: targetDate.getDate().toString().padStart(2, '0'),
        day: targetDate.toLocaleDateString('en-US', { weekday: 'short' }),
      };
    });
    setCodingStats(newStats);
  }, []);

  return (
    <section className="py-24 px-4 md:px-8 relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-50 dark:from-black dark:via-black/60 dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 顶部/底部过渡 */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent dark:from-black z-0" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent dark:from-black z-0" />

      <div className="relative z-10">
        {/* 标题 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
            Selected Works & Stats
          </h2>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        
        {/* 1. 核心项目展示 */}
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
              <MagneticButton>
                <button className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors px-4 py-2 rounded-full bg-white/10 border border-white/20">
                  <Github size={16} /> View Code
                </button>
              </MagneticButton>
              <MagneticButton>
                <button className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors px-4 py-2 rounded-full bg-white/10 border border-white/20">
                  <ExternalLink size={16} /> Live Demo
                </button>
              </MagneticButton>
            </div>
          </div>
        </BentoCard>

        {/* 2. 技术栈 */}
        <BentoCard delay={0.1} className="flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:to-[#000000]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          <div className="text-xs font-bold uppercase tracking-wider mb-6 z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            Cyber Toolkit
          </div>
          
          <Marquee className="[--duration:20s] w-full" pauseOnHover>
            {[
              { icon: Code2, color: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]" },
              { icon: Database, color: "text-magenta-400 text-fuchsia-400", border: "border-fuchsia-500/30", glow: "shadow-[0_0_15px_rgba(232,121,249,0.3)]" },
              { icon: LayoutTemplate, color: "text-yellow-400", border: "border-yellow-500/30", glow: "shadow-[0_0_15px_rgba(250,204,21,0.3)]" },
              { icon: Terminal, color: "text-green-400", border: "border-green-500/30", glow: "shadow-[0_0_15px_rgba(74,222,128,0.3)]" },
              { icon: Clock, color: "text-blue-400", border: "border-blue-500/30", glow: "shadow-[0_0_15px_rgba(96,165,250,0.3)]" },
              { icon: Cpu, color: "text-orange-400", border: "border-orange-500/30", glow: "shadow-[0_0_15px_rgba(251,146,60,0.3)]" },
              { icon: Zap, color: "text-yellow-300", border: "border-yellow-300/30", glow: "shadow-[0_0_15px_rgba(253,224,71,0.3)]" },
              { icon: Shield, color: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]" },
              { icon: Bot, color: "text-rose-400", border: "border-rose-500/30", glow: "shadow-[0_0_15px_rgba(251,113,133,0.3)]" },
              { icon: Globe, color: "text-indigo-400", border: "border-indigo-500/30", glow: "shadow-[0_0_15px_rgba(129,140,248,0.3)]" },
              { icon: Workflow, color: "text-violet-400", border: "border-violet-500/30", glow: "shadow-[0_0_15px_rgba(167,139,250,0.3)]" },
            ].map((item, i) => (
              <div 
                key={i} 
                className={`mx-4 p-3.5 rounded-xl bg-black/40 backdrop-blur-sm border ${item.border} ${item.glow} hover:scale-110 hover:bg-white/10 transition-all duration-300 group/icon`}
              >
                <item.icon size={24} className={`${item.color} drop-shadow-[0_0_8px_currentColor] group-hover/icon:animate-pulse`} />
              </div>
            ))}
          </Marquee>
          
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 dark:from-black to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 dark:from-black to-transparent z-10" />
        </BentoCard>

        {/* 3. Coding Stats */}
        <BentoCard delay={0.2} className="md:col-span-1 md:row-span-1 flex flex-col p-6 min-h-[180px]">
           <div className="flex items-center justify-between mb-4">
             <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">7-Day Lines</div>
             <div className="text-xs text-blue-500 dark:text-blue-400 font-mono font-bold">+20.3k</div>
           </div>
           
           <div className="flex-1 w-full flex items-end justify-between gap-2 min-h-[80px] relative">
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
               <div className="w-full border-t border-dashed border-gray-400"></div>
               <div className="w-full border-t border-dashed border-gray-400"></div>
               <div className="w-full border-t border-dashed border-gray-400"></div>
             </div>

             {codingStats.map((stat, i) => {
               const isMax = stat.count === Math.max(...codingStats.map(s => s.count));
               return (
               <div key={i} className="relative flex-1 h-full flex items-end group/bar z-10">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl border border-gray-700">
                    <span className="font-bold">{stat.count}</span> <span className="text-gray-400">lines</span>
                  </div>
                  
                  <div className="absolute bottom-0 w-full h-full bg-gray-200/50 dark:bg-white/5 rounded-t-sm" />

                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(stat.count / 6000) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                    className={cn(
                      "w-full rounded-t-sm relative z-10 transition-all duration-300",
                      isMax 
                        ? "bg-gradient-to-t from-blue-600 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                        : "bg-gradient-to-t from-blue-500 to-blue-400 group-hover/bar:from-blue-400 group-hover/bar:to-blue-300"
                    )}
                  />
                  
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-mono font-medium">
                    {stat.date}
                  </div>
               </div>
               );
             })}
           </div>
           <div className="h-2"></div>
        </BentoCard>
        
        {/* 4. Latest Post */}
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

        {/* 5. Now Building */}
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

        {/* 6. Snippet */}
        <BentoCard delay={0.5} className="md:col-span-1 overflow-hidden font-mono text-xs p-0 bg-[#1e1e1e] border-gray-800 text-gray-300">
           <div className="flex items-center gap-1.5 px-4 py-3 bg-[#252526] border-b border-white/5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
             <div className="ml-2 text-[10px] text-gray-500">script.sh</div>
           </div>
           <div className="p-4 text-gray-300 leading-relaxed opacity-80">
             <span className="text-purple-400">while</span> true; <span className="text-purple-400">do</span><br/>
             &nbsp;&nbsp;echo <span className="text-green-400">&quot;Keep coding&quot;</span><br/>
             &nbsp;&nbsp;sleep 1<br/>
             <span className="text-purple-400">done</span>
           </div>
        </BentoCard>

        </div>
      </div>
    </section>
  );
}
