import { SportsEvent, TVListing } from "@/types";

export async function searchEvents(query: string): Promise<SportsEvent[]> {
  const res = await fetch(`/api/search?e=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.event || [];
}

export async function getTVListings(eventId: string): Promise<TVListing[]> {
  const res = await fetch(`/api/tv?id=${eventId}`);
  const data = await res.json();
  return data.tvevent || [];
}

export async function getLeagueRound(
  leagueId: string,
  round: number,
  season: string
): Promise<SportsEvent[]> {
  const res = await fetch(
    `/api/round?id=${leagueId}&r=${round}&s=${encodeURIComponent(season)}`
  );
  const data = await res.json();
  return data.events || [];
}

export async function getNextLeagueEvents(leagueId: string): Promise<SportsEvent[]> {
  const res = await fetch(`/api/next?id=${leagueId}`);
  const data = await res.json();
  return data.events || [];
}
