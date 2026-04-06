import { SportsEvent, TVListing } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_SPORTSDB_KEY || "1";
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

export async function searchEvents(query: string): Promise<SportsEvent[]> {
  const res = await fetch(`${BASE}/searchevents.php?e=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.event || [];
}

export async function getTVListings(eventId: string): Promise<TVListing[]> {
  const res = await fetch(`${BASE}/lookuptv.php?id=${eventId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.tvevent || [];
}

export async function getLeagueRound(
  leagueId: string,
  round: number,
  season: string
): Promise<SportsEvent[]> {
  const res = await fetch(
    `${BASE}/eventsround.php?id=${leagueId}&r=${round}&s=${encodeURIComponent(season)}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.events || [];
}

export async function getNextLeagueEvents(leagueId: string): Promise<SportsEvent[]> {
  const res = await fetch(`${BASE}/eventsnextleague.php?id=${leagueId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.events || [];
}
