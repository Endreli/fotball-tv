import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_SPORTSDB_KEY || "1";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("e");
  if (!query) {
    return NextResponse.json({ event: [] });
  }

  const res = await fetch(`${BASE_URL}/searchevents.php?e=${encodeURIComponent(query)}`);
  const data = await res.json();
  return NextResponse.json(data);
}
