import { User } from "@/types";
import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { Search, HeadphonesIcon, MessageSquare } from "lucide-react";
import { useState, useCallback, memo, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

// Added explicit types for UserItem props
interface UserItemProps {
  user: User;
  isActive: boolean;
  isOnline: boolean;
  isListening: boolean;
  activity: string;
  onSelect: () => void;
}

// UserItem with deep equality check to prevent re-renders
const UserItem = memo(
  ({ user, isActive, isOnline, isListening, activity, onSelect }: UserItemProps) => {
    return (
      <div
        onClick={onSelect}
        className={`flex items-center lg:justify-start gap-3 p-3 rounded-lg cursor-pointer transition-colors
          ${isActive ? "bg-zinc-800 hover:bg-zinc-800" : "hover:bg-zinc-800/70"}`}
      >
        <div className="relative">
          <Avatar className="w-10 h-10 border border-zinc-800/80">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          </Avatar>

          {/* Online/activity indicator */}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-zinc-900
              ${isListening ? "bg-spotify-green" : isOnline ? "bg-emerald-500" : "bg-zinc-600"}`}
          >
            {isListening && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="block w-1.5 h-1.5 rounded-full bg-black"></span>
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 lg:block hidden">
          <div className="font-medium truncate">{user.fullName}</div>
          {isListening && (
            <div className="text-xs text-spotify-green truncate mt-0.5">
              {activity.replace("Playing ", "").split(" by ")[0]}
            </div>
          )}
        </div>
      </div>
    );
  },
  // Deep equality check for all props to prevent unnecessary re-renders
  (prevProps, nextProps) => {
    return (
      prevProps.user._id === nextProps.user._id &&
      prevProps.isActive === nextProps.isActive &&
      prevProps.isOnline === nextProps.isOnline &&
      prevProps.isListening === nextProps.isListening &&
      prevProps.activity === nextProps.activity
    );
  }
);

UserItem.displayName = "UserItem";

const UsersList = () => {
  // Prevents re-fetching users on each render
  const { 
    users: storeUsers, 
    selectedUser, 
    isLoading, 
    setSelectedUser, 
    onlineUsers, 
    userActivities 
  } = useChatStore();
  
  // Cache the initial users to prevent re-renders
  const usersRef = useRef(storeUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);

  // Only update the reference if the update flag is set
  useEffect(() => {
    if (shouldUpdate) {
      usersRef.current = storeUsers;
      setShouldUpdate(false);
    }
  }, [storeUsers, shouldUpdate]);

  // Force update users list manually when needed
  const forceUpdateUsersList = useCallback(() => {
    setShouldUpdate(true);
  }, []);

  // Only compute filtered users when search term changes
  const filteredUsers = useMemo(() => {
    const currentUsers = usersRef.current || [];
    if (searchTerm === "") return currentUsers;
    
    return currentUsers.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, usersRef.current]);

  // Memoized search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Stable selection handler
  const handleUserSelect = useCallback((user: User) => {
    setSelectedUser(user);
  }, [setSelectedUser]);

  return (
    <div className="border-r border-zinc-800/70 bg-zinc-900 h-full flex flex-col">
      <div className="p-4 border-b border-zinc-800/70">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search friends"
            className="bg-zinc-800 border-none pl-10 h-9 focus-visible:ring-1 focus-visible:ring-spotify-green/50"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center mt-4 gap-2">
          <div className="flex-1 flex items-center gap-1.5 py-1 px-3 bg-zinc-800/50 rounded-full text-zinc-300 text-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Messages</span>
          </div>
          <div 
            className="flex-1 flex items-center gap-1.5 py-1 px-3 bg-zinc-800/50 rounded-full text-zinc-300 text-xs cursor-pointer"
            onClick={forceUpdateUsersList}
          >
            <HeadphonesIcon className="w-3.5 h-3.5" />
            <span>Active</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {isLoading ? (
              <UsersListSkeleton />
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isActive = selectedUser?.clerkId === user.clerkId;
                const isOnline = onlineUsers.has(user.clerkId);
                const activity = userActivities.get(user.clerkId);
                const isListening = Boolean(activity && activity !== "Idle");

                return (
                  <UserItem
                    key={user._id}
                    user={user}
                    isActive={isActive}
                    isOnline={isOnline}
                    isListening={isListening}
                    activity={activity || ""}
                    onSelect={() => handleUserSelect(user)}
                  />
                );
              })
            ) : (
              <div className="p-4 text-center text-zinc-500 text-sm">
                No users found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

// Export with memo to prevent parent re-renders from affecting this component
export default memo(UsersList);