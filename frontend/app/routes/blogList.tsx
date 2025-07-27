import React from "react";
import type { Route } from "./+types/blogList";
import { Link } from "react-router";
import { format } from "date-fns";
import { API_BASE_URL } from "~/libs/api";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`${API_BASE_URL}/blog`);
  const data = await res.json();
  return data;
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

export default function blogList({ loaderData }: Route.ComponentProps) {
  const blogs = loaderData.data;

  return (
    <div className="w-3/4 m-auto content-center p-5">
      <h1>Daftar Blog</h1>
      <div className="grid grid-cols-3 gap-5 p-5">
        {blogs.map((blog: any) => (
          <Link to={`/${blog.slug}`} key={blog.id}>
            <div className="max-w-sm shadow-md rounded-lg overflow-hidden border border-gray-200 hover:bg-gray-600 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-700">{blog.content}</p>
              </div>
              <p className="font-mono px-2">
                {format(new Date(blog.publishedAt), "dd/MM/yyyy")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
