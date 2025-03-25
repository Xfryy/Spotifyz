// D:\Spotifyz\frontend\src\pages\search\components\NoResults.tsx
import { Search } from "lucide-react";

interface NoResultsProps {
  query: string;
}

const NoResults = ({ query }: NoResultsProps) => {
  return (
    <div className="text-center py-16">
      <div className="mb-4 enchanted-empty-animation">
        <Search className="mx-auto h-12 w-12 text-indigo-500" />
      </div>
      <p className="text-indigo-300 text-lg font-medium">No magic found for "{query}"</p>
      <p className="text-zinc-500 mt-2">Try another spell or check your incantation</p>
    </div>
  );
};

export default NoResults;