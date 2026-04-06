// Verifiserte TV-rettigheter per liga og land, sesong 2025/2026
// Kilder: premierleague.com, uefa.com, viaplaygroup.com, tvkampen.com,
// livesoccertv.com, cbssports.com, nbcsports.com, broadbandtvnews.com

export interface ChannelInfo {
  channel: string;
  type: "tv" | "streaming" | "both";
}

export interface LeagueChannels {
  [country: string]: ChannelInfo[];
}

export const LEAGUE_CHANNELS: Record<string, LeagueChannels> = {

  // ─── PREMIER LEAGUE (2025/26–2027/28) ───
  "4328": {
    "Norge": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "Sverige": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "Danmark": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "England": [
      { channel: "Sky Sports", type: "both" },
      { channel: "TNT Sports", type: "both" },
      { channel: "Amazon Prime Video", type: "streaming" },
    ],
    "USA": [
      { channel: "NBC", type: "tv" },
      { channel: "USA Network", type: "tv" },
      { channel: "Peacock", type: "streaming" },
    ],
    "Spania": [
      { channel: "DAZN", type: "streaming" },
    ],
    "Italia": [
      { channel: "Sky Sport", type: "both" },
    ],
    "Tyskland": [
      { channel: "Sky Sport", type: "both" },
    ],
  },

  // ─── ELITESERIEN (2023–2028) ───
  "4358": {
    "Norge": [
      { channel: "TV 2 Sport Premium", type: "tv" },
      { channel: "TV 2 Play Premium", type: "streaming" },
      { channel: "TV 2", type: "tv" },
    ],
  },

  // ─── CHAMPIONS LEAGUE (2024/25–2026/27) ───
  "4480": {
    "Norge": [
      { channel: "TV 2 Sport Premium", type: "tv" },
      { channel: "TV 2 Play", type: "streaming" },
    ],
    "Sverige": [
      { channel: "Viaplay", type: "streaming" },
      { channel: "TV4", type: "tv" },
    ],
    "Danmark": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "England": [
      { channel: "TNT Sports", type: "both" },
      { channel: "discovery+", type: "streaming" },
    ],
    "USA": [
      { channel: "CBS Sports", type: "tv" },
      { channel: "Paramount+", type: "streaming" },
    ],
    "Spania": [
      { channel: "Movistar+", type: "both" },
    ],
    "Italia": [
      { channel: "Amazon Prime Video", type: "streaming" },
      { channel: "Sky Sport", type: "both" },
    ],
    "Tyskland": [
      { channel: "DAZN", type: "streaming" },
      { channel: "Amazon Prime Video", type: "streaming" },
    ],
  },

  // ─── LA LIGA (2025/26) ───
  "4335": {
    "Norge": [
      { channel: "TV 2 Sport Premium", type: "tv" },
      { channel: "TV 2 Play", type: "streaming" },
      { channel: "Viaplay", type: "streaming" },
    ],
    "Sverige": [
      { channel: "TV4", type: "tv" },
      { channel: "TV4 Play", type: "streaming" },
    ],
    "Danmark": [
      { channel: "TV 2 Sport", type: "tv" },
      { channel: "TV 2 Play", type: "streaming" },
    ],
    "England": [
      { channel: "Premier Sports", type: "both" },
      { channel: "Disney+", type: "streaming" },
    ],
    "USA": [
      { channel: "ESPN", type: "tv" },
      { channel: "ESPN+", type: "streaming" },
      { channel: "ABC", type: "tv" },
    ],
    "Spania": [
      { channel: "Movistar+", type: "both" },
      { channel: "DAZN", type: "streaming" },
    ],
  },

  // ─── SERIE A (2024/25–2025/26) ───
  "4332": {
    "Norge": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "Sverige": [
      { channel: "TV4", type: "tv" },
      { channel: "TV4 Play", type: "streaming" },
    ],
    "Danmark": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "England": [
      { channel: "TNT Sports", type: "both" },
      { channel: "OneFootball", type: "streaming" },
    ],
    "USA": [
      { channel: "CBS Sports", type: "tv" },
      { channel: "Paramount+", type: "streaming" },
    ],
    "Italia": [
      { channel: "DAZN", type: "streaming" },
      { channel: "Sky Sport", type: "both" },
    ],
  },

  // ─── BUNDESLIGA (2025/26–2028/29) ───
  "4331": {
    "Norge": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "Sverige": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "Danmark": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "England": [
      { channel: "Sky Sports", type: "both" },
    ],
    "USA": [
      { channel: "ESPN+", type: "streaming" },
      { channel: "ESPN", type: "tv" },
    ],
    "Tyskland": [
      { channel: "Sky Sport", type: "both" },
      { channel: "DAZN", type: "streaming" },
    ],
  },

  // ─── LIGUE 1 (2025/26) ───
  "4334": {
    "Norge": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "Sverige": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "Danmark": [
      { channel: "Viaplay", type: "streaming" },
    ],
    "England": [
      { channel: "beIN Sports", type: "both" },
    ],
    "USA": [
      { channel: "beIN Sports", type: "both" },
      { channel: "Fubo", type: "streaming" },
    ],
    "Frankrike": [
      { channel: "DAZN", type: "streaming" },
      { channel: "beIN Sports", type: "both" },
      { channel: "Ligue 1+", type: "streaming" },
    ],
  },
};

export function getChannelsForLeague(leagueId: string): LeagueChannels {
  return LEAGUE_CHANNELS[leagueId] || {};
}
