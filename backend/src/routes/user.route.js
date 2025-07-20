import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers, getMyFriends } from "../controllers/user.controller.js";

const router = express.Router();

//apply auth middleware to all routes in this router
router.use(protectRoute);

//get the recommended users
router.get("/", getRecommendedUsers);

router.get("/friends", getMyFriends);// Get the list of friends for the authenticated user

export default router;