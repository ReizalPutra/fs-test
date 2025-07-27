import { redirect, useFetcher } from "react-router";
import type { Route } from "./+types/logout";
import { getSession, destroySession } from "~/libs/session";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  // hapus session
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
