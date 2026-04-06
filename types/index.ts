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
