import axios from 'axios'

const timeOut = 1000 * 60 * 5
const createApiRequest = (baseUrl: string) => {
  const request = axios.create({
    timeout: timeOut,
    baseURL: baseUrl,
    withCredentials:true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  request.interceptors.request.use((config: any) => {

    const deviceFingerprint = localStorage.getItem('deviceFingerprint');
    if (deviceFingerprint) {
      config.headers['X-Device-Fingerprint'] = deviceFingerprint;
    }

    config.headers = {
      ...config.headers,
      'content-type':'application/json',
      "accept":'application/json'
    }
    return config
  }, (error) => {
    console.log(error)
    return error.response.data
  })

  request.interceptors.response.use((response: any) => {
    return response.data
  }, async (error) => {
    if (error.response) {
      return Promise.resolve(error.response.data)
    }
    return Promise.resolve({
      success: false,
      message: 'Network error'
    })
  })

  return request

}

export const httpApi = createApiRequest("http://localhost:8080");
