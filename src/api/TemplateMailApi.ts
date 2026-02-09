import type { ApiResponse } from '@/type/ApiResponse.ts'
import { httpApi } from '@/utils/httpApi.ts'

const BASE_URL='/api/config';

class TemplateMailApi{
  async saveTemplateMail(formData:any):Promise<ApiResponse<any>>{
    return httpApi.post(`${BASE_URL}/save-template-mail`, formData)
  }
}

export default new TemplateMailApi();