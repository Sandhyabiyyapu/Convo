import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"

import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"

dotenv.config()// Load environment variables from .env file

const app = express()// Create an Express application
// Set the port from environment variables or default to 3000
const PORT = process.env.PORT// Set the port from environment variables or default to 3000

app.use(express.json())// Middleware to parse JSON request bodies
app.use(cookieParser())// Middleware to parse cookies from request headers
app.use("/api/auth", authRoutes)// Use the authRoutes for handling authentication-related routes
app.use("/api/users", userRoutes)// Use the userRoutes for handling user-related routes
app.use("/api/chat", chatRoutes)// Use the chatRoutes for handling chat-related routes

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB();// Connect to the MongoDB database
  console.log("Connected to MongoDB")
})