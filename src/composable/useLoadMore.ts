import { reactive, ref } from 'vue'
import type { ApiResponse } from '@/type/ApiResponse.ts'
import type { RequestParam } from '@/type/RequestParam.ts'
import AlertService from '@/service/AlertService.ts'


const useLoadMore = () => {
  const isLoading = ref<boolean>(false)
  const hasMore = ref<boolean>(true)
  const request = reactive<RequestParam>({
    page: 1,
    size: 10
  })
  const data = ref<any>([])

  const loadMoreData = async (requestApi: (req: RequestParam) => Promise<ApiResponse<any>>) => {

    try {
      if (isLoading.value || !hasMore.value) {
        console.log('ngat ham ')
        return
      }

      isLoading.value = true
      const response: ApiResponse<any> = await requestApi(request)
      console.log(response)
      if (response.code !== 200) {
        throw new Error(response.message)
      }

      if (response.data.list.length < request.size) {
        hasMore.value = false
      }

      data.value.push(...response.data.list)
      request.page++
      isLoading.value = false
    } catch (e: any) {
      AlertService.error('Error', e)
    }finally {
      isLoading.value = false
    }
  }

  const resetLoadMore = ()=>{
    isLoading.value = false;
    hasMore.value = true;
    request.page = 1;
    request.size = 10;
    data.value = [];
  }

  return {
    data,
    loadMoreData,
    isLoading,
    hasMore,
    request,
    resetLoadMore
  }
}

export default useLoadMore