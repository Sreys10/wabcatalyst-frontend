"use server";

import { createUser } from "@lib/users";

export async function signUp(email, password, name) {
  try {
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    await createUser(email, password, name);
    return { success: true };
  } catch (error) {
    return { error: error.message || "Failed to create account" };
  }
}

