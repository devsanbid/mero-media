import axios from "axios"; 

const API_BASE_URL = "http://localhost:5000/api";

class AuthService {
  async register(userData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error("Registration failed: ", error);
    }
  }

  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const data = response.data;
      
      if (data.success && data.data.token) {
        localStorage.setItem("token", data.data.token);
      }
      return data;
    } catch (error) {
      throw new Error("Login failed: ", error);
    }
  }

  async getProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || "Failed to get profile");
    }
  }

  logout() {
    localStorage.removeItem("token");
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }
}

export default new AuthService();
