"use client";

import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";

// 模拟参考图的数据分布 (平滑曲线)
const data = [
  { age: 0,  "Social": 100, "Study": 0,  "Game": 0,  "Coding": 0,  "Music": 0 },
  { age: 2,  "Social": 80,  "Study": 20, "Game": 0,  "Coding": 0,  "Music": 0 },
  { age: 5,  "Social": 50,  "Study": 50, "Game": 0,  "Coding": 0,  "Music": 0 },
  { age: 8,  "Social": 35,  "Study": 45, "Game": 20, "Coding": 0,  "Music": 0 },
  { age: 12, "Social": 30,  "Study": 35, "Game": 30, "Coding": 5,  "Music": 0 },
  { age: 15, "Social": 25,  "Study": 25, "Game": 35, "Coding": 15, "Music": 0 },
  { age: 18, "Social": 20,  "Study": 20, "Game": 30, "Coding": 25, "Music": 5 },
  { age: 22, "Social": 20,  "Study": 15, "Game": 20, "Coding": 35, "Music": 10 },
  { age: 25, "Social": 20,  "Study": 15, "Game": 15, "Coding": 40, "Music": 10 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-black/90 p-3 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl backdrop-blur-sm text-xs font-sans z-50">
        <p className="font-bold text-gray-700 dark:text-gray-200 mb-2">{label} 岁</p>
        {/* 反转顺序以匹配堆叠视觉 */}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-500 dark:text-gray-400 w-12">
              {entry.name}
            </span>
            <span className="font-mono font-medium text-gray-900 dark:text-gray-100">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AgeActivityChart() {
  return (
    <div className="w-full h-full flex flex-col font-sans relative group">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="text-sm font-bold text-gray-700 dark:text-gray-200">时间分布</div>
        {/* 简单的图例 */}
        <div className="flex gap-3 text-[10px]">
           <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#86efac]"></span>
              <span className="text-gray-500 dark:text-gray-400">Social</span>
           </div>
           <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5eead4]"></span>
              <span className="text-gray-500 dark:text-gray-400">Coding</span>
           </div>
        </div>
      </div>
      
      {/* 图表主体 */}
      <div className="flex-1 w-full min-h-[180px] -ml-2 select-none relative">
        <ResponsiveContainer width="104%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            stackOffset="expand"
          >
            <defs>
              <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#86efac" stopOpacity={0.9}/> {/* green-300 */}
                <stop offset="95%" stopColor="#bbf7d0" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="colorCoding" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.9}/> {/* teal-400 */}
                <stop offset="95%" stopColor="#5eead4" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="colorGame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.9}/> {/* sky-300 */}
                <stop offset="95%" stopColor="#bae6fd" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="colorMusic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.9}/> {/* blue-300 */}
                <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a5b4fc" stopOpacity={0.9}/> {/* indigo-300 */}
                <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="age" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              interval="preserveStartEnd"
              dy={5}
            />
            
            <YAxis hide domain={[0, 100]} />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Bottom Layer: Study */}
            <Area 
              type="monotone" 
              dataKey="Study" 
              stackId="1" 
              stroke="none" 
              fill="url(#colorStudy)" 
            />

             {/* Music */}
             <Area 
              type="monotone" 
              dataKey="Music" 
              stackId="1" 
              stroke="none" 
              fill="url(#colorMusic)" 
            />

            {/* Game */}
            <Area 
              type="monotone" 
              dataKey="Game" 
              stackId="1" 
              stroke="none" 
              fill="url(#colorGame)" 
            />

            {/* Coding */}
            <Area 
              type="monotone" 
              dataKey="Coding" 
              stackId="1" 
              stroke="none" 
              fill="url(#colorCoding)" 
            />

            {/* Top Layer: Social */}
            <Area 
              type="monotone" 
              dataKey="Social" 
              stackId="1" 
              stroke="none" 
              fill="url(#colorSocial)" 
            />

          </AreaChart>
        </ResponsiveContainer>
        
        {/* 背景文字标签 */}
        <div className="absolute top-[20%] left-[15%] text-emerald-600/40 dark:text-emerald-400/30 text-sm font-bold pointer-events-none hidden sm:block">
          Social or Family
        </div>
        <div className="absolute top-[42%] right-[15%] text-teal-600/40 dark:text-teal-400/30 text-sm font-bold pointer-events-none hidden sm:block">
          Coding
        </div>
        <div className="absolute top-[52%] left-[40%] text-sky-600/40 dark:text-sky-400/30 text-sm font-bold pointer-events-none hidden sm:block">
          Game
        </div>
         <div className="absolute bottom-[20%] left-[20%] text-indigo-600/40 dark:text-indigo-400/30 text-sm font-bold pointer-events-none hidden sm:block">
          Study
        </div>
        <div className="absolute bottom-[15%] right-[5%] text-blue-600/40 dark:text-blue-400/30 text-xs font-bold pointer-events-none hidden sm:block">
          Music
        </div>
      </div>
    </div>
  );
}
