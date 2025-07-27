import { Form, redirect, useActionData } from "react-router";

import { commitSession, getSession } from "~/libs/session";
import type { Route } from "./+types/edit";
import type { i } from "node_modules/@react-router/dev/dist/routes-DHIOx0R9";
import { useState } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const res = await fetch(`http://localhost:3000/api/blog/${params.slug}`);
  const data = await res.json();
  return data;
}

// Fallback saat loading
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("accessToken");
  let form = await request.formData();
  const title = form.get("title");
  const content = form.get("content");
  const id = form.get("id");

  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  const result = await res.json();
  if (!res.ok) {
    session.flash("error", result.message || "Failed to create blog post");
    return {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    };
  }
  session.flash("success", "Blog berhasil diposting!");
  return redirect("/admin", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
export default function BlogCreatePage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return <div>Data tidak ditemukan</div>;
  }
  const { id, title, slug, content } = loaderData.data;
  const [contents, setContent] = useState(content);
  const [titles, setTitle] = useState(title);

  const actionData = useActionData() as { error?: string; success?: string };

  return (
    <div className="w-3/4 flex m-auto my-10 flex-col gap-5">
      <Form method="POST" className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Post new Blog</h1>
        <label>
          Judul:
          <input
            type="text"
            name="id"
            className="border rounded p-2 w-full"
            required
            value={id}
            readOnly
            hidden
          />
        </label>
        {actionData?.error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
            {actionData.error}
          </div>
        )}

        {actionData?.success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded">
            {actionData.success}
          </div>
        )}

        <label>
          Judul:
          <input
            type="text"
            name="title"
            className="border rounded p-2 w-full"
            required
            value={titles}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Konten:
          <textarea
            name="content"
            className="border rounded p-2 w-full"
            rows={6}
            required
            value={contents}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          type="submit"
        >
          Post
        </button>
      </Form>
    </div>
  );
}
