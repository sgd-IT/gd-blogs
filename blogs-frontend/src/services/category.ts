/**
 * 分类服务
 */

import type { Category, ApiResp } from "@/types";
import { API_PREFIX } from "@/lib/api-config";

/**
 * 获取所有分类列表
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_PREFIX}/category/list`, {
      credentials: "include",
    });

    // 检查 HTTP 响应状态
    if (!res.ok) {
      console.error(`获取分类失败: HTTP ${res.status} ${res.statusText}`);
      return [];
    }

    const data: ApiResp<Category[]> = await res.json();

    // 检查业务响应码
    if (data.code === 0) {
      // 如果 data 为 null 或 undefined，返回空数组
      return data.data || [];
    }

    // 业务错误，记录但不抛出异常
    console.error("获取分类失败:", data.message || "未知错误");
    return [];
  } catch (error) {
    // 网络错误或其他异常，记录但不抛出
    console.error("获取分类失败:", error);
    return [];
  }
}

