import mongoose from 'mongoose';
import dotenv from 'dotenv';
export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);// Connect to MongoDB using the URI from environment variables
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    }
    catch(error){
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit the process with failure
    }
}