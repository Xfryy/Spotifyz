const PlaylistGridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-zinc-800/40 rounded-md p-4 animate-pulse">
          <div className="aspect-square w-full bg-zinc-700 rounded-md mb-4" />
          <div className="h-4 w-3/4 bg-zinc-700 rounded mb-2" />
          <div className="h-3 w-1/2 bg-zinc-700 rounded" />
        </div>
      ))}
    </div>
  );
};

export default PlaylistGridSkeleton;
