import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
  console.error("Strem API key or Secret is missing in environment variables.");
}

// Initialize StreamChat client with API key and secret
const streamClient = StreamChat.getInstance(apiKey, apiSecret);// Initialize StreamChat client with API key and secret

// Function to create or update a user in StreamChat
// This function will be used to sync user data with StreamChat when a user signs up or logs in
export const upsertStreamUser = async (userData) => {// Function to create or update a user in StreamChat
    try {
        await streamClient.upsertUser(userData); // Pass userData directly
        console.log(`Stream user upserted: ${userData.id}`);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
}

// Function to generate a StreamChat token for a user
export const generateStreamToken = (userId) => {
    try {
        //ensure user id is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr); // Generate a token for the user
    } catch (error) {
        console.error("Error generating Stream token:", error);
        throw new Error("Failed to generate Stream token");
        
    }
}// Function to generate a StreamChat token for a user