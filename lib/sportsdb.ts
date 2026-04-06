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
