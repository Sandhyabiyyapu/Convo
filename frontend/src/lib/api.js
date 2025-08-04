import { axiosInstance } from "./axios";

export const signup = async (signUpData) => {
    const response = await axiosInstance.post("auth/signup", signUpData);
    return response.data;
}

export const getAuthUser = async () => {
    const res = await axiosInstance.get("/auth/me"); // Fetching data from an API endpoint
    return res.data;
}

export const completeOnboarding = async(userData) => {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
}