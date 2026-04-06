"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import MatchList from "@/components/MatchList";
import { searchEvents } from "@/lib/sportsdb";
import { SportsEvent } from "@/types";

export default function Home() {
  const [matches, setMatches] = useState<SportsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await searchEvents(query);
      setMatches(results);
    } catch {
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Fotball TV-guide
        </h1>
        <p className="text-gray-500">
          Finn hvilken kanal kampen sendes pa
        </p>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <div className="mt-6">
        {isLoading && (
          <div className="text-center py-12">
            <span className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 mt-3">Soker...</p>
          </div>
        )}

        {!isLoading && hasSearched && matches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Ingen kamper funnet. Prov et annet sok.</p>
          </div>
        )}

        {!isLoading && <MatchList matches={matches} />}
      </div>
    </main>
  );
}
