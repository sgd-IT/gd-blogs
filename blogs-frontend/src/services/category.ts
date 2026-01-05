/**
 * 分类服务
 */

import type { Category, ApiResp } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

/**
 * 获取所有分类列表
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/category/list`, {
      credentials: "include",
    });

    const data: ApiResp<Category[]> = await res.json();

    if (data.code === 0 && data.data) {
      return data.data;
    }

    throw new Error(data.message || "获取分类失败");
  } catch (error) {
    console.error("获取分类失败:", error);
    return [];
  }
}

