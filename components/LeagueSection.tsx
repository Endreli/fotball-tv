import { SportsEvent, League } from "@/types";
import MatchCard from "./MatchCard";

interface LeagueSectionProps {
  league: League;
  matches: SportsEvent[];
  isLoading: boolean;
}

export default function LeagueSection({ league, matches, isLoading }: LeagueSectionProps) {
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
            <MatchCard key={match.idEvent} match={match} compact leagueId={league.id} />
          ))}
        </div>
      )}
    </section>
  );
}
