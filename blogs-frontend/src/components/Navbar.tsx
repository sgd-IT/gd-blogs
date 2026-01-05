"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

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

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginUser, setLoginUser] = useState<LoginUserVO | null>(null);

  useEffect(() => {
    const fetchLoginUser = async () => {
      try {
        // 走 Next 同源代理，避免跨域 + credentials 导致浏览器直接 Failed to fetch
        const res = await fetch("/api/user/get/login", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.code === 0 && data.data) {
          setLoginUser(data.data);
        }
      } catch (error) {
        // 后端未启动/网络不可达/代理未配置时会进这里；不要影响页面体验
        // 如需排查可临时改为 console.warn
        console.debug("获取用户信息失败（可忽略）", error);
      }
    };
    fetchLoginUser();
  }, []);

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


