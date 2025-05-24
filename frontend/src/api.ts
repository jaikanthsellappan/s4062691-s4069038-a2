// src/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api", // Or your backend URL
});

export default API;
