import { Form, redirect, useActionData } from "react-router";
import type { Route } from "./+types/create";
import { commitSession, getSession } from "~/libs/session";
import { API_BASE_URL } from "~/libs/api";

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("accessToken");
  let form = await request.formData();
  const title = form.get("title");
  const content = form.get("content");
  const res = await fetch(`${API_BASE_URL}/blog`, {
    method: "POST",
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
export default function BlogCreatePage() {
  const actionData = useActionData() as { error?: string; success?: string };

  return (
    <div className="w-3/4 flex m-auto my-10 flex-col gap-5">
      <Form method="POST" className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Post new Blog</h1>

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
          />
        </label>

        <label>
          Konten:
          <textarea
            name="content"
            className="border rounded p-2 w-full"
            rows={6}
            required
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
