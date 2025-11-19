import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
};

// Get all users
const getUsers = () => {
  ensureDataDir();
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save users
const saveUsers = (users) => {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Get user by email
export const getUserByEmail = async (email) => {
  const users = getUsers();
  return users.find((user) => user.email === email);
};

// Get user by ID
export const getUserById = async (id) => {
  const users = getUsers();
  return users.find((user) => user.id === id);
};

// Create new user
export const createUser = async (email, password, name = null) => {
  const users = getUsers();

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password (if provided, otherwise it's an OAuth user)
  let hashedPassword = "";
  if (password && password.trim() !== "") {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name: name || email.split("@")[0],
    provider: password ? "credentials" : "google", // Track auth provider
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
};

