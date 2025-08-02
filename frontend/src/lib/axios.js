import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your API base URL
  withCredentials: true, // Include credentials for cross-origin requests, send the cookies with requests
});