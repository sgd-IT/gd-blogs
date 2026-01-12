"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateMyUser, getLoginUser } from "@/services/user";
import { uploadImage } from "@/services/upload";
import { User, Loader2 } from "lucide-react";

interface LoginUserVO {
  id: number;
  userName: string;
  userAvatar?: string;
  userProfile?: string;
  userRole: string;
}

export default function UserCenterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [form, setForm] = useState<{
    userName: string;
    userAvatar: string;
    userProfile: string;
  }>({
    userName: "",
    userAvatar: "",
    userProfile: "",
  });

  // 初始化加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setInitializing(true);
      const res = await getLoginUser();
      if (res.code === 0 && res.data) {
        setForm({
          userName: res.data.userName || "",
          userAvatar: res.data.userAvatar || "",
          userProfile: res.data.userProfile || "",
        });
      } else {
        router.push("/user/login");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInitializing(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, userAvatar: url }));
    } catch (error) {
      alert("上传失败");
    }
  };

  // 提交修改
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await updateMyUser(form);
      if (res.code === 0) {
        alert("更新成功");
        window.location.reload(); // 刷新以更新全局状态
      } else {
        alert("更新失败: " + res.message);
      }
    } catch (error) {
      alert("网络错误");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">个人中心</h1>
      
      <div className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-lg border dark:border-zinc-800 shadow-sm">
        {/* 头像 */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer w-24 h-24">
            {form.userAvatar ? (
              <img src={form.userAvatar} className="w-full h-full rounded-full object-cover border-2 border-purple-100 dark:border-purple-900/30" />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-700">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={handleAvatarUpload}
              accept="image/*"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium backdrop-blur-sm">
              更换头像
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">点击头像进行修改</p>
        </div>

        {/* 表单 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              昵称
            </label>
            <input
              type="text"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:placeholder:text-gray-400"
              placeholder="请输入昵称"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              简介
            </label>
            <textarea
              value={form.userProfile}
              onChange={(e) => setForm({ ...form, userProfile: e.target.value })}
              className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:placeholder:text-gray-400 resize-none"
              placeholder="介绍一下自己吧..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              "保存修改"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
