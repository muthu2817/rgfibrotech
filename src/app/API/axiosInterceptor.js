import axios from 'axios';

let getAuthToken = null;

export const setAuthTokenGetter = (fn) => {
  getAuthToken = typeof fn === 'function' ? fn : null;
};

const axiosInstance = axios.create({
  //baseURL: 'http://192.168.1.2:3030/api/v1',
  baseURL: 'https://rgf-api.infantsurya.in/api/v1',
});

// interceptor for token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken ? getAuthToken() : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

