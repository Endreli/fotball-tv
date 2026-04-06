import { SportsEvent, TVListing } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_SPORTSDB_KEY || "1";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

export async function searchEvents(query: string): Promise<SportsEvent[]> {
  const res = await fetch(`${BASE_URL}/searchevents.php?e=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.event || [];
}

export async function getTVListings(eventId: string): Promise<TVListing[]> {
  const res = await fetch(`${BASE_URL}/lookuptv.php?id=${eventId}`);
  const data = await res.json();
  return data.tvevent || [];
}
