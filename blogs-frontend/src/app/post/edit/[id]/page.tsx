"use client";

import { useParams } from "next/navigation";
import { TiptapEditor } from "@/components/editor";

export default function EditPage() {
  const params = useParams();
  const postId = params.id as string;

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-16 pb-16">
      <TiptapEditor mode="edit" postId={postId} />
    </main>
  );
}
