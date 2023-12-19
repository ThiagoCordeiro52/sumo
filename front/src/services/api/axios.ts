import axios from "axios";

const baseURL = "http://localhost:9002/stocks";

export const axiosInstance = axios.create({
    baseURL
  });