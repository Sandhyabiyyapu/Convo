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
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./Components/Layout.jsx";
import { useThemeStore } from "./Store/useThemeStore.js";
import NoFriendsFound from "./Components/NoFriendsFound.jsx";


// Loading component
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="loading loading-spinner loading-lg"></div>
  </div>
);

const App = () => {
  //tanstack query 
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser)
  const isOnBoarded = authUser?.isOnBoarded

  console.log(authUser);

  // Show loading state while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // The main application component that sets up the routes for the application
  // It uses React Router to define different pages of the application
  // Each route corresponds to a different page component
  // The Toaster component is used to display notifications throughout the app
  // The Routes component defines the different paths and their corresponding components
  // The Route component specifies the path and the component to render when that path is accessed
  return (
    <div className="h-screen" data-theme={theme}>
      
      <Routes>
        <Route path="/" element={isAuthenticated && isOnBoarded ? (
          <Layout showSidebar={true}>
            <HomePage/>
          </Layout>
        ) : (
          <Navigate to ={!isAuthenticated ? "/login" : "onboarding"}/>
        )} />
        <Route 
          path="/signup" 
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
          } 
        />
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
          } 
        />
        <Route path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
      </Routes> 
      
      <Toaster/>
    </div>
  );
};

export default App;
