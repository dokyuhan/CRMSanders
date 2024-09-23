import axios from 'axios';

const createAxiosInstance = () => {
  const axiosInstance = axios.create({
      baseURL: 'https://localhost:3003/',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
  });
  
  return axiosInstance;
};

// Create and export the Axios instance for use throughout your application
const axiosInstance = createAxiosInstance();
export default axiosInstance;
