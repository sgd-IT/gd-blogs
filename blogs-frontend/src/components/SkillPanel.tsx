"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  PanelsTopLeft, 
  Server, 
  Database, 
  Settings, 
  CodeXml, 
  Terminal 
} from "lucide-react";

interface SkillItem {
  name: string;
  level: number; // 0-10
  max: number;
  color: string;
  icon: React.ElementType;
  detail: string;
}

const skills: SkillItem[] = [
  { 
    name: "Frontend", 
    level: 9, 
    max: 10, 
    color: "bg-blue-500", 
    icon: PanelsTopLeft, 
    detail: "React, Next.js, Tailwind" 
  },
  { 
    name: "Backend", 
    level: 8, 
    max: 10, 
    color: "bg-green-500", 
    icon: Server, 
    detail: "Node.js, Python, Go" 
  },
  { 
    name: "Database", 
    level: 7, 
    max: 10, 
    color: "bg-yellow-500", 
    icon: Database, 
    detail: "PostgreSQL, MongoDB, Redis" 
  },
  { 
    name: "DevOps", 
    level: 6, 
    max: 10, 
    color: "bg-purple-500", 
    icon: Settings, 
    detail: "Docker, AWS, CI/CD" 
  },
  { 
    name: "Languages", 
    level: 9, 
    max: 10, 
    color: "bg-red-500", 
    icon: CodeXml, 
    detail: "TypeScript, JavaScript, Python" 
  },
  { 
    name: "Terminal", 
    level: 8, 
    max: 10, 
    color: "bg-gray-500", 
    icon: Terminal, 
    detail: "Bash, Vim, Git" 
  },
];

export default function SkillPanel() {
  return (
    <div className="h-full w-full rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col">
      {/* 头部：标题与等级 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skill Matrix</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">Character Stats</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-500">
           LVL. 25
        </div>
      </div>

      {/* 技能列表 */}
      <div className="flex-1 space-y-6">
        {skills.map((skill, index) => (
          <div key={skill.name} className="group">
            {/* 技能名称与详情 */}
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                 <skill.icon 
                   size={16} 
                   className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" 
                 />
                 <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                   {skill.name}
                 </span>
               </div>
               <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                 {skill.detail}
               </span>
            </div>
            
            {/* 进度条槽 */}
            <div className="flex gap-1 h-3">
              {Array.from({ length: skill.max }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.2, scale: 0.8 }}
                  whileInView={{ 
                    opacity: i < skill.level ? 1 : 0.2,
                    scale: i < skill.level ? 1 : 0.8,
                    backgroundColor: i < skill.level ? '' : 'rgb(229 231 235)' // fallback gray
                  }}
                  transition={{ 
                    delay: i * 0.05 + index * 0.1, // 延迟错落效果
                    duration: 0.2 
                  }}
                  className={`flex-1 rounded-sm ${i < skill.level ? skill.color : 'bg-gray-200 dark:bg-gray-800'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部状态 */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-center font-mono">
         AVAILABLE POINTS: 0
      </div>
    </div>
  );
}
