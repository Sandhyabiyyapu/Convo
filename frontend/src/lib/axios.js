import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  withCredentials: true, // Include credentials for cross-origin requests, send the cookies with requests
});