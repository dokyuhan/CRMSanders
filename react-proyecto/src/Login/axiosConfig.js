import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3003/',
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(async (config) => {
    // Optional: Add a slight delay to ensure token storage
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    const token = localStorage.getItem('token');
    console.log("Token being added to request:", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn("No token available at the time of request.");
    }
    return config;
  }, error => {
    console.log("Error in request config:", error);
    return Promise.reject(error);
  });

export default axiosInstance;