"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { User } from "lucide-react";
import Image from "next/image";

// 定义图标数据类型
interface OrbitIconData {
  Icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  color: string;
  delay: number;
  radius: number;
  size: number;
  duration: number;
  reverse?: boolean;
  startAngle: number;
  image?: string;
  name?: string;
}

// 定义图标数据
const orbitIcons: OrbitIconData[] = [
  // 1. Idea (Largest, Inner)
  { 
    image: "/ico/idea.ico", 
    name: "IntelliJ IDEA",
    color: "bg-transparent overflow-hidden", 
    delay: 0,  
    radius: 160, 
    size: 70, 
    duration: 20, 
    startAngle: 0 
  },
  // 2. Google
  { 
    image: "/ico/google.ico", 
    name: "Google",
    color: "bg-transparent overflow-hidden", 
    delay: 0,  
    radius: 190, 
    size: 65, 
    duration: 20, 
    reverse: true, 
    startAngle: 180 
  },
  
  // 3. Avatar (Center Fixed)
  { 
    image: "/blogs.png",
    name: "Avatar",
    color: "text-indigo-600 bg-transparent overflow-hidden", 
    delay: 0,  
    radius: 260, 
    size: 150, 
    duration: 30, 
    startAngle: 90 
  },

  // 4. Edge
  { 
    image: "/ico/msedge.ico", 
    name: "Edge",
    color: "bg-transparent overflow-hidden", 
    delay: 0,  
    radius: 280, 
    size: 60, 
    duration: 30, 
    startAngle: 270 
  },
  // 5. Cursor
  { 
    image: "/ico/cursor.ico", 
    name: "Cursor",
    color: "bg-transparent overflow-hidden rounded-full", 
    delay: 0,  
    radius: 300, 
    size: 55, 
    duration: 30, 
    reverse: true, 
    startAngle: 45 
  },
  
  // 6. Docker
  { 
    image: "/ico/docker.ico", 
    name: "Docker",
    color: "bg-transparent overflow-hidden", 
    delay: 0,  
    radius: 380, 
    size: 50, 
    duration: 40, 
    startAngle: 135 
  },
  // 7. WebStorm
  { 
    image: "/ico/webstorm.ico", 
    name: "WebStorm",
    color: "bg-transparent overflow-hidden", 
    delay: 0,  
    radius: 420, 
    size: 45, 
    duration: 40, 
    reverse: true, 
    startAngle: 225 
  },
  // 8. Steam (Smallest, Outer)
  { 
    image: "/ico/steam.ico", 
    name: "Steam",
    color: "bg-transparent overflow-hidden", 
    delay: 0,  
    radius: 460, 
    size: 40, 
    duration: 40, 
    startAngle: 315 
  },
];

const OrbitingIntroduction = () => {
  // --- 3D 倾斜效果逻辑 ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 使用弹簧物理效果让移动更平滑
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // 1. 倾斜：根据鼠标位置计算旋转角度
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  // 2. 磁吸：根据鼠标位置计算位移
  const magneticX = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const magneticY = useTransform(mouseY, [-0.5, 0.5], [-40, 40]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // 计算鼠标相对于卡片中心的归一化位置 (-0.5 到 0.5)
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    // 鼠标离开时复位
    x.set(0);
    y.set(0);
  };
  // -----------------------

  return (
    <div className="relative flex min-h-[900px] w-full flex-col items-center justify-center overflow-hidden bg-transparent py-20">
      
      {/* 装饰性背景光晕 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
         <div className="h-[800px] w-[800px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      {/* 环绕的图标容器 */}
      <div className="absolute flex h-full w-full items-center justify-center z-0 pointer-events-none">
        
        {/* 轨道圆环 (视觉辅助) */}
        <div className="absolute h-[520px] w-[520px] rounded-full border border-dashed border-gray-200 dark:border-gray-800 opacity-20" />
        <div className="absolute h-[840px] w-[840px] rounded-full border border-gray-100 dark:border-gray-900 opacity-10" />

        {orbitIcons.map(({ Icon, color, delay, radius, size, duration, reverse, startAngle, image, name }, index) => (
          <OrbitingIcon
            key={index}
            radius={radius}
            duration={duration}
            delay={delay}
            className={color}
            iconSize={size}
            reverse={reverse}
            startAngle={startAngle}
          >
            {/* 统一使用 Image 组件渲染 */}
            {image ? (
              <Image 
                src={image} 
                alt={name || "Icon"} 
                width={size} 
                height={size} 
                className="h-full w-full object-cover" // object-cover 保持比例填充
              />
            ) : (
              // 兼容旧代码，防止出错
               Icon && <Icon size={size * 0.5} strokeWidth={1.5} />
            )}
          </OrbitingIcon>
        ))}
      </div>

      {/* 中心卡片 - 3D 效果 + 磁吸 */}
      <div className="z-10 relative" style={{ perspective: 1000 }}>
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                x: magneticX,
                y: magneticY,
                transformStyle: "preserve-3d",
            }}
            className="relative flex h-auto w-[280px] flex-col items-start justify-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl dark:border-gray-700/20 dark:bg-black/10 cursor-pointer"
        >
            {/* 内容容器 - 稍微前凸以增强 3D 感 */}
            <div 
                className="w-full"
                style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
            >
                <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left">
                    My name is
                </h2>
                <h1 className="mb-4 text-3xl font-bold text-center text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                   Gdblogs
                </h1>
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50 mb-4" />
                
                <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left">
                    I&apos;m a
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
            
            {/* 添加一个反光层，增加质感 */}
            <div 
                className="absolute inset-0 z-10 rounded-xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" 
            />
        </motion.div>
      </div>
    </div>
  );
};

// 环绕图标子组件
interface OrbitingIconProps {
  children: React.ReactNode;
  radius: number;
  duration?: number;
  delay?: number;
  className?: string;
  iconSize?: number;
  reverse?: boolean;
  startAngle?: number; 
}

const OrbitingIcon = ({ 
  children, 
  radius, 
  duration = 10, 
  delay = 0,
  className = "",
  iconSize = 30,
  reverse = false,
  startAngle = 0 
}: OrbitingIconProps) => {
  return (
    <motion.div
      initial={{ rotate: startAngle }}
      animate={{
        rotate: reverse 
          ? [startAngle, startAngle - 360] 
          : [startAngle, startAngle + 360],
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
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{ 
            width: iconSize, 
            height: iconSize,
            transform: `translateY(-50%)` 
        }}
      >
         <motion.div
            initial={{ rotate: -startAngle }} 
            animate={{ 
              rotate: reverse 
                ? [-startAngle, -startAngle + 360] 
                : [-startAngle, -startAngle - 360] 
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: delay,
            }}
            className="flex items-center justify-center w-full h-full overflow-hidden rounded-full" // 确保图片裁剪
         >
            {children}
         </motion.div>
      </div>
    </motion.div>
  );
};

export default OrbitingIntroduction;
