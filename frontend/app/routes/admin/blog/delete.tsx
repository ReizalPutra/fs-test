
import { getSession } from "~/libs/session";
import type { Route } from "./+types/delete";

export async function action({ request, params }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("accessToken");

  const blogId = params.id;

  const res = await fetch(`http://localhost:3000/api/blog/${blogId}`, {
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
