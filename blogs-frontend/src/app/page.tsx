"use client";

import Link from "next/link";
import OrbitingIntroduction from "@/components/business/OrbitingIntroduction";
import { SectionCodeCraft } from "@/components/business/SectionCodeCraft";
import { SectionBento } from "@/components/business/SectionBento";
import { SectionKnowledge } from "@/components/business/SectionKnowledge";
import LifeTimeline from "@/components/business/LifeTimeline";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// 封装一个视差组件 (给 Hero 用)
interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
}

function ParallaxSection({ children, className }: ParallaxSectionProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]); // 滚动 500px，元素下移 200px
    const opacity = useTransform(scrollY, [0, 300], [1, 0]); // 滚动 300px，元素消失

    return (
        <motion.div style={{ y, opacity }} className={className}>
            {children}
        </motion.div>
    );
}

// 封装一个简单的滚动显现组件
interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
}

function ScrollRevealSection({ children, className }: ScrollRevealSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"] // 元素顶部碰到视口底部 -> 元素中心碰到视口中心
  });

  // 动画映射
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]); // 从下往上移 100px
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]); // 前半段渐显
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]); // 微微放大

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity, scale }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  
  // 监听整个容器的滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main ref={containerRef} className="flex min-h-screen flex-col items-center bg-white dark:bg-black selection:bg-purple-500 selection:text-white relative pt-16">
      
      {/* 
        =============================================
        第一区：Header & Hero (核心印象)
        包含：背景装饰 + OrbitingIntroduction
        =============================================
      */}
      <ParallaxSection className="relative w-full overflow-hidden z-10">
         {/* 背景装饰：网格效果 */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-400 opacity-20 blur-[100px] dark:bg-purple-900"></div>
        </div>

        <div className="w-full">
            <OrbitingIntroduction />
        </div>
      </ParallaxSection>


      {/* 
        =============================================
        第二区：Code & Craft (代码专业展示)
        风格：Bento Grid，科技感
        =============================================
      */}
      <SectionCodeCraft />
      <SectionBento />
      
      {/* 第二分区 - Note 分区：精选分享（技术栈/项目）+ 学习笔记/博客 */}
      <SectionKnowledge />

      {/* 
        =============================================
        第三区：Life & Motion (生活/运动区)
        风格：动态时间轴 + 卡片上浮
        =============================================
      */}
      <LifeTimeline />

    </main>
  );
}
