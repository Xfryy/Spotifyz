import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useArtistStore } from "@/stores/useArtistStore";
import { Music, Trash2, Loader2 } from "lucide-react";
import { useEffect, useCallback } from "react";

const ArtistsTable = () => {
  const { stats, isLoading, fetchArtists, fetchArtistStats, deleteArtist } = useArtistStore();

  const loadData = useCallback(() => {
    fetchArtists();
    fetchArtistStats();
  }, [fetchArtists, fetchArtistStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="text-center py-8">
        <Music className="h-12 w-12 mx-auto text-zinc-600 mb-3" />
        <p className="text-zinc-400">No artists found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-zinc-800/50'>
          <TableHead className='w-[50px]'></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Bio</TableHead>
          <TableHead>Total Songs</TableHead>
          <TableHead>Total Albums</TableHead>
          <TableHead>Total Plays</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((artist) => (
          <TableRow key={artist._id} className='hover:bg-zinc-800/50'>
            <TableCell>
              <img
                src={artist.imageUrl}
                alt={artist.fullName}
                className='w-10 h-10 rounded-full object-cover'
              />
            </TableCell>
            <TableCell className='font-medium'>{artist.fullName}</TableCell>
            <TableCell className='max-w-xs truncate text-zinc-400'>{artist.bio}</TableCell>
            <TableCell>
              <span className='inline-flex items-center gap-1 text-zinc-400'>
                <Music className='h-4 w-4' />
                {artist.totalSongs} songs
              </span>
            </TableCell>
            <TableCell>
              <span className='text-zinc-400'>{artist.totalAlbums} albums</span>
            </TableCell>
            <TableCell>
              <span className='text-zinc-400'>{(artist.totalPlays ?? 0).toLocaleString()} plays</span>
            </TableCell>
            <TableCell className='text-right'>
              <div className='flex gap-2 justify-end'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this artist?")) {
                      deleteArtist(artist._id);
                    }
                  }}
                  className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArtistsTable;
