export interface SportsEvent {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strSeason: string;
  strHomeTeam: string;
  strAwayTeam: string;
  dateEvent: string;
  strTime: string;
  strThumb: string | null;
  strBanner: string | null;
  intHomeScore: string | null;
  intAwayScore: string | null;
  intRound: string | null;
  strHomeTeamBadge?: string | null;
  strAwayTeamBadge?: string | null;
}

export interface TVListing {
  idChannel: string;
  strCountry: string;
  strChannel: string;
  strLogo: string | null;
  strTime: string;
  dateEvent: string;
  strEvent: string;
  strLeague: string;
  strSeason: string;
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  country: string;
  badge?: string;
}

export const LEAGUES: League[] = [
  { id: "4358", name: "Eliteserien", shortName: "Eliteserien", country: "Norge" },
  { id: "4328", name: "English Premier League", shortName: "Premier League", country: "England" },
  { id: "4480", name: "UEFA Champions League", shortName: "Champions League", country: "Europa" },
  { id: "4335", name: "Spanish La Liga", shortName: "La Liga", country: "Spania" },
  { id: "4332", name: "Italian Serie A", shortName: "Serie A", country: "Italia" },
  { id: "4331", name: "German Bundesliga", shortName: "Bundesliga", country: "Tyskland" },
  { id: "4334", name: "French Ligue 1", shortName: "Ligue 1", country: "Frankrike" },
];

export const CURRENT_SEASONS: Record<string, string> = {
  "4358": "2026",
  "4328": "2025-2026",
  "4480": "2025-2026",
  "4335": "2025-2026",
  "4332": "2025-2026",
  "4331": "2025-2026",
  "4334": "2025-2026",
};

export const DEFAULT_COUNTRIES = ["Norway", "United Kingdom", "United States", "Sweden", "Denmark"];
