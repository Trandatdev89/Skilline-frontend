import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

class UserApi{

  async getInfo(): Promise<ApiResponse<any>>{
    return await httpApi.get(`/api/user/info`)
  }

  async updateInfo(data:any): Promise<ApiResponse<any>>{
    return await httpApi.post(`/api/user`, data)
  }

  async logout(): Promise<ApiResponse<any>>{
    return await httpApi.get('/api/user/logout')
  }
}

export default new UserApi();