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
  { name: "个人中心", path: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginUser, setLoginUser] = useState<LoginUserVO | null>(null);

  // 编辑器页面隐藏全局导航（注意：不能在 hooks 之前提前 return，否则会导致 hooks 数量不一致）
  const hideOnEditor = pathname.startsWith("/post/create") || pathname.startsWith("/post/edit");

  useEffect(() => {
    if (hideOnEditor) return;
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
  }, [hideOnEditor]);

  if (hideOnEditor) return null;

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
              <div 
                className="relative group"
              >
                <button className="flex items-center gap-3 py-2 outline-none">
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
                </button>

                {/* 下拉菜单 */}
                <div className="absolute right-0 top-full mt-0 w-32 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg shadow-lg overflow-hidden py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <Link 
                    href="/user/center" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    设置
                  </Link>
                  <Link
                    href="/user/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    通知中心
                  </Link>
                  <button
                    onClick={async () => {
                       await fetch("/api/user/logout", { method: "POST" });
                       setLoginUser(null);
                       window.location.href = "/";
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    退出登录
                  </button>
                </div>
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
            {loginUser ? (
              <Link
                href="/user/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-300"
              >
                通知中心
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}


