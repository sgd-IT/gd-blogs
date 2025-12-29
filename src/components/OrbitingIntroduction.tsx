"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Gamepad2, 
  Globe, 
  Cpu, 
  Palette, 
  Bitcoin, 
  Terminal,
  User
} from "lucide-react";

// 定义图标数据：半径整体放大，制造大星系感
const orbitIcons = [
  // 内圈 (原半径约 110/130 -> 160/190)
  { Icon: Code2, color: "text-blue-500", delay: 0, radius: 160, size: 24, duration: 20 },
  { Icon: Gamepad2, color: "text-purple-500", delay: 5, radius: 190, size: 28, duration: 18, reverse: true },
  
  // 中圈 (原半径约 180/190/210 -> 260/280/300)
  { Icon: User, color: "text-indigo-500", delay: 0, radius: 260, size: 40, duration: 25 },
  { Icon: Globe, color: "text-green-500", delay: 8, radius: 280, size: 30, duration: 28 },
  { Icon: Cpu, color: "text-red-500", delay: 15, radius: 300, size: 22, duration: 22, reverse: true },
  
  // 外圈 (原半径约 260/280/300 -> 380/420/460)
  { Icon: Palette, color: "text-pink-500", delay: 2, radius: 380, size: 34, duration: 35 },
  { Icon: Bitcoin, color: "text-yellow-500", delay: 10, radius: 420, size: 26, duration: 40, reverse: true },
  { Icon: Terminal, color: "text-gray-500", delay: 20, radius: 460, size: 30, duration: 45 },
];

const OrbitingIntroduction = () => {
  return (
    <div className="relative flex min-h-[900px] w-full flex-col items-center justify-center overflow-hidden bg-transparent py-20">
      
      {/* 装饰性背景光晕 - 放大范围 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
         <div className="h-[800px] w-[800px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      {/* 环绕的图标容器 */}
      <div className="absolute flex h-full w-full items-center justify-center z-0 pointer-events-none">
        
        {/* 轨道圆环 (视觉辅助) - 放大 */}
        <div className="absolute h-[520px] w-[520px] rounded-full border border-dashed border-gray-200 dark:border-gray-800 opacity-20" />
        <div className="absolute h-[840px] w-[840px] rounded-full border border-gray-100 dark:border-gray-900 opacity-10" />

        {orbitIcons.map(({ Icon, color, delay, radius, size, duration, reverse }, index) => (
          <OrbitingIcon
            key={index}
            radius={radius}
            duration={duration}
            delay={delay}
            className={color}
            iconSize={size}
            reverse={reverse}
          >
            <Icon size={size * 0.6} />
          </OrbitingIcon>
        ))}
      </div>

      {/* 中心卡片 - 内容混合对齐：标题/列表左对齐，名字居中 */}
      <div className="z-10 relative">
        <div className="relative flex h-auto w-[280px] flex-col items-start justify-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl dark:border-gray-700/20 dark:bg-black/10">
            
            <div className="w-full">
                <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left">
                    My name is
                </h2>
                <h1 className="mb-4 text-3xl font-bold text-center text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                   Gdblogs
                </h1>
                
                {/* 分割线居中 */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50 mb-4" />
                
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left">
                    I'm a
                </h3>
                <ul className="space-y-1 text-sm font-medium text-gray-600 dark:text-gray-400 text-left">
                    <li>Influencer (&gt;286K followers)</li>
                    <li>Chromium Developer</li>
                    <li>Web Developer</li>
                    <li>Game Developer</li>
                    <li>Game Critic</li>
                    <li>Digital Nomad</li>
                    <li>Trader</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

// 环绕图标子组件 (保持不变)
interface OrbitingIconProps {
  children: React.ReactNode;
  radius: number;
  duration?: number;
  delay?: number;
  className?: string;
  iconSize?: number;
  reverse?: boolean;
}

const OrbitingIcon = ({ 
  children, 
  radius, 
  duration = 10, 
  delay = 0,
  className = "",
  iconSize = 30,
  reverse = false
}: OrbitingIconProps) => {
  return (
    <motion.div
      animate={{
        rotate: reverse ? [360, 0] : [0, 360],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
      style={{
        width: radius * 2,
        height: radius * 2,
      }}
      className="absolute flex items-start justify-center pointer-events-none"
    >
      <div 
        className={`flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black ${className}`}
        style={{ 
            width: iconSize, 
            height: iconSize,
            transform: `translateY(-50%)` 
        }}
      >
         <motion.div
            animate={{ rotate: reverse ? [-360, 0] : [0, -360] }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: delay,
            }}
            className="flex items-center justify-center w-full h-full"
         >
            {children}
         </motion.div>
      </div>
    </motion.div>
  );
};

export default OrbitingIntroduction;
