import axios from "axios";

const baseURL = "localhost:9000/api/v1";

export const axiosInstance = axios.create({
    baseURL
  });