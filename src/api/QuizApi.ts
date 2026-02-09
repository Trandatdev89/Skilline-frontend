import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

const apiPrefixQuiz = '/api/quiz'

class QuizApi {

  async saveQuiz(formData: any): Promise<ApiResponse<any>> {
    return await httpApi.post(`${apiPrefixQuiz}`, formData)
  }

  async getQuizByLectureId(params: any): Promise<ApiResponse<any>> {
    const config = {
      params: params ? params : {}
    }
    return await httpApi.get(`${apiPrefixQuiz}/lecture`, config)
  }

}

export default new QuizApi()