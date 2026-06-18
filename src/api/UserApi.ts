import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

class UserApi{

  async getDetail(): Promise<ApiResponse<any>>{
    return await httpApi.get(`/api/user/me`)
  }

  async updateInfo(data:any): Promise<ApiResponse<any>>{
    return await httpApi.post(`/api/user`, data)
  }

  async logout(): Promise<ApiResponse<any>>{
    return await httpApi.get('/api/user/logout')
  }

  async changeMail(data: any): Promise<ApiResponse<any>> {
    return await httpApi.post('/api/user/change-email', data)
  }
}

export default new UserApi();