import type { AxiosInstance } from 'axios'
import axios from 'axios'
import AlertService from '@/service/AlertService.ts'
import AuthenticationApi from '@/api/AuthenticationApi.ts'


const timeOut = 1000 * 60 * 5

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

const createApiRequest = (baseUrl: any): AxiosInstance => {
  const request = axios.create({
    baseURL: baseUrl,
    timeout: timeOut,
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  request.interceptors.request.use((config: any) => {

    const deviceFingerprint = localStorage.getItem('deviceFingerprint')
    if (deviceFingerprint) {
      config.headers['X-Device-Fingerprint'] = deviceFingerprint
    }

    const csrfToken = getCookie('XSRF-TOKEN')
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken
    }

    config.headers = {
      ...config.headers,
      'content-type': 'application/json',
      'accept': 'application/json'
    }
    return config
  }, (error) => {
    console.log(error)
    return error.response.data
  })

  request.interceptors.response.use((response: any) => {
    return response.data
  }, async (error) => {
    if (error && error.response.status === 401) {

      const response = await AuthenticationApi.refreshToken()
      if (response.code === 200) {
        AlertService.success('Success', 'Refresh token' + response.data)
      }
    } else if (error && error.response.status === 423) {
      AlertService.error('Error', 'Account is login from device other')
    } else if (error && error.response.status === 403) {
      AlertService.error('Error', 'You cannot access resource this!')
    }
    return Promise.reject(error)
  })

  return request
}

const httpApi = createApiRequest('http://localhost:8080')
export { httpApi }