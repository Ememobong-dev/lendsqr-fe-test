import { NextRequest, NextResponse } from "next/server";
import usersJson from "@/data/users.json";
import { mapUserRecord } from "@/lib/mapper/user-mapper";
import { UserRecord, UsersApiResponse } from "@/types/user";

const users = (usersJson as UserRecord[]).map(mapUserRecord);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const organization = (searchParams.get("organization") ?? "").toLowerCase();
  const username = (searchParams.get("username") ?? "").toLowerCase();
  const email = (searchParams.get("email") ?? "").toLowerCase();
  const date = (searchParams.get("date") ?? "").toLowerCase();
  const phoneNumber = (searchParams.get("phoneNumber") ?? "").toLowerCase();
  const status = (searchParams.get("status") ?? "").toLowerCase();

  const filtered = users.filter((user) => {
    const matchesOrganization =
      !organization || user.organization.toLowerCase().includes(organization);

    const matchesUsername =
      !username || user.username.toLowerCase().includes(username);

    const matchesEmail =
      !email || user.email.toLowerCase().includes(email);

    const matchesDate =
      !date || user.dateJoined.toLowerCase().includes(date);

    const matchesPhone =
      !phoneNumber || user.phoneNumber.toLowerCase().includes(phoneNumber);

    const matchesStatus =
      !status || user.status.toLowerCase() === status;

    return (
      matchesOrganization &&
      matchesUsername &&
      matchesEmail &&
      matchesDate &&
      matchesPhone &&
      matchesStatus
    );
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const response: UsersApiResponse = {
    data: paginated,
    total,
    page,
    limit,
    totalPages,
  };

  return NextResponse.json(response);
}