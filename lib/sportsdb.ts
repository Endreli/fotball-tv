import { SportsEvent, TVListing } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_SPORTSDB_KEY && process.env.NEXT_PUBLIC_SPORTSDB_KEY.length > 0
  ? process.env.NEXT_PUBLIC_SPORTSDB_KEY
  : "3";
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

// Fetch all league fixtures from our cached API route
export async function getAllFixtures(): Promise<Record<string, SportsEvent[]>> {
  const res = await fetch("/api/fixtures");
  if (!res.ok) return {};
  return res.json();
}

export interface TVKampenChannel {
  title: string;
  league: string;
  date: string;
  time: string;
  channels: string[];
}

// Fetch real TV channel data from TVkampen via our API route
export async function getTVKampenChannels(date: string): Promise<TVKampenChannel[]> {
  const res = await fetch(`/api/tvkampen?date=${date}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.fixtures || [];
}
