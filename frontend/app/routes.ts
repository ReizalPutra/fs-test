import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/home-layout.tsx", [
    ...prefix("", [
      index("routes/blogList.tsx"),
      route(":slug", "routes/blog.tsx"),
    ]),
  ]),
  layout("layouts/admin-layout.tsx", [
    ...prefix("admin", [
      index("routes/admin/index.tsx"),
      
      route("create-blog", "routes/admin/blog-create.tsx"),
      route("blog/:id/delete", "routes/admin/blog/delete.tsx"),
      route("blog/:slug/edit", "routes/admin/blog/edit.tsx"),
    ]),
  ]),
  route("/logout", "routes/admin/logout.tsx"),
  route("/login", "routes/admin/login.tsx"),
  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "routes/debug-null.tsx"
  ),
] satisfies RouteConfig;
