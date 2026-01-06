"use client";

import { useEffect, useMemo, useState } from "react";

type TocItem = {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
};

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=\[\]{}\\|;:'",.<>/?]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildToc(markdown: string): TocItem[] {
  const lines = (markdown || "").split(/\r?\n/);
  const items: TocItem[] = [];
  const used = new Map<string, number>();

  let inCodeFence = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const m = /^(#{1,6})\s+(.+)$/.exec(line);
    if (!m) continue;
    const level = m[1].length as 1 | 2 | 3 | 4 | 5 | 6;
    const text = m[2].trim().replace(/\s+#*\s*$/, ""); // 去掉尾部 #（ATX 标题写法）
    if (!text) continue;

    const base = slugify(text) || "section";
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;

    items.push({ id, text, level });
  }

  return items;
}

export default function MarkdownToc({ markdown }: { markdown: string }) {
  const toc = useMemo(() => buildToc(markdown), [markdown]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!toc.length) return;

    const els = toc
      .map((t) => document.getElementById(t.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.1, 0.2, 0.3] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  if (!toc.length) return null;

  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-black">
        <div className="text-sm font-bold text-gray-900 dark:text-white">目录</div>
        <div className="mt-3 max-h-[70vh] overflow-auto pr-1">
          <ul className="space-y-1 text-sm">
            {toc.map((item) => {
              const indent =
                item.level === 1
                  ? "pl-0"
                  : item.level === 2
                  ? "pl-3"
                  : item.level === 3
                  ? "pl-6"
                  : item.level === 4
                  ? "pl-8"
                  : item.level === 5
                  ? "pl-10"
                  : "pl-12";
              const isActive = activeId === item.id;
              return (
                <li key={item.id} className={indent}>
                  <button
                    type="button"
                    className={[
                      "w-full text-left rounded px-2 py-1 transition-colors",
                      isActive
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900",
                    ].join(" ")}
                    onClick={() => {
                      const el = document.getElementById(item.id);
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    {item.text}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}


