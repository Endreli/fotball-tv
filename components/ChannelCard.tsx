import { TVListing } from "@/types";
import Image from "next/image";

interface ChannelCardProps {
  listing: TVListing;
}

export default function ChannelCard({ listing }: ChannelCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
      {listing.strLogo ? (
        <div className="relative w-10 h-10 shrink-0">
          <Image
            src={listing.strLogo}
            alt={listing.strChannel}
            fill
            className="object-contain rounded"
            unoptimized
          />
        </div>
      ) : (
        <div className="w-10 h-10 shrink-0 bg-gray-100 rounded flex items-center justify-center">
          <span className="text-gray-400 text-xs">TV</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">
          {listing.strChannel}
        </p>
        <p className="text-xs text-gray-500">
          {listing.dateEvent} kl. {listing.strTime}
        </p>
      </div>
    </div>
  );
}
