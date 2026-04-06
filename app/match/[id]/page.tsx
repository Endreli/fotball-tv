"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTVListings } from "@/lib/sportsdb";
import { TVListing } from "@/types";
import CountryFilter, { DEFAULT_COUNTRIES } from "@/components/CountryFilter";
import ChannelCard from "@/components/ChannelCard";

export default function MatchPage() {
  const params = useParams();
  const id = params.id as string;

  const [listings, setListings] = useState<TVListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(DEFAULT_COUNTRIES);

  useEffect(() => {
    async function fetchTV() {
      setIsLoading(true);
      try {
        const data = await getTVListings(id);
        setListings(data);

        // Velg default-land som faktisk finnes i resultatene
        const available = Array.from(new Set(data.map((l) => l.strCountry)));
        const defaults = DEFAULT_COUNTRIES.filter((c) => available.includes(c));
        setSelectedCountries(defaults.length > 0 ? defaults : available.slice(0, 5));
      } catch {
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTV();
  }, [id]);

  const allCountries = Array.from(new Set(listings.map((l) => l.strCountry))).sort();

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const filteredListings = listings.filter((l) => selectedCountries.includes(l.strCountry));

  // Grupper per land
  const grouped = filteredListings.reduce<Record<string, TVListing[]>>((acc, listing) => {
    if (!acc[listing.strCountry]) acc[listing.strCountry] = [];
    acc[listing.strCountry].push(listing);
    return acc;
  }, {});

  const eventName = listings[0]?.strEvent || "Kamp";
  const leagueName = listings[0]?.strLeague || "";

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tilbake til sok
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{eventName}</h1>
        {leagueName && <p className="text-gray-500 mt-1">{leagueName}</p>}
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <span className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 mt-3">Henter TV-sendinger...</p>
        </div>
      )}

      {!isLoading && listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Ingen TV-sendinger funnet for denne kampen.</p>
        </div>
      )}

      {!isLoading && listings.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Velg land</h2>
            <CountryFilter
              countries={allCountries}
              selected={selectedCountries}
              onToggle={toggleCountry}
            />
          </div>

          {Object.keys(grouped).length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Velg minst ett land for a se TV-kanaler.
            </p>
          )}

          <div className="space-y-6">
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([country, countryListings]) => (
                <div key={country}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    {country}
                    <span className="text-xs font-normal text-gray-400">
                      ({countryListings.length} kanal{countryListings.length !== 1 ? "er" : ""})
                    </span>
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {countryListings.map((listing) => (
                      <ChannelCard key={listing.idChannel} listing={listing} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </main>
  );
}
