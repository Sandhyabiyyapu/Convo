import { axiosInstance } from "./axios";

/**
 * API Service Layer - Centralized HTTP request functions
 * 
 * This file contains all API functions for communicating with the backend server.
 * Each function handles a specific endpoint and provides consistent error handling
 * and data formatting. All functions use the configured axiosInstance for
 * automatic request/response interceptors and base URL configuration.
 */

/**
 * User Registration - Creates a new user account
 * 
 * @param {Object} signUpData - User registration data (email, password, fullName)
 * @returns {Promise<Object>} Response data containing user information and success status
 * @throws {Error} If registration fails (email exists, validation errors, etc.)
 */
export const signup = async (signUpData) => {
    const response = await axiosInstance.post("auth/signup", signUpData);
    return response.data;
}

/**
 * Get Authenticated User - Fetches current user's profile data
 * 
 * This function is used to check if a user is authenticated and get their
 * profile information. It's called on app initialization and when auth state
 * needs to be verified.
 * 
 * @returns {Promise<Object|null>} User data if authenticated, null if not authenticated
 * @throws {Error} If the request fails (network error, server error, etc.)
 */
export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null; // Return null instead of throwing to handle unauthenticated users gracefully
      }
}

/**
 * Complete Onboarding - Updates user profile with onboarding information
 * 
 * This function is called when a user completes their profile setup during
 * the onboarding process. It updates the user's profile and sets isOnBoarded
 * to true in the database.
 * 
 * @param {Object} userData - Onboarding data (fullName, bio, nativeLanguage, learningLanguage, location)
 * @returns {Promise<Object>} Updated user data with onboarding completed
 * @throws {Error} If onboarding fails (validation errors, server error, etc.)
 */
export const completeOnboarding = async(userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
}

/**
 * User Login - Authenticates user and creates session
 * 
 * @param {Object} loginData - Login credentials (email, password)
 * @returns {Promise<Object>} Response data containing user information and success status
 * @throws {Error} If login fails (invalid credentials, user not found, etc.)
 */
export const login = async (loginData) => {
    const response = await axiosInstance.post("auth/login", loginData);
    return response.data;
}

/**
 * User Logout - Ends user session and clears authentication
 * 
 * This function calls the backend logout endpoint to invalidate the session
 * and clear any server-side authentication tokens. The frontend should also
 * clear local storage and redirect to login page after calling this function.
 * 
 * @returns {Promise<Object>} Response data confirming logout success
 * @throws {Error} If logout fails (network error, server error, etc.)
 */
export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};