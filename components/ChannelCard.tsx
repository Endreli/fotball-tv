import { TVListing } from "@/types";
import Image from "next/image";

interface ChannelCardProps {
  listing: TVListing;
}

export default function ChannelCard({ listing }: ChannelCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
      {listing.strLogo ? (
        <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-white/10">
          <Image
            src={listing.strLogo}
            alt={listing.strChannel}
            fill
            className="object-contain p-1"
            unoptimized
          />
        </div>
      ) : (
        <div className="w-10 h-10 shrink-0 bg-white/5 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm truncate">
          {listing.strChannel}
        </p>
        <p className="text-xs text-gray-500">
          kl. {listing.strTime ? listing.strTime.substring(0, 5) : "—"}
        </p>
      </div>
    </div>
  );
}
