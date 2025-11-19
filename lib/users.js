import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import User from "../models/User";

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    
    if (!user) {
      return null;
    }

    // Convert MongoDB _id to string id for compatibility
    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password || "",
      name: user.name,
      provider: user.provider,
    };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    await connectDB();
    const user = await User.findById(id).lean();
    
    if (!user) {
      return null;
    }

    // Convert MongoDB _id to string id for compatibility
    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password || "",
      name: user.name,
      provider: user.provider,
    };
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

// Create new user
export const createUser = async (email, password, name = null) => {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password (if provided, otherwise it's an OAuth user)
    let hashedPassword = "";
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split("@")[0],
      provider: password ? "credentials" : "google",
    });

    await newUser.save();

    return {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    // Re-throw if it's a duplicate error, otherwise throw generic error
    if (error.message.includes("already exists")) {
      throw error;
    }
    if (error.code === 11000) {
      // MongoDB duplicate key error
      throw new Error("User with this email already exists");
    }
    throw new Error("Failed to create user. Please try again.");
  }
};

