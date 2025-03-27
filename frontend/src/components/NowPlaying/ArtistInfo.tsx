import { Radio } from "lucide-react";

interface ArtistInfoProps {
  artist: string;
  imageUrl: string;
}

export const ArtistInfo = ({ artist, imageUrl }: ArtistInfoProps) => {
  return (
    <div className="p-6 border-t border-zinc-800">
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Radio className="w-5 h-5 text-zinc-400" />
        About the Artist
      </h3>
      <div className="flex items-center gap-4 mb-4">
        <img
          src={imageUrl}
          alt={artist}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h4 className="text-white font-medium mb-1">{artist}</h4>
          <p className="text-sm text-zinc-400">Artist • 1.2M monthly listeners</p>
        </div>
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed">
        {artist} is a talented musician known for their unique style and captivating performances.
      </p>
    </div>
  );
};
