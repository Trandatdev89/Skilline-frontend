import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

class CourseApi {

  async getListCourses(params?: any): Promise<ApiResponse<any>> {
    return await httpApi.get('/api/course', { params: params || {} })
  }

  async getListCoursesMySelf(params?: any): Promise<ApiResponse<any>> {
    return await httpApi.get('/api/course/my-self', { params: params || {} })
  }

  async getListCourseByIds(ids: number[]): Promise<ApiResponse<any>> {
    return await httpApi.get(`/api/course/${ids}`)
  }

  async saveCourse(data: any): Promise<ApiResponse<any>> {
    return await httpApi.post('/api/course/save', data)
  }

  async deleteCourse(ids: number[]): Promise<ApiResponse<any>> {
    return await httpApi.delete(`/api/course/${ids.join(',')}`)
  }

  async searchCourse(params?: any): Promise<ApiResponse<any>> {
    return await httpApi.get('/api/course/search-advance', { params: params || {} })
  }
}

export default new CourseApi()