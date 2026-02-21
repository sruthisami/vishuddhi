import { NextRequest, NextResponse } from "next/server";

const API = process.env.BACKEND_API_URL || "http://localhost:3001";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ REQUIRED in Next 15

  const token = req.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "No token" }, { status: 401 });
  }

  const res = await fetch(`${API}/api/journals/${id}/continue`, {
    method: "POST",
    headers: { Authorization: token },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}