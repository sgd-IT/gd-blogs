/**
 * 文件上传服务
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";

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
    const res = await fetch(`${API_BASE_URL}/file/upload/image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data: UploadResponse = await res.json();

    if (data.code === 0 && data.data) {
      // 返回完整 URL
      return `${API_BASE_URL}${data.data}`;
    }

    throw new Error(data.message || "上传失败");
  } catch (error) {
    console.error("上传失败:", error);
    throw error;
  }
}

