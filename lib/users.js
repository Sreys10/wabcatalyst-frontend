import bcrypt from "bcryptjs";
import connectDB from "./db";
import User from "@models/User";

// Get user by email
export const getUserByEmail = async (email) => {
  await connectDB();
  const user = await User.findOne({ email }).lean();
  if (user) {
    user.id = user._id.toString();
  }
  return user;
};

// Get user by ID
export const getUserById = async (id) => {
  await connectDB();
  const user = await User.findById(id).lean();
  if (user) {
    user.id = user._id.toString();
  }
  return user;
};

// Create new user
export const createUser = async (email, password, name = null) => {
  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password (if provided, otherwise it's an OAuth user)
  let hashedPassword = "";
  if (password && password.trim() !== "") {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Create new user
  const newUser = await User.create({
    email,
    password: hashedPassword,
    name: name || email.split("@")[0],
    provider: password ? "credentials" : "google",
  });

  return {
    id: newUser._id.toString(),
    email: newUser.email,
    name: newUser.name,
  };
};

