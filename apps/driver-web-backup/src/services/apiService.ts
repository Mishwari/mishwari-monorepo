import axios from 'axios';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


const API_BASE_URL = 'http://192.168.178.163:8000/api';

const apiClient = axios.create({
    baseURL: apiBaseUrl,
  });
  
  export const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post('token/', {
        username,
        password,
      });
  
      return response.data; //response should have jwt token
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Login failed');
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };