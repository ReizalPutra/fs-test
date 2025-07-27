import React from "react";
import type { Route } from "./+types/blog";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`http://localhost:3000/api/blog/${params.slug}`);
  const data = await res.json();
  return data;
}

// Fallback saat loading
export function HydrateFallback() {
  return <div>Loading...</div>;
}

// Komponen utama
export default function BlogPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return <div>Data tidak ditemukan</div>;
  }

  const { title, slug, content, publishedAt } = loaderData.data;

  return (
    <div className="px-4 py-8">
      <button
        onClick={() => window.history.back()}
        className="flex  px-4 py-8items-center text-sm text-blue-600 hover:underline mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali
      </button>

      <div className="max-w-3xl h-dvh px-4 py-8 mx-auto bg-gray-600 my-2 drop-shadow-lg backdrop-blur-xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>

        <div className="text-sm text-gray-800 mb-6">
          <span>{slug}</span>
          {publishedAt && (
            <span className="ml-2">
              • {new Date(publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Konten */}
        <div className="prose prose-lg max-w-none text-gray-800">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}
