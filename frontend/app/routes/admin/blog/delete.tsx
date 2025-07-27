import { getSession } from "~/libs/session";
import type { Route } from "./+types/delete";
import { API_BASE_URL } from "~/libs/api";

export async function action({ request, params }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("accessToken");

  const blogId = params.id;

  const res = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return new Response("Gagal menghapus blog", { status: res.status });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin",
    },
  });
}
