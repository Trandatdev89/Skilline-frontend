import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

const apiPrefixQuiz = '/api/quiz'
const apiPrefixQuestion = '/api/question'

class QuizApi {
  async saveQuiz(data: any): Promise<ApiResponse<any>> {
    return await httpApi.post(apiPrefixQuiz, data)
  }

  async getQuizByCourse(params: any): Promise<ApiResponse<any>> {
    return await httpApi.get(`${apiPrefixQuiz}/get-by-course`, { params: params || {} })
  }

  async deleteQuiz(ids: number[]): Promise<ApiResponse<any>> {
    return await httpApi.delete(`${apiPrefixQuiz}/${ids.join(',')}`)
  }

  // Questions
  async saveQuestions(data: { quizId: number; questions: any[] }): Promise<ApiResponse<any>> {
    return await httpApi.post(apiPrefixQuestion, data)
  }

  async deleteQuestion(ids: number[]): Promise<ApiResponse<any>> {
    return await httpApi.delete(`${apiPrefixQuestion}/${ids.join(',')}`)
  }

  async getQuestionsByQuiz(quizId: number): Promise<ApiResponse<any>> {
    return await httpApi.get(`${apiPrefixQuestion}/exam`, { params: { quizId } })
  }
}

export default new QuizApi()