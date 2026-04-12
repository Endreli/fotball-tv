"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getTVKampenChannels, TVKampenChannel } from "@/lib/sportsdb";
import { getChannelsForLeague, ChannelInfo } from "@/lib/channels";


interface ChannelDisplay {
  name: string;
  type: "tv" | "streaming" | "both";
  source: "live" | "rights";
}

function classifyChannel(name: string): "tv" | "streaming" | "both" {
  const streamOnly = ["Viaplay", "DAZN", "Paramount+", "Peacock", "ESPN+", "Disney+",
    "discovery+", "Amazon Prime", "TV 2 Play", "Ligue 1+", "Fubo", "OneFootball"];
  const tvOnly = ["TV 2 Sport Premium", "NRK", "TV4", "Sky Sports", "TNT Sports",
    "NBC", "USA Network", "CBS Sports", "ESPN", "ABC", "beIN Sports", "Premier Sports"];

  for (const s of streamOnly) {
    if (name.includes(s)) return "streaming";
  }
  for (const t of tvOnly) {
    if (name.includes(t)) return "tv";
  }
  if (name.includes("V sport") || name.includes("V Sport")) return "tv";
  return "both";
}

function typeLabel(type: "tv" | "streaming" | "both"): string {
  if (type === "tv") return "TV";
  if (type === "streaming") return "Strømming";
  return "TV + Strømming";
}

function typeColor(type: "tv" | "streaming" | "both"): string {
  if (type === "tv") return "text-blue-400 bg-blue-500/10";
  if (type === "streaming") return "text-purple-400 bg-purple-500/10";
  return "text-emerald-400 bg-emerald-500/10";
}

function normalizeTeamName(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, " ")
    .replace("fc ", "").replace(" fc", "")
    .replace("afc ", "").replace(" afc", "")
    .trim();
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

  const [liveChannels, setLiveChannels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTV() {
      if (!matchDate || !matchName) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fixtures = await getTVKampenChannels(matchDate);

        // Find matching fixture by team names
        const nameParts = matchName.toLowerCase().split(/\s+vs\s+/);
        const home = nameParts[0] ? normalizeTeamName(nameParts[0]) : "";
        const away = nameParts[1] ? normalizeTeamName(nameParts[1]) : "";

        const match = fixtures.find((f: TVKampenChannel) => {
          const fTitle = f.title.toLowerCase();
          if (home && away) {
            return fTitle.includes(home.split(" ")[0]) && fTitle.includes(away.split(" ")[0]);
          }
          return false;
        });

        if (match) {
          setLiveChannels(match.channels);
        }
      } catch {
        // Ignore errors
      } finally {
        setIsLoading(false);
      }
    }
    fetchTV();
  }, [id, matchDate, matchName]);

  // Build channel list:
  // 1. Live channels from TVkampen (actual per-match data)
  // 2. Fallback to static rights data
  const channels: ChannelDisplay[] = [];

  if (liveChannels.length > 0) {
    // Use live data — these are the actual channels for THIS match
    liveChannels.forEach(name => {
      channels.push({
        name,
        type: classifyChannel(name),
        source: "live",
      });
    });
  } else if (!isLoading) {
    // Fallback to static rights data for Norway
    const staticChannels = leagueId ? getChannelsForLeague(leagueId) : {};
    const norgeChannels = staticChannels["Norge"] || [];
    norgeChannels.forEach((c: ChannelInfo) => {
      channels.push({
        name: c.channel,
        type: c.type,
        source: "rights",
      });
    });
  }

  // Also show international rights
  const staticChannels = leagueId ? getChannelsForLeague(leagueId) : {};
  const internationalCountries = Object.entries(staticChannels)
    .filter(([country]) => country !== "Norge")
    .map(([country, chs]) => ({
      country,
      channels: chs.map((c: ChannelInfo) => ({
        name: c.channel,
        type: c.type,
        source: "rights" as const,
      })),
    }));

  const [showInternational, setShowInternational] = useState(false);

  const eventName = matchName || "Kamp";
  const leagueName = matchLeague || "";

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
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {leagueName && <span className="text-gray-500">{leagueName}</span>}
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
          <p className="text-gray-500 mt-4">Henter TV-kanaler...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Norwegian channels - main section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-white">Norge</h2>
              {liveChannels.length > 0 && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  Bekreftet
                </span>
              )}
              {liveChannels.length === 0 && channels.length > 0 && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                  Basert på rettigheter
                </span>
              )}
            </div>

            {channels.length === 0 ? (
              <div className="text-center py-8 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-gray-500">Ingen kanalinformasjon tilgjengelig for denne kampen.</p>
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {channels.map((ch, i) => (
                  <div
                    key={`${ch.name}-${i}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="w-10 h-10 shrink-0 bg-white/5 rounded-lg flex items-center justify-center">
                      {ch.type === "streaming" ? (
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{ch.name}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeColor(ch.type)}`}>
                        {typeLabel(ch.type)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* International section */}
          {internationalCountries.length > 0 && (
            <div>
              <button
                onClick={() => setShowInternational(!showInternational)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showInternational ? "rotate-90" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Andre land ({internationalCountries.length})
              </button>

              {showInternational && (
                <div className="space-y-6">
                  {internationalCountries.map(({ country, channels: chs }) => (
                    <div key={country}>
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">{country}</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {chs.map((ch, i) => (
                          <div
                            key={`${ch.name}-${i}`}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-300 text-sm truncate">{ch.name}</p>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeColor(ch.type)}`}>
                                {typeLabel(ch.type)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-gray-600 text-center">
                    Internasjonale kanaler er basert på kjente TV-rettigheter for sesongen.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
