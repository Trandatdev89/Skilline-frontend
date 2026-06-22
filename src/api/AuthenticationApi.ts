import type { ApiResponse } from '@/type/ApiResponse'
import { httpApi } from '@/utils/httpApi'
import { refreshApi } from '@/utils/refreshApi'
import type { TokenType } from '@/enums/TokenType'

class AuthenticationApi {

  async login(dataLogin: any): Promise<ApiResponse<any>> {
    return await httpApi.post('/auth/login', dataLogin, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async checkAuthentication(tokenType: TokenType): Promise<ApiResponse<any>> {
    return await httpApi.get(`/auth/introspect-token?tokenType=${tokenType}`)
  }

  async register(data: any): Promise<ApiResponse<any>> {
    return await httpApi.post('/auth/register', data)
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return await httpApi.get(`/auth/forgot-password?email=${email}`)
  }

  async refreshToken(): Promise<ApiResponse<any>> {
    const response = await refreshApi.post('/auth/refresh-token')
    return response.data
  }
}

export default new AuthenticationApi()