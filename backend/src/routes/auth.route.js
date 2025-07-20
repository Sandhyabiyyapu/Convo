import express from "express"
import { signup, login, logout, onboard} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)

//Check if user is logged in or not
// This route can be used to check if the user is authenticated
router.get("/me", protectRoute, (req, res) => {
    // This route can be used to get the authenticated user's information
    res.status(200).json({ success : true, user: req.user })
})

export default router