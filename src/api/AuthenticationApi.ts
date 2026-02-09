import type { ApiResponse } from '@/type/ApiResponse'
import { httpApi } from '@/utils/httpApi.ts'
import type { TokenType } from '@/enums/TokenType.ts'

class AuthenticationApi {

  async login(dataLogin: any): Promise<ApiResponse<any>> {
    const response: ApiResponse<any> = await httpApi.post('/auth/login', dataLogin, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
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
    return await httpApi.get('/auth/refresh-token')
  }

  async getUserInfo(): Promise<ApiResponse<any>> {
    return await httpApi.get('/auth/me')
  }


}

export default new AuthenticationApi()
