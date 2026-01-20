"use client";

import React from "react";
import { motion } from "framer-motion";
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

const baseOrbitIcons: OrbitIconData[] = [
  {
    image: "/ico/idea.ico",
    name: "IntelliJ IDEA",
    color: "bg-transparent overflow-hidden",
    delay: 0,
    radius: 160,
    size: 70,
    duration: 20,
    startAngle: 0,
  },
  {
    image: "/ico/google.ico",
    name: "Google",
    color: "bg-transparent overflow-hidden",
    delay: 0,
    radius: 190,
    size: 65,
    duration: 20,
    reverse: true,
    startAngle: 180,
  },
  {
    image: "/blogs.png",
    name: "Avatar",
    color: "text-indigo-600 bg-transparent overflow-hidden",
    delay: 0,
    radius: 260,
    size: 150,
    duration: 30,
    startAngle: 90,
  },
  {
    image: "/ico/msedge.ico",
    name: "Edge",
    color: "bg-transparent overflow-hidden",
    delay: 0,
    radius: 280,
    size: 60,
    duration: 30,
    startAngle: 270,
  },
  {
    image: "/ico/cursor.ico",
    name: "Cursor",
    color: "bg-transparent overflow-hidden rounded-full",
    delay: 0,
    radius: 300,
    size: 55,
    duration: 30,
    reverse: true,
    startAngle: 45,
  },
  {
    image: "/ico/docker.ico",
    name: "Docker",
    color: "bg-transparent overflow-hidden",
    delay: 0,
    radius: 380,
    size: 50,
    duration: 40,
    startAngle: 135,
  },
  {
    image: "/ico/webstorm.ico",
    name: "WebStorm",
    color: "bg-transparent overflow-hidden",
    delay: 0,
    radius: 420,
    size: 45,
    duration: 40,
    reverse: true,
    startAngle: 225,
  },
  {
    image: "/ico/steam.ico",
    name: "Steam",
    color: "bg-transparent overflow-hidden",
    delay: 0,
    radius: 460,
    size: 40,
    duration: 40,
    startAngle: 315,
  },
];

const MOBILE_SCALE = 0.42;

const orbitIcons = baseOrbitIcons.map((icon) => ({
  ...icon,
  radius: Math.round(icon.radius * MOBILE_SCALE),
  size: Math.round(icon.size * MOBILE_SCALE),
}));

const OrbitingIntroductionMobile = () => {
  return (
    <div className="relative flex min-h-[480px] w-full flex-col items-center justify-center overflow-hidden bg-transparent py-12">
      {/* 装饰性背景光晕 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div className="h-[320px] w-[320px] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      {/* 环绕的图标容器 */}
      <div className="absolute flex h-full w-full items-center justify-center z-0 pointer-events-none">
        {/* 轨道圆环 (视觉辅助) */}
        <div className="absolute h-[280px] w-[280px] rounded-full border border-dashed border-gray-200 dark:border-gray-800 opacity-20" />
        <div className="absolute h-[420px] w-[420px] rounded-full border border-gray-100 dark:border-gray-900 opacity-10" />

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
            {image ? (
              <Image src={image} alt={name || "Icon"} width={size} height={size} className="h-full w-full object-cover" />
            ) : (
              Icon && <Icon size={size * 0.5} strokeWidth={1.5} />
            )}
          </OrbitingIcon>
        ))}
      </div>

      {/* 中心卡片 - 移动端只做布局适配 */}
      <div className="z-10 relative">
        <motion.div className="relative flex h-auto w-[240px] flex-col items-start justify-center rounded-xl border border-white/10 bg-white/5 p-5 shadow-xl dark:border-gray-700/20 dark:bg-black/10 cursor-pointer backdrop-blur-sm">
          <div className="w-full">
            <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left">
              你好，我是
            </h2>
            <h1 className="mb-2 text-xl font-bold text-center text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                木东
            </h1>
            <p className="mb-4 text-[11px] text-gray-500 dark:text-gray-400 text-left">
                AI全栈开发 · 技术写作 · 项目实践
            </p>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50 mb-4" />

            <h3 className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-left">
              当前关注
            </h3>
            <ul className="space-y-1 text-xs font-medium text-gray-600 dark:text-gray-400 text-left">
              <li>Agent Skills/vibe coding</li>
              <li>Spring Boot / 后端工程化</li>
              <li>各种开发方法和模式与Ai的使用部署</li>
              <li>持续记录与开源分享</li>
            </ul>
          </div>
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
  startAngle = 0,
}: OrbitingIconProps) => {
  return (
    <motion.div
      initial={{ rotate: startAngle }}
      animate={{
        rotate: reverse ? [startAngle, startAngle - 360] : [startAngle, startAngle + 360],
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
          transform: "translateY(-50%)",
        }}
      >
        <motion.div
          initial={{ rotate: -startAngle }}
          animate={{
            rotate: reverse ? [-startAngle, -startAngle + 360] : [-startAngle, -startAngle - 360],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            delay: delay,
          }}
          className="flex items-center justify-center w-full h-full overflow-hidden rounded-full"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrbitingIntroductionMobile;

