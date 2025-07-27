import { createCookieSessionStorage } from "react-router";

type SessionData = {
  accessToken: string;
};

type FlashData = {
  error?: string,
  success?: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, FlashData>({
    cookie: {
      name: "session-admin",
      httpOnly: true,
      path: "/",
      maxAge: 15 * 60,
      sameSite: "lax",
      secure: false,
      secrets: ["secret-key"],
    },
  });

export { getSession, commitSession, destroySession };
