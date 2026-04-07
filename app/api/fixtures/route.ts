import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = process.env.NEXT_PUBLIC_SPORTSDB_KEY || "3";
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

interface LeagueConfig {
  id: string;
  season: string;
  // Hardcoded approximate current rounds (updated periodically)
  // These are calibrated for early April 2026
  tryRounds: number[];
}

const LEAGUES: LeagueConfig[] = [
  // Eliteserien: round 3 = Apr 6, round 4 = Apr 11
  { id: "4358", season: "2026", tryRounds: [3, 4, 5] },
  // Premier League: round 32 = Apr 10, round 33 = Apr 18
  { id: "4328", season: "2025-2026", tryRounds: [31, 32, 33] },
  // Champions League: knockout rounds
  { id: "4480", season: "2025-2026", tryRounds: [8, 9, 10, 11, 12, 13, 14, 15, 16] },
  // La Liga: round ~30
  { id: "4335", season: "2025-2026", tryRounds: [29, 30, 31, 32] },
  // Serie A: round ~31
  { id: "4332", season: "2025-2026", tryRounds: [30, 31, 32, 33] },
  // Bundesliga: round 28 = Apr 4, round 29 = Apr 10
  { id: "4331", season: "2025-2026", tryRounds: [28, 29, 30, 31] },
  // Ligue 1: round ~30
  { id: "4334", season: "2025-2026", tryRounds: [29, 30, 31, 32] },
];

async function fetchRound(leagueId: string, round: number, season: string) {
  try {
    const res = await fetch(
      `${BASE}/eventsround.php?id=${leagueId}&r=${round}&s=${encodeURIComponent(season)}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return [];
    const text = await res.text();
    if (text.startsWith("error") || text.startsWith("<!")) return [];
    const data = JSON.parse(text);
    return data.events || [];
  } catch {
    return [];
  }
}

// Simple in-memory cache
let cache: { data: Record<string, unknown[]>; timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function fetchAllFixtures(): Promise<Record<string, unknown[]>> {
  const result: Record<string, unknown[]> = {};
  const now = new Date();
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const twoWeeksAhead = new Date(now);
  twoWeeksAhead.setDate(twoWeeksAhead.getDate() + 14);

  for (const league of LEAGUES) {
    const allEvents: unknown[] = [];

    // Fetch all candidate rounds (sequential to avoid rate limits)
    for (const round of league.tryRounds) {
      const events = await fetchRound(league.id, round, league.season);
      allEvents.push(...events);
      // Small delay between requests to avoid rate limiting
      await new Promise((r) => setTimeout(r, 250));
    }

    // Filter to upcoming + recent matches (within -3 days to +14 days)
    const relevant = allEvents.filter((e: unknown) => {
      const ev = e as { dateEvent: string };
      const d = new Date(ev.dateEvent);
      return d >= threeDaysAgo && d <= twoWeeksAhead;
    });

    // Sort by date
    relevant.sort((a: unknown, b: unknown) => {
      const ea = a as { dateEvent: string };
      const eb = b as { dateEvent: string };
      return new Date(ea.dateEvent).getTime() - new Date(eb.dateEvent).getTime();
    });

    result[league.id] = relevant.slice(0, 12);
  }

  return result;
}

export async function GET() {
  // Return cached data if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const data = await fetchAllFixtures();
  cache = { data, timestamp: Date.now() };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
