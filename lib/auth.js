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
      console.log("🔐 SignIn Callback Triggered");
      console.log("   Provider:", account?.provider);
      console.log("   User Email:", user?.email);

      // If signing in with Google, check if user exists or create one
      if (account?.provider === "google" && user.email) {
        try {
          console.log("   🔍 Checking for existing user...");
          let existingUser = await getUserByEmail(user.email);

          if (!existingUser) {
            console.log("   🆕 User not found. Creating new user...");
            // Create user account for Google sign-in (without password)
            await createUser(
              user.email,
              "", // No password for OAuth users
              user.name || user.email?.split("@")[0] || "User"
            );
            console.log("   ✅ New user created successfully.");
          } else {
            console.log("   ✅ User already exists.");
          }
          return true;
        } catch (error) {
          // If user already exists, that's fine - just log them in
          if (error.message.includes("already exists")) {
            console.log("   ⚠️ User creation race condition handled (user exists).");
            return true;
          }
          console.error("❌ Error in Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account?.provider === "google") {
        // For Google users, we need to fetch the user ID from our database
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

