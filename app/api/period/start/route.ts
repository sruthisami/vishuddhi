import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const API_URL = process.env.BACKEND_API_URL || "http://localhost:3001";
  const token = req.headers.get("Authorization");

  if (!token)
    return NextResponse.json({ message: "No token provided" }, { status: 401 });

  try {
    const { startDate, flow } = await req.json();

    const response = await fetch(`${API_URL}/api/period/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ startDate, flow }),
    });

    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}