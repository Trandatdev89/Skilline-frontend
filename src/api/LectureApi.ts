import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

class LectureApi {


  async getLecturesByCourseId(params: any): Promise<ApiResponse<any>> {
    return await httpApi.get('/api/lecture', { params: params || {} })
  }

  async saveLecturesByCourseId(data: any): Promise<ApiResponse<any>> {
    return await httpApi.post('/api/lecture/save', data)
  }

  async deleteLecture(ids: string[]): Promise<ApiResponse<any>> {
    return await httpApi.delete(`/api/lecture/${ids.join(',')}`)
  }
}

export default new LectureApi()