import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import NavigationMenu from "./NavigationMenu";
import LibrarySection from "./LibrarySection";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import { usePlaylistStore } from "@/stores/usePlaylistStore";

const LeftSidebar = () => {
    const { fetchPlaylists } = usePlaylistStore();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const { isSignedIn } = useUser();

    useEffect(() => {
        if (isSignedIn) {
            fetchPlaylists();
        }
    }, [fetchPlaylists, isSignedIn]);

    return (
        <div className='h-full flex flex-col gap-2 bg-black'>
            <NavigationMenu />
            <LibrarySection setShowModal={setShowCreateDialog} />
            <CreatePlaylistDialog 
                isOpen={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
            />
        </div>
    );
};

export default LeftSidebar;