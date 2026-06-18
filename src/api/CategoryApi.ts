import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

class CategoryApi {
  private SUFFIX_URL = '/api/category'

  async getListCategoryPagination(params: any): Promise<ApiResponse<any>> {
    return await httpApi.get(`${this.SUFFIX_URL}/pagination`, { params: params || {} })
  }

  async getCategoryMySelf(params: any): Promise<ApiResponse<any>> {
    return await httpApi.get(`${this.SUFFIX_URL}/my-self`, { params: params || {} })
  }

  async save(data: any): Promise<ApiResponse<any>> {
    return await httpApi.post(this.SUFFIX_URL, data)
  }

  async deleteCategory(ids: number[]): Promise<ApiResponse<any>> {
    return await httpApi.delete(`${this.SUFFIX_URL}/${ids.join(',')}`)
  }
}

export default new CategoryApi()