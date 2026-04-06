"use client";

interface CountryFilterProps {
  countries: string[];
  selected: string[];
  onToggle: (country: string) => void;
}

const DEFAULT_COUNTRIES = ["Norway", "England", "United States", "Sweden", "Denmark"];

export default function CountryFilter({ countries, selected, onToggle }: CountryFilterProps) {
  // Sorter slik at default-landene kommer forst
  const sorted = [...countries].sort((a, b) => {
    const aDefault = DEFAULT_COUNTRIES.includes(a) ? 0 : 1;
    const bDefault = DEFAULT_COUNTRIES.includes(b) ? 0 : 1;
    if (aDefault !== bDefault) return aDefault - bDefault;
    return a.localeCompare(b);
  });

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map((country) => {
        const isSelected = selected.includes(country);
        return (
          <button
            key={country}
            onClick={() => onToggle(country)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {country}
          </button>
        );
      })}
    </div>
  );
}

export { DEFAULT_COUNTRIES };
