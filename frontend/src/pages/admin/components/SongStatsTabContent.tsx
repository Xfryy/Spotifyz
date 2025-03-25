import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMusicStore } from "@/stores/useMusicStore";

const SongStatsTabContent = () => {
  const { songStats, fetchSongStats, isLoading, error, fetchSongPeriodStats, currentSongPeriodStats } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("day");
  const [selectedSongId, setSelectedSongId] = useState("");

  useEffect(() => {
    fetchSongStats();
  }, [fetchSongStats]);

  const handlePeriodChange = async (songId: string, period: string) => {
    setSelectedSongId(songId);
    setSelectedPeriod(period);
    await fetchSongPeriodStats(songId, period);
  };

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
      <CardHeader>
        <CardTitle>Song Statistics</CardTitle>
        <CardDescription>Track plays for each song by period</CardDescription>
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
              <TableHead>Period</TableHead>
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
                <TableCell>
                  <Select
                    value={selectedSongId === song._id ? selectedPeriod : 'day'}
                    onValueChange={(value) => handlePeriodChange(song._id, value)}
                  >
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
                </TableCell>
                <TableCell className="text-right">
                  {selectedSongId === song._id && currentSongPeriodStats
                    ? currentSongPeriodStats.plays
                    : song.plays || 0}
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
