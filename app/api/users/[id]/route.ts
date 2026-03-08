import { NextResponse } from "next/server";
import usersJson from "@/data/users.json";
import { mapUserRecord } from "@/lib/mapper/user-mapper";
import { UserRecord } from "@/types/user";

const users = (usersJson as UserRecord[]).map(mapUserRecord);

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = users.find((item) => item.id === id);

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}