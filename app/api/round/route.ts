import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_SPORTSDB_KEY || "1";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const round = request.nextUrl.searchParams.get("r");
  const season = request.nextUrl.searchParams.get("s");

  if (!id || !round || !season) {
    return NextResponse.json({ events: [] });
  }

  const res = await fetch(
    `${BASE_URL}/eventsround.php?id=${id}&r=${round}&s=${encodeURIComponent(season)}`
  );
  const data = await res.json();
  return NextResponse.json(data);
}
