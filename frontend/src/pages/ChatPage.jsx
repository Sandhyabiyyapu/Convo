import React from "react";
import { useEffect, useState } from "react"; // React hooks for state and effect management
import { useParams } from "react-router-dom"; // For getting user ID from route
import useAuthUser from "../hooks/useAuthUser"; // Custom hook to get authenticated user
import { useQuery } from "@tanstack/react-query"; // React Query for data fetching
import { getStreamToken } from "../lib/api"; // API call to get chat token

// Stream Chat UI components
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat"; // StreamChat JS SDK
import toast from "react-hot-toast"; // For notifications

import ChatLoader from "../Components/ChatLoader"; // Loader for chat
import CallButton from "../Components/CallButton"; // Button to start video call

// Get Stream API key from environment
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// ChatPage component: handles chat between two users using Stream Chat
const ChatPage = () => {
  // Get the target user's ID from the route
  const { id: targetUserId } = useParams();

  // State for chat client, channel, and loading status
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get authenticated user info
  const { authUser } = useAuthUser();

  // Fetch Stream token for chat authentication
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // Only run if user is authenticated
  });

  // Initialize chat client and channel when token and user are available
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        // Create Stream chat client instance
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Connect the authenticated user to Stream
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // Generate a unique channel ID for the two users
        // Sorting ensures the same channel for both users
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // Create or get the messaging channel for these users
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        // Start watching the channel for new messages
        await currChannel.watch();

        // Save client and channel to state
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  // Handle starting a video call by sending a call link in chat
  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  // Show loader while chat client/channel are initializing
  if (loading || !chatClient || !channel) return <ChatLoader />;

  // Render chat UI using Stream Chat components
  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            {/* Button to start video call */}
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;