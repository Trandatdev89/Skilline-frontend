import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

const apiPrefixQuiz = "/api/question";
class QuestionApi {

  async saveQuestion(formData: any): Promise<ApiResponse<any>> {
    return await httpApi.post(`${apiPrefixQuiz}`, formData)
  }

}

export default new QuestionApi();