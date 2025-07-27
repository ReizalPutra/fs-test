import { format } from 'date-fns'
import type { Route } from "./+types/index";
import { getSession } from "~/libs/session";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("accessToken");
  if (!token) {
    throw redirect("/login");
  }

  const res = await fetch(`http://localhost:3000/api/blog`);

  if (!res.ok) {
    throw new Response("Failed to fetch user", { status: res.status });
  }

  const data = await res.json();
  return data;
}
export function HydrateFallback() {
  return <div>Loading...</div>;
}
export default function indexPage({ loaderData }: Route.ComponentProps) {
  const blogs = loaderData.data;
  return (
    <div className="overflow-x-auto p-10 ">
      <table className="w-3/4 border border-gray-300 divide-y divide-gray-300 mx-auto ">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-white">
              No
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-white">
              Title
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-white">
              Slug
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-white">
              published at
            </th>
            <th className="py-2 text-left text-sm font-semibold text-white">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {blogs.map((blog: any, i: number) => (
            <tr key={blog.id} className="hover:bg-gray-500 hover:text-black">
              <td className="px-4 py-2 text-sm text-gray-300">{i + 1}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{blog.title}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{blog.slug}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{format(new Date(blog.publishedAt), 'dd/MM/yyyy HH:mm:ss')}</td>
              <td className="py-2 text-sm">
                <div className="flex gap-2">
                  <a
                    href={`/admin/blog/${blog.slug}/edit`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </a>
                  <form
                    method="POST"
                    action={`/admin/blog/${blog.id}/delete`}
                    onSubmit={(e) => {
                      if (!confirm("Yakin ingin menghapus blog ini?"))
                        e.preventDefault();
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
