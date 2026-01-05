/**
 * 分类相关类型定义
 */

export interface Category {
  id: number;
  name: string;
  description?: string;
  sortOrder?: number;
  createTime?: string;
  updateTime?: string;
}

