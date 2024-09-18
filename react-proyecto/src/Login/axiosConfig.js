import axios from 'axios';

// Function to create and configure the Axios instance
// This function configures and returns an Axios instance with an interceptor
const createAxiosInstance = () => {
  const axiosInstance = axios.create({
      baseURL: 'http://localhost:3003/',
      headers: {
          'Content-Type': 'application/json',
      }
  });
  
  return axiosInstance;
};

// Create and export the Axios instance for use throughout your application
const axiosInstance = createAxiosInstance();
export default axiosInstance;
