import Link from "next/link";
import { SportsEvent } from "@/types";

interface MatchCardProps {
  match: SportsEvent;
  compact?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "I dag";
  if (date.getTime() === tomorrow.getTime()) return "I morgen";

  return date.toLocaleDateString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  return timeStr.substring(0, 5);
}

export default function MatchCard({ match, compact }: MatchCardProps) {
  const hasScore = match.intHomeScore !== null && match.intAwayScore !== null;

  if (compact) {
    return (
      <Link
        href={`/match/${match.idEvent}`}
        className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-white/5 transition-colors group"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
            {match.strHomeTeam} vs {match.strAwayTeam}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-3 shrink-0">
          {hasScore ? (
            <span className="text-sm font-bold text-emerald-400">
              {match.intHomeScore} - {match.intAwayScore}
            </span>
          ) : (
            <span className="text-xs text-gray-400">
              {formatTime(match.strTime)}
            </span>
          )}
          <span className="text-xs text-gray-500">{formatDate(match.dateEvent)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/match/${match.idEvent}`}
      className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-emerald-500/20 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          {formatDate(match.dateEvent)}
          {match.strTime && ` · ${formatTime(match.strTime)}`}
        </span>
        {hasScore && (
          <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
            {match.intHomeScore} - {match.intAwayScore}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
            {match.strHomeTeam}
          </p>
          <p className="font-semibold text-gray-400">
            {match.strAwayTeam}
          </p>
        </div>
        <svg className="w-5 h-5 text-gray-600 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
