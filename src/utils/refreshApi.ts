import axios from 'axios'

const API_URL = import.meta.env.VITE_API_LOCAL
export const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 1000 * 60 * 5
})