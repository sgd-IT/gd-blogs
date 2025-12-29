"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Bot, Layers, Terminal, Cpu, Globe } from "lucide-react";
import Marquee from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

const skills = [
  "React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", 
  "Python", "Docker", "AWS", "Figma", "Git", "OpenAI API", "Prisma"
];

// 动态图标组件：会呼吸、发光
const AnimatedIcon = ({ icon: Icon, color, delay }: { icon: any, color: string, delay: number }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="relative flex items-center justify-center w-32 h-32"
    >
      {/* 呼吸的光晕 */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute inset-0 rounded-full blur-3xl opacity-20", color.replace("text-", "bg-"))}
      />
      
      {/* 悬浮的图标 */}
      <motion.div
        animate={{ y: [-5, 5, -5], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className={cn("w-20 h-20 drop-shadow-2xl", color)} strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
};

export function SectionCodeCraft() {
  return (
    <section className="py-24 px-4 md:px-8 relative overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 背景装饰 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        
        {/* 标题 */}
        <div className="text-center space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-white/60 bg-clip-text text-transparent"
          >
            Craft & Intelligence
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            不需要复杂的素材，代码本身就是最好的艺术品。
          </motion.p>
        </div>

        {/* 双卡片布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 左侧卡片：Engineering */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="group relative rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 overflow-hidden hover:shadow-xl dark:hover:border-white/20 transition-all shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
                  <Terminal className="w-3 h-3" />
                  Full Stack
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Engineering</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  构建高性能、可扩展的 Web 应用。专注于 React 生态系统与现代前端架构。
                </p>
              </div>
              <AnimatedIcon icon={Code2} color="text-blue-500" delay={0.2} />
            </div>
          </motion.div>

          {/* 右侧卡片：AI */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="group relative rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 overflow-hidden hover:shadow-xl dark:hover:border-white/20 transition-all shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-medium">
                   <Bot className="w-3 h-3" />
                   AI Powered
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Intelligence</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                   探索 LLM 应用开发。致力于将人工智能集成到直观的用户体验中。
                </p>
              </div>
              <AnimatedIcon icon={Cpu} color="text-purple-500" delay={0.4} />
            </div>
          </motion.div>
        </div>

        {/* 技能跑马灯 */}
        <div className="space-y-8">
           <div className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
             Technologies I Use
           </div>
           
           <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-black to-transparent z-10"></div>
             <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-black to-transparent z-10"></div>
             
             <Marquee pauseOnHover className="[--duration:30s] [--gap:2rem]">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/30 hover:text-black dark:hover:text-white transition-all cursor-default shadow-sm dark:shadow-none"
                >
                  <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  {skill}
                </div>
              ))}
            </Marquee>
          </div>
        </div>

      </div>
    </section>
  );
}
