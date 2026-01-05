/**
 * Tiptap 自定义扩展
 */

import { Heading } from "@tiptap/extension-heading";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";

/**
 * 自定义 Heading 扩展，支持 ID 属性
 * 用于目录锚点跳转
 */
export const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            id: attributes.id,
            "data-toc-id": attributes.id,
          };
        },
      },
    };
  },
});

/**
 * 表格扩展（配置好的）
 */
export const CustomTable = Table.configure({
  resizable: true,
  HTMLAttributes: {
    class: "border-collapse table-auto w-full my-4",
  },
});

export const CustomTableRow = TableRow;

export const CustomTableCell = TableCell.configure({
  HTMLAttributes: {
    class: "border border-gray-300 px-3 py-2 dark:border-gray-700",
  },
});

export const CustomTableHeader = TableHeader.configure({
  HTMLAttributes: {
    class: "border border-gray-300 px-3 py-2 bg-gray-100 font-bold dark:border-gray-700 dark:bg-gray-800",
  },
});

/**
 * 颜色扩展
 */
export const CustomTextStyle = TextStyle;

export const CustomColor = Color;

export const CustomHighlight = Highlight.configure({
  multicolor: true,
});

