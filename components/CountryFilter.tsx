"use client";

interface CountryFilterProps {
  countries: string[];
  selected: string[];
  onToggle: (country: string) => void;
}

export default function CountryFilter({ countries, selected, onToggle }: CountryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {countries.map((country) => {
        const isSelected = selected.includes(country);
        return (
          <button
            key={country}
            onClick={() => onToggle(country)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            {country}
          </button>
        );
      })}
    </div>
  );
}
