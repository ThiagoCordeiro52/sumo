import axios from "axios";

const baseURL = "http://localhost:8004/stocks";

export const axiosInstance = axios.create({
    baseURL
  });