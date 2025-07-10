// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000',
//   withCredentials: true,
// });

// export const predictFVC = async (formData) => {
//   try {
//     const response = await api.post('/api/predict', formData);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true,
});

export const predictFVC = async (formData) => {
  try {
    const response = await api.post('/api/predict', formData);
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ NEW: Fetch FVC history
export const fetchFVCGraphHistory = async (email) => {
  try {
    const response = await api.get(`/api/fvc-history?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch FVC history:", error);
    return [];
  }
};
