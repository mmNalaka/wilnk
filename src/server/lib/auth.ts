import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/server/db";
import * as schema from "@/server/db/schema/auth.schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
    // disableSignUp: process.env.NEXT_PUBLIC_DISABLE_SIGNUP === "true",
    // Configure password reset flow; integrate your email provider here.
    sendResetPassword: async ({
      user,
      url,
      token,
    }: {
      user: { email: string };
      url: string;
      token: string;
    }) => {
      // TODO: Replace with actual email sending (e.g., Resend, SendGrid, Postmark).
      // For now, log the URL so it's visible in logs during development.
      console.log(
        "[BetterAuth] Password reset link for",
        user.email,
        url,
        "token:",
        token,
      );
    },
    onPasswordReset: async ({ user }: { user: { email: string } }) => {
      console.log(`[BetterAuth] Password reset completed for ${user.email}`);
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "",
  baseURL: process.env.BETTER_AUTH_URL || "",
});
