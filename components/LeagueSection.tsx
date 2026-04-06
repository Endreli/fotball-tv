"use client";

import { useEffect, useState } from "react";
import { SportsEvent, League, CURRENT_SEASONS } from "@/types";
import { getLeagueRound, getNextLeagueEvents } from "@/lib/sportsdb";
import MatchCard from "./MatchCard";

interface LeagueSectionProps {
  league: League;
}

function guessCurrentRound(leagueId: string): number {
  const now = new Date();
  if (leagueId === "4358") {
    const seasonStart = new Date("2026-03-14");
    const weeksDiff = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(weeksDiff + 1, 30));
  }
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
        // Strategy: try multiple rounds around estimated current round
        const round = guessCurrentRound(league.id);
        const season = CURRENT_SEASONS[league.id] || "2025-2026";

        // Fetch 3 rounds in parallel for better coverage
        const rounds = await Promise.all([
          getLeagueRound(league.id, Math.max(1, round - 1), season),
          getLeagueRound(league.id, round, season),
          getLeagueRound(league.id, round + 1, season),
        ]);

        const allMatches = rounds.flat();

        if (allMatches.length > 0) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          // Filter to upcoming + recently played (last 3 days)
          const threeDaysAgo = new Date(now);
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

          const relevant = allMatches.filter((m) => {
            const d = new Date(m.dateEvent);
            return d >= threeDaysAgo;
          });

          // Sort by date
          relevant.sort((a, b) => new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime());

          setMatches(relevant.slice(0, 10));
        } else {
          // Last resort: try nextleague endpoint
          const nextEvents = await getNextLeagueEvents(league.id);
          setMatches(nextEvents.slice(0, 10));
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
          {[0, 1, 2].map((i) => (
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
