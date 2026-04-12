import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface TVKampenFixture {
  title: string;
  league: string;
  date: string;
  time: string;
  channels: string[];
}

async function fetchTVKampenDate(date: string): Promise<TVKampenFixture[]> {
  const res = await fetch(`https://www.tvkampen.com/fotball/date/${date}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept-Language": "nb-NO,nb;q=0.9",
    },
  });

  if (!res.ok) return [];
  const html = await res.text();

  // Find RSC chunks with fixture data
  const chunks = html.split("self.__next_f.push");
  let fixtureData = "";
  for (const chunk of chunks) {
    if (chunk.includes("fixture_id") && chunk.includes("channels")) {
      // Unescape the RSC string
      fixtureData += chunk
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "")
        .replace(/\\t/g, "");
    }
  }

  if (!fixtureData) return [];

  const fixtures: TVKampenFixture[] = [];
  let pos = 0;
  const seen = new Set<string>();

  while (fixtures.length < 100) {
    const fi = fixtureData.indexOf("fixture_id", pos);
    if (fi === -1) break;

    const chIdx = fixtureData.indexOf("channels", fi);
    if (chIdx === -1 || chIdx - fi > 2500) {
      pos = fi + 10;
      continue;
    }

    const block = fixtureData.substring(fi, chIdx + 600);

    // Extract title
    const titleIdx = block.indexOf('"title"');
    let title = "";
    if (titleIdx > -1) {
      const tStart = block.indexOf('"', titleIdx + 8) + 1;
      const tEnd = block.indexOf('"', tStart);
      if (tStart > 0 && tEnd > tStart) title = block.substring(tStart, tEnd);
    }

    // Extract league
    const leagueIdx = block.indexOf('"league"');
    let league = "";
    if (leagueIdx > -1) {
      // Skip past "league_slug" etc
      const candidates = ['"league":"'];
      for (const c of candidates) {
        const li = block.indexOf(c, leagueIdx);
        if (li > -1) {
          const lStart = li + c.length;
          const lEnd = block.indexOf('"', lStart);
          if (lEnd > lStart) {
            const val = block.substring(lStart, lEnd);
            if (val.length > 2 && val.length < 50 && !val.includes("_") && !val.includes("/")) {
              league = val;
              break;
            }
          }
        }
      }
    }

    // Extract time from localtime
    const timeIdx = block.indexOf('"time"');
    let time = "";
    if (timeIdx > -1) {
      const tmStart = block.indexOf('"', timeIdx + 7) + 1;
      const tmEnd = block.indexOf('"', tmStart);
      if (tmStart > 0 && tmEnd > tmStart) {
        const t = block.substring(tmStart, tmEnd);
        if (t.match(/^\d{2}:\d{2}$/)) time = t;
      }
    }

    // Extract channels
    const chBlock = fixtureData.substring(chIdx, chIdx + 600);
    const endBracket = chBlock.indexOf("]");
    const channelStr = chBlock.substring(0, endBracket > 0 ? endBracket : 600);
    const channelNames: string[] = [];
    let cPos = 0;
    while (true) {
      const nIdx = channelStr.indexOf('"name"', cPos);
      if (nIdx === -1) break;
      const nStart = channelStr.indexOf('"', nIdx + 7) + 1;
      const nEnd = channelStr.indexOf('"', nStart);
      if (nStart > 0 && nEnd > nStart) {
        const name = channelStr.substring(nStart, nEnd);
        // Only include Norwegian channels (skip duplicates without NO suffix)
        if (name.includes("NO") || !channelNames.some(c => c.replace(" NO", "") === name)) {
          channelNames.push(name);
        }
      }
      cPos = nIdx + 10;
    }

    // Deduplicate: prefer "X NO" over "X"
    const deduped = channelNames.filter(name => {
      if (name.endsWith(" NO")) return true;
      return !channelNames.includes(name + " NO");
    });

    const key = `${title}-${league}`;
    if (title.length > 3 && title.length < 60 && !title.includes("_id") && !seen.has(key)) {
      seen.add(key);
      fixtures.push({ title, league, date, time, channels: deduped });
    }

    pos = fi + 10;
  }

  return fixtures;
}

// Cache
let cache: { data: Record<string, TVKampenFixture[]>; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  // If specific date requested
  if (date) {
    const fixtures = await fetchTVKampenDate(date);
    return NextResponse.json({ fixtures }, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=900" },
    });
  }

  // Default: fetch today + next 3 days
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=900" },
    });
  }

  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const result: Record<string, TVKampenFixture[]> = {};
  for (const d of dates) {
    result[d] = await fetchTVKampenDate(d);
    // Delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  cache = { data: result, timestamp: Date.now() };

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=900" },
  });
}
