"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTVListings } from "@/lib/sportsdb";
import { TVListing, DEFAULT_COUNTRIES } from "@/types";
import CountryFilter from "@/components/CountryFilter";
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

  const grouped = filteredListings.reduce<Record<string, TVListing[]>>((acc, listing) => {
    if (!acc[listing.strCountry]) acc[listing.strCountry] = [];
    acc[listing.strCountry].push(listing);
    return acc;
  }, {});

  const eventName = listings[0]?.strEvent || "Kamp";
  const leagueName = listings[0]?.strLeague || "";

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
        {leagueName && (
          <p className="text-gray-500 mt-1">{leagueName}</p>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-16">
          <span className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 mt-4">Henter TV-sendinger...</p>
        </div>
      )}

      {!isLoading && listings.length === 0 && (
        <div className="text-center py-16 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 font-medium mb-1">Ingen TV-sendinger funnet</p>
          <p className="text-gray-600 text-sm">Denne kampen har ikke registrerte TV-sendinger enna.</p>
        </div>
      )}

      {!isLoading && listings.length > 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">
              Filtrer pa land
            </h2>
            <CountryFilter
              countries={allCountries}
              selected={selectedCountries}
              onToggle={toggleCountry}
            />
          </div>

          {Object.keys(grouped).length === 0 && (
            <div className="text-center py-12 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-gray-500">Velg minst ett land for a se TV-kanaler.</p>
            </div>
          )}

          <div className="space-y-8">
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([country, countryListings]) => (
                <div key={country}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-base font-bold text-white">{country}</h3>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                      {countryListings.length}
                    </span>
                  </div>
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
    </>
  );
}
