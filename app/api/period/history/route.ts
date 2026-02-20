import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const API_URL = process.env.BACKEND_API_URL || "http://localhost:3001";
  const token = req.headers.get("Authorization");

  if (!token)
    return NextResponse.json({ message: "No token provided" }, { status: 401 });

  const response = await fetch(`${API_URL}/api/period/history`, {
    headers: { Authorization: token },
  });

  return NextResponse.json(await response.json(), {
    status: response.status,
  });
}