import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: { username: user.username, displayName: user.displayName },
  });
}
