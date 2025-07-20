import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { upsertStreamUser } from '../lib/stream.js'; // Assuming you have a function to sync user with StreamChat

export async function signup(req, res) {// Signup function to handle user registration
  // Extract email, password, and fullName from the request body
  const{email, password, fullName} =  req.body;

  try{

    if(!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    } 

    if(password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    if(!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if(existingUser) {
      return res.status(400).json({ message: "email already exists, please use another email" });
    }
    
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    // Do NOT hash the password here; let Mongoose pre-save hook handle it
    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: randomAvatar
    });

    //Create the user in stream as well
    // This is where you would call the upsertStreamUser function to sync user data with StreamChat
    try{
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });// Pass the necessary user data to upsertStreamUser
      console.log(`Stream user created for ${newUser.fullName}`);
    }catch (error) {
      console.log("error creating stream user:", error);
    }

    const token=jwt.sign({userId:newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});// Create a JWT token for the new user
    // Set the JWT token in a cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json({success: true, user:newUser});

  }catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}   

// Login function to handle user authentication
// This function checks if the user exists, verifies the password, and returns a JWT token if
export async function login(req, res) {// Login function to handle user authentication
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Verify the password using bcrypt
    // The matchPassword method is defined in the User model to compare the entered password with the stored hashed password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// Logout function to handle user logout
// This function clears the JWT cookie to log out the user
export function logout(req, res) {// Logout function to handle user logout
  // Clear the JWT cookie to log out the user
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
}   

export async function onboard(req, res) {
  // This function can be used to handle user onboarding logic
  try{
    const userId = req.user._id; // Get the user ID from the request object
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body; // Extract additional user data from the request body

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ 
        message: "All fields are required" ,
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location" 
        ].filter(Boolean) // Filter out any undefined fields ,
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, {// Update the user with the provided data
      ...req.body, // Spread the request body to update the user with the provided data
      isOnboarded: true // Set isOnboarded to true to indicate that the user has completed onboarding
    }, { new: true}); // Update the user with the provided data
    // The select method is used to exclude the password and version fields from the response
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    //Update the user in StreamChat as well
    try{
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });// Pass the necessary user data to upsertStreamUser
      console.log(`Stream user updated for onboarding ${updatedUser.fullName}`);
    }catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }
    

    res.status(200).json({ success: true, user: updatedUser });// Return the updated user data in the response
  }catch (error) {
    console.error("Error during onboarding:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}