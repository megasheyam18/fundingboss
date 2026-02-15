// Prioritize localhost during development, otherwise use the environment variable
const isDevelopment = import.meta.env.DEV;
const API_URL = isDevelopment
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_API_URL || 'https://fundingboss-backend.vercel.app');

export default API_URL;
