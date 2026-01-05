"use client";

import { TiptapEditor } from "@/components/editor";

export default function PostCreatePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-16 pb-16">
      <TiptapEditor mode="create" />
    </main>
  );
}
