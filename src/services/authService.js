/**
 * authService.js
 * Client-side authentication service connecting to the PostgreSQL backend API.
 */

import { apiClient } from "./apiClient.js";

// Available avatar options
export const AVATAR_OPTIONS = [
  { id: "snake_blue", label: "Python Blue", emoji: "🐍", bg: "bg-blue-600" },
  { id: "robot", label: "Robo Coder", emoji: "🤖", bg: "bg-blue-700" },
  { id: "rocket", label: "Space Rocket", emoji: "🚀", bg: "bg-[#1e3252]" },
  { id: "wizard", label: "Code Wizard", emoji: "🧙‍♂️", bg: "bg-sky-600" },
  { id: "sparkles", label: "Star Learner", emoji: "✨", bg: "bg-[#14233a]" },
  { id: "lion", label: "Lionheart", emoji: "🦁", bg: "bg-blue-800" },
  { id: "ninja", label: "Python Ninja", emoji: "🥷", bg: "bg-slate-800" },
  { id: "owl", label: "Wise Owl", emoji: "🦉", bg: "bg-[#101b2d]" }
];

/**
 * Fetch current authenticated user session from backend
 */
export async function getCurrentSession() {
  try {
    const res = await apiClient.get("/auth/me");
    return res.data?.user || null;
  } catch (err) {
    return null;
  }
}

/**
 * Register a new user in PostgreSQL
 */
export async function signUpUser({
  name,
  email,
  password,
  stage = "young",
  language = "english",
  avatar = "snake_blue",
  bio = ""
}) {
  const res = await apiClient.post("/auth/register", {
    name,
    email,
    password,
    stage,
    language,
    avatar,
    bio
  });

  const user = res.data?.user;
  const token = res.data?.token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("py_token", token);
    if (user?.stage) localStorage.setItem("learningStage", user.stage);
    if (user?.language) localStorage.setItem("learningLanguage", user.language);
  }
  return user;
}

/**
 * Log in an existing user via PostgreSQL
 */
export async function loginUser({ emailOrUsername, password, rememberMe = true }) {
  const res = await apiClient.post("/auth/login", {
    emailOrUsername,
    password,
    rememberMe
  });

  const user = res.data?.user;
  const token = res.data?.token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("py_token", token);
    if (user?.stage) localStorage.setItem("learningStage", user.stage);
    if (user?.language) localStorage.setItem("learningLanguage", user.language);
  }
  return user;
}

/**
 * Log out active session
 */
export async function logoutUser() {
  try {
    await apiClient.post("/auth/logout", {});
  } catch (err) {
    // ignore
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("py_token");
    }
  }
}

/**
 * Update user profile details in PostgreSQL
 */
export async function updateUserProfile(userId, updates) {
  const res = await apiClient.patch("/users/me", updates);
  const user = res.data?.user;
  if (user && typeof window !== "undefined") {
    if (updates.stage) localStorage.setItem("learningStage", updates.stage);
    if (updates.language) localStorage.setItem("learningLanguage", updates.language);
  }
  return user;
}

/**
 * Toggle bookmark for a topic
 */
export async function toggleUserBookmark(userId, topicId) {
  const res = await apiClient.post("/bookmarks/toggle", { topicId });
  return res.data?.user || null;
}

/**
 * Toggle topic completion & update XP in PostgreSQL
 */
export async function toggleUserCompletedTopic(userId, topicId, completed = true) {
  const res = await apiClient.post("/progress/toggle", { topicId, completed });
  return res.data?.user || null;
}

/**
 * Record quiz score in PostgreSQL
 */
export async function recordQuizScore(userId, topicId, scorePercent) {
  const res = await apiClient.post("/progress/quiz", { topicId, quizScore: scorePercent });
  return res.data?.user || null;
}

/**
 * Reset password
 */
export async function resetUserPassword(email, newPassword) {
  const res = await apiClient.post("/auth/reset-password", {
    email,
    newPassword
  });
  return res.success;
}

/**
 * Delete account
 */
export async function deleteUserAccount(userId) {
  const res = await apiClient.delete("/users/me");
  return res.success;
}
