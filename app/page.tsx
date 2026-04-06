"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import MatchCard from "@/components/MatchCard";
import LeagueSection from "@/components/LeagueSection";
import { searchEvents, getAllFixtures } from "@/lib/sportsdb";
import { SportsEvent, LEAGUES } from "@/types";

export default function Home() {
  const [searchResults, setSearchResults] = useState<SportsEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fixtures, setFixtures] = useState<Record<string, SportsEvent[]>>({});
  const [fixturesLoading, setFixturesLoading] = useState(true);

  useEffect(() => {
    getAllFixtures()
      .then(setFixtures)
      .catch(() => setFixtures({}))
      .finally(() => setFixturesLoading(false));
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const results = await searchEvents(query);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => setSearchResults(null);

  return (
    <>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Hvor sendes kampen?
        </h1>
        <p className="text-gray-500 text-base">
          Finn TV-kanalen for alle de store fotballkampene
        </p>
      </div>

      {/* Søk */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Søkeresultater */}
      {searchResults !== null && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Søkeresultater
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({searchResults.length} treff)
              </span>
            </h2>
            <button
              onClick={clearSearch}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Nullstill
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-gray-500">Ingen kamper funnet. Prøv et annet lagnavn.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {searchResults.map((match) => (
                <MatchCard key={match.idEvent} match={match} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ligaseksjoner */}
      {searchResults === null && (
        <div className="space-y-10">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-6">
              Kommende kamper
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {LEAGUES.map((league) => (
                <LeagueSection
                  key={league.id}
                  league={league}
                  matches={fixtures[league.id] || []}
                  isLoading={fixturesLoading}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
