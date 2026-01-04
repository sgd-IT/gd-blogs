"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, FileText, PenLine, Plus, User } from "lucide-react";

interface LoginUserVO {
  id: number;
  userName: string;
  userAvatar?: string;
  userRole: string;
}

const navItems = [
  { name: "首页", path: "/" },
  { name: "博客", path: "/blog" },
  { name: "项目", path: "/projects" },
  { name: "关于", path: "/about" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginUser, setLoginUser] = useState<LoginUserVO | null>(null);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  useEffect(() => {
    const fetchLoginUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/user/get/login`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.code === 0 && data.data) {
          setLoginUser(data.data);
        }
      } catch (error) {
        console.error("获取用户信息失败", error);
      }
    };
    fetchLoginUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.code === 0) {
        // Navbar 位于 layout，不会自动重新挂载；这里直接刷新以更新登录态
        window.location.href = "/";
      }
    } catch (error) {
      console.error("退出登录失败", error);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Gdblogs<span className="text-purple-600">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-8 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  isActive ? "text-purple-600" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* User Status Section (Desktop) */}
          <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            {loginUser ? (
              <div className="flex items-center gap-3">
                {loginUser.userAvatar ? (
                  <img
                    src={loginUser.userAvatar}
                    alt={loginUser.userName}
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {loginUser.userName}
                </span>

                {/* Create Button + Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsCreateMenuOpen(true)}
                  onMouseLeave={() => setIsCreateMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setIsCreateMenuOpen((v) => !v)}
                    className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    创作
                    <ChevronDown className="h-4 w-4 opacity-90" />
                  </button>

                  {isCreateMenuOpen ? (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-black">
                      <Link
                        href="/post/create"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900"
                      >
                        <PenLine className="h-4 w-4" />
                        写文章
                      </Link>
                      <Link
                        href="/post/my"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900"
                      >
                        <FileText className="h-4 w-4" />
                        我的文章
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900"
                      >
                        退出登录
                      </button>
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-purple-600 dark:text-gray-400"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                href="/user/login"
                className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300"
              >
                登录
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open menu</span>
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-b border-gray-100 bg-white px-4 py-4 md:hidden dark:border-gray-800 dark:bg-black">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium ${
                    isActive ? "text-purple-600" : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {/* User Status Section (Mobile) */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              {loginUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                  {loginUser.userAvatar ? (
                    <img src={loginUser.userAvatar} alt={loginUser.userName} className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{loginUser.userName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/post/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                    >
                      <Plus className="h-4 w-4" />
                      创作
                    </Link>
                    <Link
                      href="/post/my"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-black dark:text-gray-200 dark:hover:bg-gray-900"
                    >
                      我的文章
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      void handleLogout();
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-black dark:text-gray-200 dark:hover:bg-gray-900"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <Link
                  href="/user/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
