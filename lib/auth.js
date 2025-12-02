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
    async redirect({ url, baseUrl }) {
      const cookieStore = cookies();
      const intent = cookieStore.get("auth_intent")?.value;

      // If user just signed up, send to onboarding
      if (intent === "signup") {
        return `${baseUrl}/onboarding`;
      }

      // If user logged in, send to dashboard
      if (intent === "login") {
        return `${baseUrl}/dashboard`;
      }

      // Default redirect
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // Fetch latest onboarding status from DB if not present
        if (user.onboardingCompleted !== undefined) {
          token.onboardingCompleted = user.onboardingCompleted;
        }
      }

      // If update is triggered, update the token with passed session data
      if (trigger === "update") {
        if (session?.onboardingCompleted) {
          token.onboardingCompleted = session.onboardingCompleted;
        }
        if (session?.image) {
          token.picture = session.image;
        }
      }

      // Always refresh onboarding status from DB to ensure middleware has latest data
      if (token.email) {
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
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

