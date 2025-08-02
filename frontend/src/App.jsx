import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import {Toaster} from "react-hot-toast";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { axiosInstance } from './lib/axios.js'; // Import the axios instance

const App = () => {
  //tanstack query 
  const{data:authData, isLoading, error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me"); // Fetching data from an API endpoint
        return res.data;
      } catch (error) {
        // If the user is not authenticated, this is expected
        if (error.response?.status === 401) {
          return { user: null };
        }
        throw error;
      }
    },
    retry: false, //auth checks don't need retries
  });
  
const authUser = authData?.user;

  console.log(authData);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // The main application component that sets up the routes for the application
  // It uses React Router to define different pages of the application
  // Each route corresponds to a different page component
  // The Toaster component is used to display notifications throughout the app
  // The Routes component defines the different paths and their corresponding components
  // The Route component specifies the path and the component to render when that path is accessed
  return (
    <div className="h-screen" data-theme="night">
      
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
      </Routes> 
      
      <Toaster/>
    </div>
  );
};

export default App;
