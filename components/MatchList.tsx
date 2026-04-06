import Link from "next/link";
import { SportsEvent } from "@/types";

interface MatchListProps {
  matches: SportsEvent[];
}

export default function MatchList({ matches }: MatchListProps) {
  if (matches.length === 0) return null;

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <Link
          key={match.idEvent}
          href={`/match/${match.idEvent}`}
          className="block p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base">
                {match.strEvent}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {match.strLeague}
              </p>
            </div>
            <div className="text-right ml-4 shrink-0">
              <p className="text-sm font-medium text-gray-700">
                {match.dateEvent}
              </p>
              {match.strTime && (
                <p className="text-sm text-gray-400">{match.strTime}</p>
              )}
              {match.intHomeScore !== null && match.intAwayScore !== null && (
                <p className="text-sm font-bold text-blue-600 mt-1">
                  {match.intHomeScore} - {match.intAwayScore}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
