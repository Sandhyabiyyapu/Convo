import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // React Query hooks for data fetching and mutation
import { useEffect, useState } from "react"; // React hooks for state and effect management
import {
  getOutgoingFriendReqs,   // API call to get outgoing friend requests
  getRecommendedUsers,     // API call to get recommended users
  getUserFriends,          // API call to get user's friends
  sendFriendRequest        // API call to send a friend request
} from "../lib/api";
import { Link } from "react-router-dom"; // Link for navigation
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react"; // Icons for UI
import { capitialize } from "../lib/utils"; // Utility for language capitalization
import FriendCard, { getLanguageFlag } from "../Components/FriendCard"; // FriendCard component and language flag utility
import NoFriendsFound from "../Components/NoFriendsFound"; // Component to show when no friends are found
// Import custom hook to get authenticated user
import useAuthUser from "../hooks/useAuthUser";

// HomePage component: main dashboard for friends and recommendations
const HomePage = () => {
  // Get authenticated user info
  const { authUser } = useAuthUser();
  // React Query client for cache management
  const queryClient = useQueryClient();
  // Track outgoing friend requests to disable buttons
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // Fetch user's friends from backend (only if authenticated)
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser, // Only run if user is authenticated
  });

  // Fetch recommended users (not friends, no pending requests)
  const { data: recommendedUsersRaw, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  });
  // Extract recommended users array from backend response
  const recommendedUsers = Array.isArray(recommendedUsersRaw?.recommendedUsers)
    ? recommendedUsersRaw.recommendedUsers
    : [];

  // Fetch outgoing friend requests (to disable request button)
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    enabled: !!authUser, // Only run if user is authenticated
  });

  // Mutation for sending friend requests
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }), // Refetch outgoing requests after sending
  });

  // Track outgoing friend requests to disable request button for users who already have a pending request
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient && req.recipient._id) {
          outgoingIds.add(req.recipient._id);
        }
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // If user is not authenticated, show loading spinner
  if (!authUser) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  // Render the HomePage UI
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Friends Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          {/* Link to notifications page for friend requests */}
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Show loading spinner while friends are loading */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          // Show message if no friends are found
          <NoFriendsFound />
        ) : (
          // Display friends using FriendCard component
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Users Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {/* Show loading spinner while recommended users are loading */}
          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            // Show message if no recommended users are found
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            // Display recommended users with friend request button
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                // Check if a friend request has already been sent to this user
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {/* Show location if available */}
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {/* Show bio if available */}
                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Friend request button: disables if already sent or pending */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;