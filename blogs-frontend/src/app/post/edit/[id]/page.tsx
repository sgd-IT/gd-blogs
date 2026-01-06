"use client";

import { useParams } from "next/navigation";
import { TiptapEditor } from "@/components/editor";

export default function EditPage() {
  const params = useParams();
  const postId = params.id as string;

  return (
    <main className="min-h-screen">
      <TiptapEditor mode="edit" postId={postId} />
    </main>
  );
}
