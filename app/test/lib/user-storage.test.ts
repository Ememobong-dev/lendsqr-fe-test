import { beforeEach, describe, expect, it } from "vitest";
import {
  getUserDetails,
  getUsersCache,
  saveUserDetails,
  saveUsersCache,
} from "@/lib/storage/user.storage";

describe("user storage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and retrieves a single user", () => {
    const user = {
      slug: "john-doe-1",
      fullName: "John Doe",
    };

    saveUserDetails(user as never);
    const result = getUserDetails("john-doe-1");

    expect(result).toEqual(user);
  });

  it("returns null when stored user does not exist", () => {
    const result = getUserDetails("missing-user");
    expect(result).toBeNull();
  });

  it("saves and retrieves users cache", () => {
    const users = [
      { slug: "john-doe-1", fullName: "John Doe" },
      { slug: "jane-doe-2", fullName: "Jane Doe" },
    ];

    saveUsersCache(users as never);
    const result = getUsersCache();

    expect(result).toEqual(users);
  });

  it("returns empty array when users cache is missing", () => {
    const result = getUsersCache();
    expect(result).toEqual([]);
  });
});