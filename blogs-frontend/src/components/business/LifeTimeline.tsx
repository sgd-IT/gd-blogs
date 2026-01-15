"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Calendar, Camera, Activity, Mountain, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import ChinaTravelMap from "./ChinaTravelMap";

// --- Types & Data ---

type LifeType = "sports" | "travel" | "daily";

interface LifePost {
  id: string;
  type: LifeType;
  title: string;
  date: string;
  place?: string;
  text: string;
  photos: { src: string; caption?: string }[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";
const LIFE_IMAGE_BASE = `${BACKEND_URL}/uploads/images/life`;

// Mock Data
const MOCK_LIFE_DATA: LifePost[] = [
  {
    id: "2026-01-14-basketball",
    type: "sports",
    title: "下班后的篮球局",
    date: "2026-01-14",
    place: "小区球场",
    text: "风有点冷，但投进三分那一下真爽。今天的目标：把生活的电量充满。",
    photos: [
      { src: `${LIFE_IMAGE_BASE}/sports/basketball-1.jpg`, caption: "夜灯下的球场" },
      { src: `${LIFE_IMAGE_BASE}/sports/basketball-2.jpg`, caption: "汗水是最好的滤镜" },
      { src: `${LIFE_IMAGE_BASE}/sports/basketball-3.jpg`, caption: "收工" },
    ],
  },
  {
    id: "2026-01-10-hiking",
    type: "sports",
    title: "爬山日：把烦恼交给风",
    date: "2026-01-10",
    place: "郊外·山径",
    text: "上山时喘得不行，下山时整个人都轻了。原来松弛感是走出来的。",
    photos: [
      { src: `${LIFE_IMAGE_BASE}/sports/hiking-1.jpg`, caption: "山顶风景" }
    ],
  },
  {
    id: "2025-12-28-travel",
    type: "travel",
    title: "旅行碎片：海边的傍晚",
    date: "2025-12-28",
    place: "某地·海岸线",
    text: "太阳落下去的时候，海面像被撒了一把金粉。那一刻只想慢一点，再慢一点。",
    photos: [
      { src: `${LIFE_IMAGE_BASE}/travel/seaside-1.jpg`, caption: "夕阳" },
      { src: `${LIFE_IMAGE_BASE}/travel/seaside-2.jpg`, caption: "海浪" },
    ],
  },
  {
      id: "2025-12-20-run",
      type: "sports",
      title: "晨跑打卡",
      date: "2025-12-20",
      place: "滨江公园",
      text: "早起跑步，遇见了清晨的第一缕阳光。坚持是一种习惯。",
      photos: [
          { src: `${LIFE_IMAGE_BASE}/sports/running-1.jpg`, caption: "跑道" },
          { src: `${LIFE_IMAGE_BASE}/sports/running-2.jpg`, caption: "日出" }
      ]
  }
];

// --- Components ---

const TypeIcon = ({ type }: { type: LifeType }) => {
  switch (type) {
    case "sports":
      return <Activity size={16} className="text-orange-500" />;
    case "travel":
      return <Plane size={16} className="text-blue-500" />;
    default:
      return <Camera size={16} className="text-purple-500" />;
  }
};

const TypeTag = ({ type }: { type: LifeType }) => {
  const styles = {
    sports: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    travel: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    daily: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  };

  const labels = {
    sports: "Sports",
    travel: "Travel",
    daily: "Daily",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[type])}>
      <TypeIcon type={type} />
      {labels[type]}
    </span>
  );
};

const ImageGrid = ({ photos }: { photos: { src: string; caption?: string }[] }) => {
  const count = photos.length;

  if (count === 1) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 group">
        <img
          src={photos[0].src}
          alt={photos[0].caption || "Life photo"}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {photos[0].caption && (
           <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-2 text-xs text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
             {photos[0].caption}
           </div>
        )}
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 group">
            <img
              src={photo.src}
              alt={photo.caption || `Life photo ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  // 3 or more: grid
  return (
    <div className={cn("grid gap-3", count === 3 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
      {photos.slice(0, 3).map((photo, i) => (
        <div
          key={i}
          className={cn(
            "relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 group",
             count === 3 && i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
          )}
        >
          <img
            src={photo.src}
            alt={photo.caption || `Life photo ${i + 1}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
           {count > 3 && i === 2 && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg">
                   +{count - 3}
               </div>
           )}
        </div>
      ))}
    </div>
  );
};

const TimelineItem = ({ post, index }: { post: LifePost; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
      className={cn(
        "relative flex w-full md:w-1/2 mb-12",
        index > 0 && "md:-mt-48",
        isEven ? "md:ml-auto md:pl-12" : "md:mr-auto md:pr-12 md:flex-row-reverse md:text-right"
      )}
    >
      {/* Timeline Dot (Desktop Center) */}
      <div
        className={cn(
          "hidden md:flex absolute top-0 w-8 h-8 rounded-full border-4 border-white dark:border-black bg-gray-200 dark:bg-gray-800 items-center justify-center z-10 shadow-lg",
          isEven ? "-left-4" : "-right-4",
          post.type === "sports" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
        )}
      >
         <TypeIcon type={post.type} />
      </div>

      {/* Mobile Timeline Dot (Left side) - Line removed from here, moved to parent */}
      <div className={cn(
          "md:hidden absolute top-0 -left-2 w-4 h-4 rounded-full border-2 border-white dark:border-black shadow-sm z-10",
           post.type === "sports" ? "bg-orange-500" : "bg-blue-500"
      )} />

      {/* Content Card */}
      <div className={cn("w-full pl-8 md:pl-0", !isEven && "md:pr-0")}>
        <div className="relative bg-white dark:bg-[#111] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
          {/* Header */}
          <div className={cn("flex flex-wrap items-center gap-3 mb-4", !isEven && "md:flex-row-reverse")}>
             <TypeTag type={post.type} />
             <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                <Calendar size={12} /> {post.date}
             </span>
             {post.place && (
                 <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                     <MapPin size={12} /> {post.place}
                 </span>
             )}
          </div>

          {/* Title & Text */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{post.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-7 mb-5 text-sm md:text-base">
            {post.text}
          </p>

          {/* Images */}
          <ImageGrid photos={post.photos} />
        </div>
      </div>
    </motion.div>
  );
};

export default function LifeTimeline() {
  return (
    <section className="w-full py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-orange-50/40 to-rose-50/30 dark:from-transparent dark:via-black/80 dark:to-[#0a0a0a]">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 z-0">
           <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-orange-200/20 rounded-full blur-[80px]" />
           <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-blue-200/20 rounded-full blur-[100px]" />
       </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Section Header */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-20"
        >
            <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-400 mb-4 shadow-sm">
               <Activity size={28} />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
               Life & Motion
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
               记录运动与旅途中的每个瞬间。
               <br/>
               <span className="text-sm opacity-80">Capture every moment in sports and travel.</span>
            </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
           {/* Center Line (Desktop) - Made solid and stronger color */}
           <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 transform -translate-x-1/2" />

           {/* Left Line (Mobile) - Continuous line */}
           <div className="md:hidden absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

           <div className="flex flex-col">
              {MOCK_LIFE_DATA.map((post, index) => (
                 <TimelineItem key={post.id} post={post} index={index} />
              ))}
           </div>
           
           {/* End Node */}
           <div className="flex justify-center mt-8">
               <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800">
                   To be continued...
               </div>
           </div>
        </div>

        <ChinaTravelMap />
      </div>
    </section>
  );
}
