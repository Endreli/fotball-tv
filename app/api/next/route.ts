import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_SPORTSDB_KEY || "1";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ events: [] });
  }

  const res = await fetch(`${BASE_URL}/eventsnextleague.php?id=${id}`);
  const data = await res.json();
  return NextResponse.json(data);
}
