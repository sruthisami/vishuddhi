import { NextRequest, NextResponse } from "next/server";

const API = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("Authorization");
  if (!token) return NextResponse.json({ message: "No token" }, { status: 401 });

  const res = await fetch(`${API}/api/journals/${params.id}`, {
    headers: { Authorization: token },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}