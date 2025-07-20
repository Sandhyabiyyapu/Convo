import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest} from "../controllers/user.controller.js";

const router = express.Router();

//apply auth middleware to all routes in this router
router.use(protectRoute);

//get the recommended users
router.get("/", getRecommendedUsers);

router.get("/friends", getMyFriends);// Get the list of friends for the authenticated user

router.post("/friend-request/:id", sendFriendRequest); // Send a friend request to a user by ID

router.put("/friend-request/:id/accept", acceptFriendRequest); // Accept a friend request from a user by ID

export default router;