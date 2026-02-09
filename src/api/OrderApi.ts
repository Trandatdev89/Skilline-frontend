import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

class OrderApi {

  async getOrders(params: any): Promise<ApiResponse<any>> {
    const config = {
      params: params ? params : {}
    }
    return await httpApi.get('/api/order', config)
  }

  async saveOrder(data: any): Promise<ApiResponse<any>> {
    return await httpApi.post('/api/order', data)
  }

}

const orderApi = new OrderApi()
export default orderApi