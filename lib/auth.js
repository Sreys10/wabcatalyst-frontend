import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "./users";

// Validate Google OAuth credentials
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

if (!googleClientId || !googleClientSecret) {
  console.warn(
    "⚠️ Google OAuth credentials are missing! Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file"
  );
}

import { cookies } from "next/headers";

export const authOptions = {
  providers: [
    // Only add Google provider if credentials are present
    ...(googleClientId && googleClientSecret
      ? [
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        // Hardcoded Admin Check
        if (credentials.email === "admin@gmail.com" && credentials.password === "admin@123") {
          return {
            id: "admin-id",
            email: "admin@gmail.com",
            name: "Admin",
            role: "admin",
            onboardingCompleted: true
          };
        }

        const user = await getUserByEmail(credentials.email);

        if (!user) {
          throw new Error("No account found with this email. Please sign up first.");
        }

        // Check if user is OAuth-only (no password)
        if (!user.password) {
          throw new Error("This account was created with Google. Please sign in with Google.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
          role: "user",
          onboardingCompleted: user.onboardingCompleted,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // If signing in with Google
      if (account?.provider === "google" && user.email) {
        try {
          const cookieStore = cookies();
          const intent = cookieStore.get("auth_intent")?.value;
          let existingUser = await getUserByEmail(user.email);

          // SCENARIO 1: Intent is LOGIN
          if (intent === "login") {
            if (!existingUser) {
              // User does not exist -> Redirect to Signup
              return "/signup?error=no_account";
            }
            // User exists -> Allow login
            return true;
          }

          // SCENARIO 2: Intent is SIGNUP
          if (intent === "signup") {
            if (existingUser) {
              // User already exists -> Redirect to Login
              return "/login?error=account_exists";
            }
            // User does not exist -> Create account
            await createUser(
              user.email,
              "", // No password for OAuth users
              user.name || user.email?.split("@")[0] || "User"
            );
            return true;
          }

          // Fallback if no intent (e.g. direct access)
          // Default behavior: Allow if exists, create if not (standard flow)
          // Or we can enforce one. Let's stick to standard behavior if no cookie.
          if (!existingUser) {
            await createUser(
              user.email,
              "",
              user.name || user.email?.split("@")[0] || "User"
            );
          }
          return true;

        } catch (error) {
          console.error("Error in Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl, token }) {
      // Check for Admin Role in token (not directly available here, so we rely on client-side or specific logic)
      // However, redirect callback doesn't have access to the user object directly in all cases easily.
      // A better approach for Admin redirect is to handle it in the Login page or Middleware.
      // But we can try to infer or just let the default happen and handle protection on the page.

      // Actually, for Credentials login, the `authorize` returns the user.
      // But `redirect` runs after `signIn`.

      // Let's stick to standard redirects here, but we'll add a check in the Login Page or Middleware.
      // OR, we can check if the user is admin in the `jwt` callback and handle redirects there? No, `jwt` is for token creation.

      // Simplified: We will handle the redirect logic in the Login Page (client-side) based on the session role,
      // OR we can check the URL.

      const cookieStore = cookies();
      const intent = cookieStore.get("auth_intent")?.value;

      // If user just signed up, send to onboarding
      if (intent === "signup") {
        return `${baseUrl}/onboarding`;
      }

      // If user logged in, send to dashboard (Admin will be redirected from Dashboard or Login page logic)
      if (intent === "login") {
        return `${baseUrl}/dashboard`;
      }

      // Default redirect
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user, account, trigger, session }) {
      // Only add user data on initial sign-in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role || "user";
        token.onboardingCompleted = user.onboardingCompleted || false;
      }

      // Handle session updates (like profile image changes)
      if (trigger === "update") {
        if (session?.onboardingCompleted !== undefined) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
        if (session?.image) {
          token.picture = session.image;
        }
      }

      // Only fetch from DB if onboarding status is missing and user is not admin
      // This prevents unnecessary DB calls on every request
      if (!token.onboardingCompleted && token.email && token.email !== "admin@gmail.com") {
        const dbUser = await getUserByEmail(token.email);
        if (dbUser) {
          token.id = dbUser.id;
          token.onboardingCompleted = dbUser.onboardingCompleted;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};
