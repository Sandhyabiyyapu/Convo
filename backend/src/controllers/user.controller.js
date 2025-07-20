import User from "../models/user.model.js"; // Import the User model

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