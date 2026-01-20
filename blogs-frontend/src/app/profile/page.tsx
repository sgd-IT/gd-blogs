"use client";

import React from "react";
import OrbitingIntroduction from "@/components/desktop/OrbitingIntroduction";
import SkillPanel from "@/components/business/SkillPanel";
import LifeTimeline from "@/components/business/LifeTimeline";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black overflow-x-hidden">
      {/* 1. Hero / Intro Section - 个人形象展示 */}
      <section className="relative w-full">
        <OrbitingIntroduction />
      </section>

      {/* 2. Skills Section - 技能矩阵 */}
      <section className="py-20 bg-gray-50/50 dark:bg-zinc-900/30">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Tech Stack</h2>
             <p className="text-gray-500 dark:text-gray-400">
               My technical skills and proficiency levels.
             </p>
           </div>
           <SkillPanel />
        </div>
      </section>

      {/* 3. Life Timeline Section - 生活动态 */}
      <LifeTimeline />
    </main>
  );
}
