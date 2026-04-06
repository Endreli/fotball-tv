"use client";

import { useEffect, useState } from "react";
import { SportsEvent, League, CURRENT_SEASONS } from "@/types";
import { getLeagueRound, getNextLeagueEvents } from "@/lib/sportsdb";
import MatchCard from "./MatchCard";

interface LeagueSectionProps {
  league: League;
}

// Approximate current round based on date
function guessCurrentRound(leagueId: string): number {
  const now = new Date();
  // Eliteserien starts in March, ~1 round per week
  if (leagueId === "4358") {
    const seasonStart = new Date("2026-03-14");
    const weeksDiff = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(weeksDiff + 1, 30));
  }
  // European leagues: season starts August, ~1 round per week
  const seasonStart = new Date("2025-08-15");
  const weeksDiff = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, Math.min(weeksDiff + 1, 38));
}

export default function LeagueSection({ league }: LeagueSectionProps) {
  const [matches, setMatches] = useState<SportsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      setIsLoading(true);
      try {
        // Try next events first (gives upcoming matches)
        const nextEvents = await getNextLeagueEvents(league.id);

        if (nextEvents.length > 1) {
          setMatches(nextEvents);
        } else {
          // Fallback: fetch by round
          const round = guessCurrentRound(league.id);
          const season = CURRENT_SEASONS[league.id] || "2025-2026";

          // Try current round and next round
          const [current, next] = await Promise.all([
            getLeagueRound(league.id, round, season),
            getLeagueRound(league.id, round + 1, season),
          ]);

          const now = new Date();
          const allMatches = [...current, ...next];

          // Sort: upcoming first, then past
          const sorted = allMatches.sort((a, b) => {
            const dateA = new Date(a.dateEvent);
            const dateB = new Date(b.dateEvent);
            const aUpcoming = dateA >= now;
            const bUpcoming = dateB >= now;
            if (aUpcoming && !bUpcoming) return -1;
            if (!aUpcoming && bUpcoming) return 1;
            return dateA.getTime() - dateB.getTime();
          });

          setMatches(sorted.slice(0, 10));
        }
      } catch {
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatches();
  }, [league.id]);

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-white">{league.shortName}</h2>
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
          {league.country}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">Ingen kommende kamper funnet.</p>
      ) : (
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
          {matches.map((match) => (
            <MatchCard key={match.idEvent} match={match} compact />
          ))}
        </div>
      )}
    </section>
  );
}
