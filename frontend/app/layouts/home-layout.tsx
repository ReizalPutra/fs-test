import { Link, Outlet } from "react-router";

export default function HomeLayout() {
  return (
    <main>
      <nav className="m-5 rounded-2xl border border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">MyBlog</div>

        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 focus:outline-none">
            Login
         
          </button>

          <div className="absolute right-0 mt-2 w-40 border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            <Link
              to="/login"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </main>
  );
}
