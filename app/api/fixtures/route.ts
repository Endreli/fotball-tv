import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = process.env.NEXT_PUBLIC_SPORTSDB_KEY || "3";
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

interface LeagueConfig {
  id: string;
  season: string;
  rounds: number[];
}

function guessRounds(leagueId: string): number[] {
  const now = new Date();
  if (leagueId === "4358") {
    const start = new Date("2026-03-14");
    const weeks = Math.floor((now.getTime() - start.getTime()) / (7 * 86400000));
    const r = Math.max(1, Math.min(weeks + 1, 30));
    return [r, r + 1];
  }
  const start = new Date("2025-08-15");
  const weeks = Math.floor((now.getTime() - start.getTime()) / (7 * 86400000));
  const r = Math.max(1, Math.min(weeks + 1, 38));
  return [r, r + 1];
}

const LEAGUES: LeagueConfig[] = [
  { id: "4358", season: "2026", rounds: [] },
  { id: "4328", season: "2025-2026", rounds: [] },
  { id: "4480", season: "2025-2026", rounds: [] },
  { id: "4335", season: "2025-2026", rounds: [] },
  { id: "4332", season: "2025-2026", rounds: [] },
  { id: "4331", season: "2025-2026", rounds: [] },
  { id: "4334", season: "2025-2026", rounds: [] },
];

// Simple in-memory cache
let cache: { data: Record<string, unknown[]>; timestamp: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function fetchRound(leagueId: string, round: number, season: string) {
  try {
    const res = await fetch(
      `${BASE}/eventsround.php?id=${leagueId}&r=${round}&s=${encodeURIComponent(season)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch {
    return [];
  }
}

async function fetchAllFixtures(): Promise<Record<string, unknown[]>> {
  const result: Record<string, unknown[]> = {};

  // Fetch sequentially with small delays to avoid rate limiting
  for (const league of LEAGUES) {
    const rounds = guessRounds(league.id);
    const events: unknown[] = [];

    for (const round of rounds) {
      const roundEvents = await fetchRound(league.id, round, league.season);
      events.push(...roundEvents);
      // Small delay between requests
      await new Promise((r) => setTimeout(r, 200));
    }

    // Filter to recent + upcoming
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const filtered = events.filter((e: unknown) => {
      const ev = e as { dateEvent: string };
      return new Date(ev.dateEvent) >= threeDaysAgo;
    });

    filtered.sort((a: unknown, b: unknown) => {
      const ea = a as { dateEvent: string };
      const eb = b as { dateEvent: string };
      return new Date(ea.dateEvent).getTime() - new Date(eb.dateEvent).getTime();
    });

    result[league.id] = filtered.slice(0, 10);
  }

  return result;
}

export async function GET() {
  // Return cached data if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
    });
  }

  const data = await fetchAllFixtures();
  cache = { data, timestamp: Date.now() };

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
  });
}
