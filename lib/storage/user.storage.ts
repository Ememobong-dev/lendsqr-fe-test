import { UserRecord } from "@/types/user";

const USERS_CACHE_KEY = "lendsqr_users_cache";
const USER_DETAILS_KEY_PREFIX = "lendsqr_user_";

export function saveUsersCache(users: UserRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users));
}

export function getUsersCache(): UserRecord[] {
  if (typeof window === "undefined") return [];
  const value = localStorage.getItem(USERS_CACHE_KEY);
  return value ? (JSON.parse(value) as UserRecord[]) : [];
}

export function saveUserDetails(user: UserRecord) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${USER_DETAILS_KEY_PREFIX}${user.slug}`, JSON.stringify(user));
}

export function getUserDetails(slug: string): UserRecord | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(`${USER_DETAILS_KEY_PREFIX}${slug}`);
  return value ? (JSON.parse(value) as UserRecord) : null;
}