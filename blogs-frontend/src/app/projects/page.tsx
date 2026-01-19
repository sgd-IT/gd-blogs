"use client";

import React from "react";
import { ExternalLink, Github } from "lucide-react";

const PROJECTS = [
  {
    name: "gd-blogs",
    desc: "个人全栈博客系统，支持文章发布、分类管理、评论互动等功能",
    tags: ["Next.js", "Spring Boot", "MySQL", "TypeScript"],
    repoUrl: "https://github.com/yourname/gd-blogs",
    homeUrl: "",
  },
  {
    name: "PaddleOCR-VL",
    desc: "开源视觉语言 OCR 工具，多模态识别提升文档处理效率",
    tags: ["Python", "OCR", "VLM"],
    repoUrl: "https://github.com/PaddlePaddle/PaddleOCR",
    homeUrl: "https://github.com/PaddlePaddle/PaddleOCR",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            我的项目
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            这里是我的一些开源项目和个人作品
          </p>
        </div>

        {/* 项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-700"
            >
              {/* 装饰性渐变背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative p-8">
                {/* 项目名称 */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h2>

                {/* 项目描述 */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {project.desc}
                </p>

                {/* 技术标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 链接按钮 */}
                <div className="flex gap-4">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Github size={18} />
                      <span>源码</span>
                    </a>
                  )}
                  {project.homeUrl && (
                    <a
                      href={project.homeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <ExternalLink size={18} />
                      <span>访问</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态提示（如果需要） */}
        {PROJECTS.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              暂无项目，敬请期待...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
