// Kjente TV-rettigheter per liga og land (2025/2026-sesongen)
// Disse er statiske og oppdateres manuelt ved sesongstart

export interface ChannelInfo {
  channel: string;
  logo?: string;
}

export interface LeagueChannels {
  [country: string]: ChannelInfo[];
}

export const LEAGUE_CHANNELS: Record<string, LeagueChannels> = {
  // Premier League
  "4328": {
    "Norge": [
      { channel: "TV 2 Sport Premium" },
      { channel: "TV 2 Play" },
    ],
    "Sverige": [
      { channel: "Viaplay" },
      { channel: "TV4 Play" },
    ],
    "Danmark": [
      { channel: "Viaplay" },
      { channel: "TV 2 Sport" },
    ],
    "England": [
      { channel: "Sky Sports" },
      { channel: "TNT Sports" },
      { channel: "Amazon Prime Video" },
    ],
    "USA": [
      { channel: "NBC Sports" },
      { channel: "Peacock" },
      { channel: "USA Network" },
    ],
  },
  // Eliteserien
  "4358": {
    "Norge": [
      { channel: "TV 2 Sport Premium" },
      { channel: "TV 2 Play" },
      { channel: "TV 2 Direkte" },
    ],
  },
  // Champions League
  "4480": {
    "Norge": [
      { channel: "TV 2 Sport Premium" },
      { channel: "TV 2 Play" },
    ],
    "Sverige": [
      { channel: "TV4" },
      { channel: "TV4 Play" },
    ],
    "Danmark": [
      { channel: "Viaplay" },
    ],
    "England": [
      { channel: "TNT Sports" },
      { channel: "Discovery+" },
    ],
    "USA": [
      { channel: "Paramount+" },
      { channel: "CBS Sports" },
    ],
  },
  // La Liga
  "4335": {
    "Norge": [
      { channel: "TV 2 Sport Premium" },
      { channel: "TV 2 Play" },
    ],
    "Sverige": [
      { channel: "C More" },
    ],
    "Danmark": [
      { channel: "TV 2 Sport" },
      { channel: "TV 2 Play" },
    ],
    "England": [
      { channel: "Premier Sports" },
      { channel: "LaLigaTV" },
    ],
    "USA": [
      { channel: "ESPN+" },
      { channel: "ESPN Deportes" },
    ],
    "Spania": [
      { channel: "Movistar+" },
      { channel: "DAZN" },
    ],
  },
  // Serie A
  "4332": {
    "Norge": [
      { channel: "Viaplay" },
    ],
    "Sverige": [
      { channel: "Viaplay" },
    ],
    "Danmark": [
      { channel: "Viaplay" },
    ],
    "England": [
      { channel: "TNT Sports" },
      { channel: "Discovery+" },
    ],
    "USA": [
      { channel: "Paramount+" },
      { channel: "CBS Sports" },
    ],
    "Italia": [
      { channel: "DAZN" },
      { channel: "Sky Sport" },
    ],
  },
  // Bundesliga
  "4331": {
    "Norge": [
      { channel: "Viaplay" },
    ],
    "Sverige": [
      { channel: "Viaplay" },
    ],
    "Danmark": [
      { channel: "Viaplay" },
    ],
    "England": [
      { channel: "Sky Sports" },
    ],
    "USA": [
      { channel: "ESPN+" },
    ],
    "Tyskland": [
      { channel: "Sky Sport" },
      { channel: "DAZN" },
    ],
  },
  // Ligue 1
  "4334": {
    "Norge": [
      { channel: "Viaplay" },
    ],
    "Sverige": [
      { channel: "Viaplay" },
    ],
    "Danmark": [
      { channel: "Viaplay" },
    ],
    "England": [
      { channel: "beIN Sports" },
    ],
    "USA": [
      { channel: "beIN Sports" },
      { channel: "Fubo" },
    ],
    "Frankrike": [
      { channel: "DAZN" },
      { channel: "beIN Sports" },
    ],
  },
};

export function getChannelsForLeague(leagueId: string): LeagueChannels {
  return LEAGUE_CHANNELS[leagueId] || {};
}
