import { NextRequest, NextResponse } from "next/server";

const API = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (!token) return NextResponse.json({ message: "No token" }, { status: 401 });

  const body = await req.json();

  const res = await fetch(`${API}/api/journals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (!token) return NextResponse.json({ message: "No token" }, { status: 401 });

  const res = await fetch(`${API}/api/journals`, {
    headers: { Authorization: token },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}