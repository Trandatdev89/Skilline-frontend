import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import AlertService from '@/service/AlertService.ts'
import AuthenticationApi from '@/api/AuthenticationApi.ts'
import { useRouter } from 'vue-router'


const timeOut = 1000 * 60 * 5
let isRefreshing = false
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = []

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
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

  const router = useRouter()

  request.interceptors.request.use((config: any) => {

    const deviceFingerprint = localStorage.getItem('deviceFingerprint')
    if (deviceFingerprint) {
      config.headers['X-Device-Fingerprint'] = deviceFingerprint
    }

    const csrfToken = getCookie('XSRF-TOKEN')
    console.log('🔍 CSRF Token từ cookie:', csrfToken)
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken
    }

    return config
  }, (error) => {
    return Promise.reject(error)
  })

  request.interceptors.response.use((response: any) => {
    return response.data
  }, async (error) => {

    console.log(error)
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config

    originalRequest._retry = originalRequest._retry ?? false

    console.log(originalRequest)
    console.log(originalRequest._retry)
    // retry có tác dụng là tránh viêc gọi refresh-token vô hạn ,kiểu như refresh thất bại nếu
    // không có retry sẽ call api mãi mãi có nó nếu thất bại reject ném về login luôn

    if (error.response?.status === 1012 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh rồi thì cho request vào hàng chờ
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => request(originalRequest))
          .catch((err) => Promise.reject(err))

      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await AuthenticationApi.refreshToken()
        if (response.code === 200) {
          processQueue(null)
          return request(originalRequest) // retry request gốc
        } else {
          throw new Error('Refresh token failed')
        }
      } catch (refreshError) {
        processQueue(refreshError)
        AlertService.error('Session expired', 'Please login again')
        await router.push('/login')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }

    }

    // 423 - Account đăng nhập từ thiết bị khác
    if (error.response?.status === 1019) {
      AlertService.error('Error', 'Account is logged in from another device')
      await router.push('/login')
    }

    // 403 - Forbidden
    if (error.response?.status === 1013) {
      AlertService.error('Error', 'You do not have permission to access this resource')
    }

    // 500 - Server error
    if (error.response?.status === 9999) {
      AlertService.error('Server Error', 'Something went wrong, please try again later')
    }

    return Promise.reject(error)

  })

  return request
}

const httpApi = createApiRequest('http://localhost:8080')
export { httpApi }