import { API_PREFIX, RESOURCE_BASE_URL } from "@/lib/api-config";

/**
 * 文件上传服务
 */

export interface UploadResponse {
  code: number;
  data?: string; // 图片 URL
  message?: string;
}

/**
 * 上传图片
 * @param file 图片文件
 * @returns 图片完整 URL
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // 使用 /api 前缀，走 Next.js 代理
    const res = await fetch(`${API_PREFIX}/file/upload/image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data: UploadResponse = await res.json();

    if (data.code === 0 && data.data) {
      // 返回完整 URL，用于前端展示
      // data.data 通常是相对路径如 /uploads/images/xxx.jpg
      const normalizedPath = data.data.startsWith("/uploads/")
        ? data.data.replace(/^\/uploads/, "")
        : data.data;
      return `${RESOURCE_BASE_URL}${normalizedPath}`;
    }

    throw new Error(data.message || "上传失败");
  } catch (error) {
    console.error("上传失败:", error);
    throw error;
  }
}
