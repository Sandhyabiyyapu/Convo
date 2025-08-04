import User from "../models/User.js"; // Import the User model
import FriendRequest from "../models/FriendRequest.js"; // Import the FriendRequest model

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId).select('friends');

        // Find all users with whom the current user has a pending or accepted friend request
        const outgoingRequests = await FriendRequest.find({ sender: currentUserId }).select('recipient');
        const incomingRequests = await FriendRequest.find({ recipient: currentUserId }).select('sender');

        // Collect all user IDs to exclude
        const excludeIds = [
            currentUserId,
            ...currentUser.friends.map(f => f.toString()),
            ...outgoingRequests.map(r => r.recipient.toString()),
            ...incomingRequests.map(r => r.sender.toString())
        ];

        const recommendedUsers = await User.find({
            _id: { $nin: excludeIds },
            isOnBoarded: true
        });
        res.status(200).json({ recommendedUsers });
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
        const recipientId = req.params.id; // Get the recipient's ID from the request parameters

        if (senderId === recipientId) {// Check if the sender is trying to send a request to themselves
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId); // Find the recipient user by ID
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
                { sender: senderId, recipient: recipientId }, // Check if a request from sender to recipient exists
                { sender: recipientId, recipient: senderId } // Check if a request from recipient to sender exists
            ]
        });

        if (existingRequest) { // If a request already exists, return an error
            return res.status(400).json({ message: "Friend request already exists." });
        }

        // Create a new friend request
        const newRequest = await FriendRequest.create({
            sender: senderId,
            recipient: recipientId
        });
        
        res.status(201).json(newRequest ); // Return the created friend request
    
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try{
        const {id:requestId} = req.params; // Get the request ID from the request parameters

        const friendRequest = await FriendRequest.findById(requestId); // Find the friend request by ID
        if (!friendRequest) { // Check if the friend request exists
            return res.status(404).json({ message: "Friend request not found." });
        }
        //verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user._id.toString()) { // Check if the current user is the recipient of the request
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }
        // Update the friend request status to accepted
        friendRequest.status = "accepted"; // Set the status to accepted
        await friendRequest.save(); // Save the updated friend request

        // Add each user to the other's friends array
        // Add the recipient to the sender's friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        // Add the sender to the recipient's friends list
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ message: "Friend request accepted successfully." }); // Return success message

    }catch(error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getFriendRequests(req, res) { // Find all incoming friend requests for the authenticated user
    try {
        const incomingRequests = await FriendRequest.find({ 
            recipient: req.user.id,
            status: "pending" // Only find requests that are pending
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage"); // Populate the sender field with specific fields
        
        const acceptedRequests = await FriendRequest.find({
            senderId: req.user.id,
            status: "accepted" // Only find requests that are accepted
        }).populate("recipient", "fullName profilePic "); // Populate the sender field with specific fields

        res.status(200).json({ incomingRequests, acceptedRequests }); // Return the incoming and accepted friend requests

    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
        
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending" // Only find requests that are pending
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage"); // Populate the recipient field with specific fields

        res.status(200).json(outgoingRequests); // Return the outgoing friend requests
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}