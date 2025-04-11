import axios from "axios";

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const profitService = {
  async createProfit(profitData) {
    const response = await api.post("data/profit", profitData);
    return response.data;
  },
  async getProfits() {
    const response = await api.get("data/profit");
    return response.data;
  },
  async deleteProfit(id) {
    const response = await api.delete(`data/profit/${id}`);
    return response.data;
  },
};

export default api;
