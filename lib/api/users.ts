import { UserRecord, UsersApiResponse } from "@/types/user";

export type UsersQueryParams = {
  page?: number;
  limit?: number;
  organization?: string;
  username?: string;
  email?: string;
  date?: string;
  phoneNumber?: string;
  status?: string;
};

function toQueryString(params: UsersQueryParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

export async function fetchUsers(params: UsersQueryParams = {}): Promise<UsersApiResponse> {
  const query = toQueryString(params);
  const response = await fetch(`/api/users${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function fetchUserBySlug(slug: string): Promise<UserRecord> {
  const response = await fetch(`/api/users/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  return response.json();
}