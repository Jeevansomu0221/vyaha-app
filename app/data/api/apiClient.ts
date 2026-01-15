import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: "http://10.3.54.24:5000/api",
});

// Simple interceptor without complex types
API.interceptors.request.use(
  async (config: any) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${user.token}`
          };
        }
      }
    } catch (error) {
      console.error('Error adding auth token:', error);
    }
    return config;
  }
);

export default API;