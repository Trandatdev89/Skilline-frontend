import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

class PaymentApi {

  async vnPayment(params:  any): Promise<ApiResponse<any>> {
    const config = {
      params: params ? params : {}
    };
    return await httpApi.get('/api/payment', config)
  }

}


const paymentApi = new PaymentApi()
export default paymentApi;