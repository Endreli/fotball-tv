"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getTVListings } from "@/lib/sportsdb";
import { getChannelsForLeague, ChannelInfo } from "@/lib/channels";
import { TVListing, DEFAULT_COUNTRIES } from "@/types";
import CountryFilter from "@/components/CountryFilter";
interface MergedChannelData {
  country: string;
  channels: Array<{
    name: string;
    logo: string | null;
    time: string;
    date: string;
    source: "api" | "static";
  }>;
}

export default function MatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const leagueId = searchParams.get("league") || "";
  const matchName = searchParams.get("name") || "";
  const matchLeague = searchParams.get("leagueName") || "";
  const matchDate = searchParams.get("date") || "";
  const matchTime = searchParams.get("time") || "";

  const [apiListings, setApiListings] = useState<TVListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTV() {
      setIsLoading(true);
      try {
        const data = await getTVListings(id);
        setApiListings(data);
      } catch {
        setApiListings([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTV();
  }, [id]);

  // Merge API data with static channel data
  const staticChannels = leagueId ? getChannelsForLeague(leagueId) : {};

  const mergedData: MergedChannelData[] = [];
  const seenCountries = new Set<string>();

  // Add API listings first
  const apiGrouped: Record<string, TVListing[]> = {};
  for (const listing of apiListings) {
    if (!apiGrouped[listing.strCountry]) apiGrouped[listing.strCountry] = [];
    apiGrouped[listing.strCountry].push(listing);
  }

  for (const [country, listings] of Object.entries(apiGrouped)) {
    seenCountries.add(country);
    mergedData.push({
      country,
      channels: listings.map((l) => ({
        name: l.strChannel,
        logo: l.strLogo,
        time: l.strTime,
        date: l.dateEvent,
        source: "api" as const,
      })),
    });
  }

  // Add static channel data for countries not in API
  for (const [country, channels] of Object.entries(staticChannels)) {
    if (!seenCountries.has(country)) {
      seenCountries.add(country);
      mergedData.push({
        country,
        channels: channels.map((c: ChannelInfo) => ({
          name: c.channel,
          logo: c.logo || null,
          time: matchTime,
          date: matchDate,
          source: "static" as const,
        })),
      });
    }
  }

  mergedData.sort((a, b) => a.country.localeCompare(b.country));

  // Set default selected countries on first load
  useEffect(() => {
    if (!isLoading && selectedCountries.length === 0) {
      const available = mergedData.map((d) => d.country);
      const defaults = DEFAULT_COUNTRIES.filter((c) =>
        available.some((a) => a.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(a.toLowerCase()))
      );
      // Also check for Norwegian "Norge" matching
      const norgeMatch = available.find((c) => c === "Norge" || c === "Norway");
      if (norgeMatch && !defaults.includes(norgeMatch)) defaults.unshift(norgeMatch);

      setSelectedCountries(defaults.length > 0 ? defaults : available.slice(0, 6));
    }
  }, [isLoading, mergedData.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const allCountries = mergedData.map((d) => d.country);

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const filteredData = mergedData.filter((d) => selectedCountries.includes(d.country));

  const eventName = apiListings[0]?.strEvent || matchName || "Kamp";
  const leagueName = apiListings[0]?.strLeague || matchLeague || "";

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tilbake
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{eventName}</h1>
        <div className="flex items-center gap-3 mt-2">
          {leagueName && (
            <span className="text-gray-500">{leagueName}</span>
          )}
          {matchDate && (
            <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
              {matchDate}{matchTime ? ` kl. ${matchTime.substring(0, 5)}` : ""}
            </span>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-16">
          <span className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">Henter TV-sendinger...</p>
        </div>
      )}

      {!isLoading && mergedData.length === 0 && (
        <div className="text-center py-16 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 font-medium mb-1">Ingen TV-info tilgjengelig</p>
          <p className="text-gray-600 text-sm">Vi har ikke TV-data for denne kampen ennå.</p>
        </div>
      )}

      {!isLoading && mergedData.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">
              Velg land
            </h2>
            <CountryFilter
              countries={allCountries}
              selected={selectedCountries}
              onToggle={toggleCountry}
            />
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-gray-500">Velg minst ett land for å se TV-kanaler.</p>
            </div>
          )}

          <div className="space-y-8">
            {filteredData.map(({ country, channels }) => (
              <div key={country}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-base font-bold text-white">{country}</h3>
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                    {channels.length}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {channels.map((ch, i) => (
                    <div
                      key={`${ch.name}-${i}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="w-10 h-10 shrink-0 bg-white/5 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{ch.name}</p>
                        {ch.time && (
                          <p className="text-xs text-gray-500">
                            kl. {ch.time.substring(0, 5)}
                          </p>
                        )}
                      </div>
                      {ch.source === "static" && (
                        <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">
                          typisk
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {Object.keys(staticChannels).length > 0 && (
            <p className="text-xs text-gray-600 mt-8 text-center">
              Kanaler merket &quot;typisk&quot; er basert på kjente rettigheter og kan variere per kamp.
            </p>
          )}
        </>
      )}
    </>
  );
}
