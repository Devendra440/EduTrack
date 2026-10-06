import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.PROD ? 'https://edutrack-backend-cu91.onrender.com/api' : '/api',
  headers: { 'Content-Type': 'application/json' }
});
export default API;
