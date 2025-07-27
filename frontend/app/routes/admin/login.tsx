import React from "react";
import type { Route } from "./+types/login";
import { commitSession, getSession } from "~/libs/session";
import { data, Form, redirect } from "react-router";
import { API_BASE_URL } from "~/libs/api";

export async function loader({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("accessToken")) {
    return redirect("/admin");
  }
  return data(
    { error: session.get("error") },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const result = await res.json();
  if (!res.ok || !result.data?.access_token) {
    session.flash("error", result.message || "Invalid username/password");
    return redirect("/admin/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("accessToken", result.data.access_token);

  return redirect("/admin", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function login({ loaderData }: Route.ComponentProps) {
  const { error } = loaderData;

  return (
    <div className="border rounded-2xl w-2/4 flex m-auto my-10 flex-col gap-5 p-5">
      {error ? <div className="error">{error}</div> : null}
      <Form method="POST" className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Login</h1>
        <label>
          Username:{" "}
          <input
            type="text"
            name="username"
            className="border rounded p-2 w-full"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            className="border rounded p-2 w-full"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Sign in
        </button>
      </Form>
    </div>
  );
}
