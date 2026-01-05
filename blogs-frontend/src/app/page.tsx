"use client";

import Link from "next/link";
import OrbitingIntroduction from "@/components/business/OrbitingIntroduction";
import { SectionCodeCraft } from "@/components/business/SectionCodeCraft";
import { SectionBento } from "@/components/business/SectionBento";
import { SectionKnowledge } from "@/components/business/SectionKnowledge";
import { ArrowRight, Code2, Coffee, Activity, Camera, Github, Terminal } from "lucide-react";
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
        风格：大图 + 列表，温暖，活力
        =============================================
      */}
      <ScrollRevealSection className="w-full py-24 bg-white dark:bg-black relative z-30">
         <div className="container mx-auto px-4 max-w-6xl">
            
            {/* 标题 */}
            <div className="flex items-center gap-3 mb-12">
             <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400">
               <Activity size={24} />
             </div>
             <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Life & Motion</h2>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* 左侧：视觉重点 (运动/照片) */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
                 {/* 占位背景 - 实际开发中请替换为 <Image src="..." /> */}
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500" />
                 
                 {/* 覆盖层内容 */}
                 <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white p-8 text-center">
                    <Camera size={48} className="mb-4 opacity-80" />
                    <h3 className="text-3xl font-bold mb-2">Cycling in Hangzhou</h3>
                    <p className="text-white/80">Every ride is a new story.</p>
                 </div>
                 
                 {/* 底部数据条 */}
                 <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm p-4 flex justify-around text-center">
                     <div>
                         <div className="text-xs text-gray-500 uppercase tracking-wider">Distance</div>
                         <div className="font-bold text-gray-900 dark:text-white">42.5 km</div>
                     </div>
                     <div>
                         <div className="text-xs text-gray-500 uppercase tracking-wider">Elevation</div>
                         <div className="font-bold text-gray-900 dark:text-white">320 m</div>
                     </div>
                     <div>
                         <div className="text-xs text-gray-500 uppercase tracking-wider">Time</div>
                         <div className="font-bold text-gray-900 dark:text-white">2h 15m</div>
                     </div>
                 </div>
              </div>

              {/* 右侧：生活随笔列表 */}
              <div className="space-y-6">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Stories</h3>
                 
                 {[1, 2, 3].map((item) => (
                    <Link key={item} href={`/blog/life-${item}`} className="flex gap-6 group cursor-pointer">
                       {/* 日期/序号 */}
                       <div className="flex-shrink-0 w-16 text-center pt-2">
                           <span className="block text-2xl font-bold text-gray-200 dark:text-gray-800 group-hover:text-orange-500 transition-colors">0{item}</span>
                           <span className="text-xs text-gray-400">DEC</span>
                       </div>
                       
                       {/* 内容 */}
                       <div className="pb-6 border-b border-gray-100 dark:border-gray-800 w-full">
                           <div className="flex items-center gap-2 text-xs text-orange-500 font-medium mb-1 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0">
                              <Coffee size={12} /> Life Log
                           </div>
                           <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                               The Art of Pour Over Coffee
                           </h4>
                           <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                               Exploring how water temperature affects the taste of Ethiopian beans...
                           </p>
                       </div>
                    </Link>
                 ))}

                 <Link href="/life" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mt-4">
                    View All Stories <ArrowRight size={16} />
                 </Link>
              </div>

           </div>
         </div>
      </ScrollRevealSection>

    </main>
  );
}
