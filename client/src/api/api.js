import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Flask backend URL
});

export const signupUser = async (data) => {
  return await API.post("/users", data, {
    headers: { "Content-Type": "application/json" },
  });
};


export const loginUser = async (userData) => {
  return await API.post("/login", userData);
};
