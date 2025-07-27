import { useState } from "react";
import { Link, Outlet, redirect } from "react-router";
import { getSession } from "~/libs/session";
import type { Route } from "./+types/admin-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const token = session.get("accessToken");
  if (!token) {
    throw redirect("/login");
  }
}
export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex h-screen">
      <aside
        className={`border rounded-2xl mt-5 text-white h-screen transition-all duration-300 ${
          isOpen ? "w-64" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <span className="text-lg px-auto mx-auto font-bold">
            {isOpen ? "Sidebar" : "≡"}
          </span>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? "<" : ">"}
          </button>
        </div>

        {isOpen && (
          <ul className="space-y-2 mt-4 px-4">
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Link>
            </li>
            <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
              <Link
                to="/admin/create-blog"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Post Blog
              </Link>
            </li>
          </ul>
        )}
      </aside>
      <div className="flex-1 flex flex-col">
        <nav className="m-5 rounded-2xl border border-gray-200 px-4 py-3 flex justify-between items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            <div className="text-xl font-bold text-blue-600">MyBlog</div>
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 focus:outline-none">
              Logout
            </button>

            <div className="absolute right-0 mt-2 w-40 border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
              <Link
                to="/logout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Link>
            </div>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
