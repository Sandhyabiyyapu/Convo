import User from "../models/user.model.js"; // Import the User model
import FriendRequest from "../models/FriendRequest.js"; // Import the FriendRequest model

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id; // Get the authenticated user's ID from the request object, _id can also be used
        const currentUser = req.user; // Get the authenticated user object from the request

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude the current user
                { _id: { $nin: currentUser.friends } } ,// Exclude users who are already friends
                {isOnBoardes: true} // Only include users who have completed onboarding
            ]
        })
        res.status(200).json({recommendedUsers}); // Return the recommended users
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id) // Find the user by ID and populate the friends field, excluding password and version
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage") // Populate the friends field with specific fields
            .select("friends"); // Select only the friends field

            res.status(200).json(user.friends); // Return the list of friends   
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const senderId = req.user._id; // Get the sender's ID from the request object
        const receiverId = req.params.id; // Get the receiver's ID from the request parameters

        if (senderId === receiverId) {// Check if the sender is trying to send a request to themselves
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(receiverId); // Find the recipient user by ID
        if (!recipient) { // Check if the recipient exists
            return res.status(404).json({ message: "Recipient not found." });
        }   

        // Check if a user is already friends with the recipient
        if(recipient.friends.includes(senderId)) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        // Check if a friend request already exists between the sender and recipient
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId }, // Check if a request from sender to receiver exists
                { sender: receiverId, receiver: senderId } // Check if a request from receiver to sender exists
            ]
        });

        if (existingRequest) { // If a request already exists, return an error
            return res.status(400).json({ message: "Friend request already exists." });
        }

        // Create a new friend request
        const newRequest = new FriendRequest.create({
            sender: senderId,
            receiver: receiverId
        });
        
        res.status(201).json(newRequest ); // Return the created friend request
    
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}