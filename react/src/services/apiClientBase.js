import axios from "axios";

const apiClientBase = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/cms-api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiClientBase;
