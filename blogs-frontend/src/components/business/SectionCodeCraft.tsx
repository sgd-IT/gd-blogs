"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Bot, Terminal, Cpu, Scroll, Plus, Minus } from "lucide-react";
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const skills = [
  "React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", 
  "Python", "Docker", "AWS", "Figma", "Git", "OpenAI API", "Prisma"
];

// 动态图标组件：会呼吸、发光
interface AnimatedIconProps {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  color: string;
  delay: number;
}

const AnimatedIcon = ({ icon: Icon, color, delay }: AnimatedIconProps) => {
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

const WindowsTerminal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [typedCommand, setTypedCommand] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [completed, setCompleted] = useState(false);

  const command = "type welcome.txt";

  useEffect(() => {
    if (!isInView) return;

    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex < command.length) {
        setTypedCommand(command.slice(0, currentIndex + 1));
        currentIndex++;
        // Random typing speed for realism (50-150ms)
        timeout = setTimeout(typeNextChar, 50 + Math.random() * 100); 
      } else {
        // Finished typing, wait a bit before showing output
        setTimeout(() => {
          setShowOutput(true);
          setCompleted(true);
        }, 500);
      }
    };

    // Initial delay before starting to type
    const startTimeout = setTimeout(() => {
       typeNextChar();
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(startTimeout);
    };
  }, [isInView]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden bg-[#0c0c0c] border border-gray-800 shadow-2xl font-mono text-sm md:text-base mt-10"
    >
      {/* Title Bar */}
      <div className="bg-[#1f1f1f] px-4 py-2 flex items-center justify-between select-none border-b border-gray-800">
        <div className="flex items-center gap-2">
           <Terminal className="w-4 h-4 text-gray-400" />
           <span className="text-gray-200 text-xs">Command Prompt</span>
        </div>
        <div className="flex gap-4 items-center">
           <div className="text-gray-400 hover:text-white cursor-pointer text-xs">
             ─
           </div>
           <div className="text-gray-400 hover:text-white cursor-pointer text-[10px] border border-gray-500 w-2.5 h-2.5 flex items-center justify-center">
           </div>
           <div className="text-gray-400 hover:text-red-500 cursor-pointer text-lg leading-none">
             ×
           </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 text-gray-300 font-mono leading-relaxed bg-black text-left min-h-[300px]">
        <div className="mb-4">
          <span>Microsoft Windows [Version 10.0.19045.3693]</span><br/>
          <span>(c) Microsoft Corporation. All rights reserved.</span>
        </div>

        <div className="mb-4">
          <span className="text-gray-300">C:\Users\Administrator\Desktop\gd-blogs&gt;</span>
          <span className="ml-2 text-gray-100">{typedCommand}</span>
          {!showOutput && (
            <span className="animate-pulse inline-block w-2 h-4 bg-gray-300 align-middle ml-1"></span>
          )}
        </div>

        {showOutput && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1 mb-4 text-white"
          >
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>&gt; Hello World!</motion.div>
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>&gt; 欢迎来到我的数字花园。</motion.div>
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>&gt; 这里记录了我关于代码、架构和技术的思考。</motion.div>
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>&gt; 保持好奇，持续构建。</motion.div>
          </motion.div>
        )}

        {completed && (
          <div>
             <span className="text-gray-300">C:\Users\Administrator\Desktop\gd-blogs&gt;</span>
             <span className="animate-pulse inline-block w-2 h-4 bg-gray-300 align-middle ml-1"></span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const PixelSkillCard = ({ skill }: { skill: string }) => {
  const [level, setLevel] = useState(5);
  const maxLevel = 10;

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止冒泡
    if (level < maxLevel) setLevel(l => l + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (level > 0) setLevel(l => l - 1);
  };

  // 简单确定性伪随机
  const seed = skill.length + skill.charCodeAt(0);
  const baseStr = 80 + (seed * 7) % 20; 
  const baseInt = 200 + (seed * 13) % 55;

  // 动态属性计算
  const currentStr = baseStr + (level * 3);
  const currentInt = baseInt + (level * 5);

  return (
    <div className="relative group mx-3 select-none transition-transform hover:-translate-y-1">
       {/* 阴影层 */}
      <div className="absolute inset-0 bg-gray-900 dark:bg-gray-100 translate-x-1 translate-y-1" />
      
      {/* 主体层 */}
      <div className="relative w-64 bg-white dark:bg-black border-2 border-gray-900 dark:border-white p-4 font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-200 dark:border-gray-800 pb-2">
          <span className="font-bold uppercase truncate max-w-[150px] text-sm" style={{ fontFamily: 'var(--font-pixel)' }}>
            {skill}
          </span>
          <Scroll className="w-4 h-4 text-gray-400" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
           <div>STR: <span className="text-gray-900 dark:text-white font-bold transition-all duration-300">{currentStr}</span></div>
           <div>INT: <span className="text-gray-900 dark:text-white font-bold transition-all duration-300">{currentInt}</span></div>
        </div>

        {/* Level Control */}
        <div className="flex items-center justify-between mb-2">
           <span className="font-bold text-gray-900 dark:text-white">LV.{level}</span>
           <div className="flex gap-2">
             <button 
               onClick={handleDecrease}
               className="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
               disabled={level <= 0}
             >
               <Minus size={12} />
             </button>
             <button 
               onClick={handleIncrease}
               className="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
               disabled={level >= maxLevel}
             >
               <Plus size={12} />
             </button>
           </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 w-full border border-gray-300 dark:border-gray-700 p-[2px]">
           <div 
             className={cn(
               "h-full transition-all duration-300 relative",
               level >= maxLevel ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-green-500"
             )}
             style={{ width: `${(level / maxLevel) * 100}%` }}
           >
             {level >= maxLevel && (
               <div className="absolute inset-0 bg-white/30 animate-pulse" />
             )}
           </div>
        </div>
        
        {/* Max Level Badge */}
        {level >= maxLevel && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[9px] font-bold px-2 py-0.5 border border-black shadow-sm rotate-12 z-10" style={{ fontFamily: 'var(--font-pixel)' }}>
            MAX
          </div>
        )}
      </div>
    </div>
  );
};

export function SectionCodeCraft() {
  return (
    <section className="py-12 md:py-24 px-4 md:px-8 relative overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 背景装饰 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 md:space-y-20 relative z-10">
        
        {/* 标题 */}
        <div className="text-center space-y-4 md:space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-white/60 bg-clip-text text-transparent"
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
            className="h-full"
          >
            <SpotlightCard className="h-full bg-transparent border-none shadow-none" spotlightColor="rgba(59, 130, 246, 0.4)">
              <div className="relative p-8 h-full bg-white dark:bg-white/5 hover:shadow-xl transition-all">
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
              </div>
            </SpotlightCard>
          </motion.div>

          {/* 右侧卡片：AI */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <SpotlightCard className="h-full bg-transparent border-none shadow-none" spotlightColor="rgba(168, 85, 247, 0.4)">
              <div className="relative p-8 h-full bg-white dark:bg-white/5 hover:shadow-xl transition-all">
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
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* Windows Terminal */}
        <WindowsTerminal />

        {/* 技能跑马灯 - RPG 风格 */}
        <div className="space-y-12">
           <div className="text-center space-y-2">
             <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-pixel)' }}>
               Ability Status
             </div>
             <div className="text-[10px] text-gray-400">Hover to pause & adjust stats</div>
           </div>
           
           <div className="relative py-4">
             <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10"></div>
             <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10"></div>
             
             <Marquee pauseOnHover className="[--duration:40s] [--gap:0rem]">
              {skills.map((skill) => (
                <PixelSkillCard key={skill} skill={skill} />
              ))}
            </Marquee>
          </div>
        </div>

      </div>
    </section>
  );
}
