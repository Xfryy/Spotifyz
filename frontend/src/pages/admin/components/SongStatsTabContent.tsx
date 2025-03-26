import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMusicStore } from "@/stores/useMusicStore";

const SongStatsTabContent = () => {
  const { songStats, fetchSongStats, isLoading, error, fetchSongPeriodStats, songPeriodStats } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("day");

  useEffect(() => {
    fetchSongStats();
  }, [fetchSongStats]);

  const handlePeriodChange = async (songId: string, period: string) => {
    if (!songPeriodStats[songId]?.[period]) {
      await fetchSongPeriodStats(songId, period);
    }
  };

  useEffect(() => {
    const fetchAllSongStats = async () => {
      for (const song of songStats) {
        if (!songPeriodStats[song._id]?.[selectedPeriod]) {
          await fetchSongPeriodStats(song._id, selectedPeriod);
        }
      }
    };
    if (songStats.length > 0) {
      fetchAllSongStats();
    }
  }, [selectedPeriod, songStats]);

  const filteredSongs = songStats.filter((song: any) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-4 text-center text-zinc-400">Loading song stats...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-400">{error}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Song Statistics</CardTitle>
          <CardDescription>Track plays for each song by period</CardDescription>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-800 p-2 text-white"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead className="text-right">Plays</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSongs.map((song: any) => (
              <TableRow key={song._id}>
                <TableCell>
                  <img src={song.imageUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
                </TableCell>
                <TableCell className="font-medium">{song.title}</TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell className="text-right">
                  {songPeriodStats[song._id]?.[selectedPeriod] ?? song.plays ?? 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SongStatsTabContent;
