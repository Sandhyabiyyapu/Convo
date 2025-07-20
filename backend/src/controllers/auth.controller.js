import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
