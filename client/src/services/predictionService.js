import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true,
});

export const predictFVC = async (formData) => {
  try {
    const response = await api.post('/api/predict', formData, {withCredentials: true});
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchFVCGraphHistory = async (email) => {
  try {
    const response = await api.get(`/api/fvc-history?email=${email}`,{withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Failed to fetch FVC history:", error);
    return [];
  }
};
