import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

class LectureApi {
  async getLectureById(lectureId: any): Promise<ApiResponse<any>> {
    return await httpApi.get(`/api/lecture/stream/${lectureId}`)
  }

  async getLecturesByCourseId(params: any): Promise<ApiResponse<any>> {
    return await httpApi.get('/api/lecture', { params: params || {} })
  }

  async getLecturesByCourseIdNotPagi(courseId: any): Promise<ApiResponse<any>> {
    return await httpApi.get(`/api/lecture/not-pagi?courseId=${courseId}`)
  }

  async saveLecturesByCourseId(data: any): Promise<ApiResponse<any>> {
    return await httpApi.post('/api/lecture/save', data, {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  async deleteLecture(ids: string[]): Promise<ApiResponse<any>> {
    return await httpApi.delete(`/api/lecture/${ids.join(',')}`)
  }
}

export default new LectureApi()