import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7208",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth
export const register = (data) => api.post("/api/Auth/register", data);
export const login = (data) => api.post("/api/Auth/login", data);
export const getMe = () => api.get("/api/Auth/me");

// Admin
export const getPendingOwners = () => api.get("/api/Admin/pending-owners");
export const manageOwner = (id, data) => api.post(`/api/Admin/manage-owner/${id}`, data);

// Cars
export const addCar = (data) => api.post("/api/Cars", data);
export const manageCar = (id, data) => api.patch(`/api/Cars/manage-post/${id}`, data);
export const deleteCar = (id) => api.delete(`/api/Cars/${id}`);

// Browsing
export const getAllCars = () => api.get("/api/Browsing/all");
export const getFilteredCars = () => api.get("/api/Browsing/filter");
export const getCarById = (id) => api.get(`/api/Browsing/${id}`);

// Booking
export const requestBooking = (data) => api.post("/api/Booking/request", data);
export const getOwnerBookings = () => api.get("/api/Booking/owner");
export const respondBooking = (id, data) => api.patch(`/api/Booking/${id}/respond`, data);
export const completeBooking = (id) => api.patch(`/api/Booking/${id}/complete`);

export default api;
