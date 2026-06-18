import type { ApiResponse } from '@/type/ApiResponse'
import { httpApi } from '@/utils/httpApi.ts'

export interface ReviewReq {
  reviewId?: number | null
  comment: string
  rating: number
  courseId: number
}

export interface ReviewRes {
  id: number
  rating: number
  avatar: string
  userId: number
  courseId: number
  comment: string
  username: string
  createdAt: string
}

class ReviewApi {
  private SUFFIX_URL = '/api/review'

  async getReviewByCourseId(courseId: number): Promise<ApiResponse<ReviewRes[]>> {
    return await httpApi.get(this.SUFFIX_URL, {
      params: { courseId }
    })
  }

  async createReview(data: ReviewReq): Promise<ApiResponse<any>> {
    return await httpApi.post(this.SUFFIX_URL, data)
  }
}

export default new ReviewApi();