import { ref } from 'vue'
import useLoadMore from '@/composable/useLoadMore.ts'
import CategoryApi from '@/api/CategoryApi.ts'

const useCategory = () => {
  const listCategory = ref<any[]>([])

  const { loadMoreData, data } = useLoadMore()


  const getListCategory = async () => {
    await loadMoreData(CategoryApi.getCategoryMySelf.bind(CategoryApi));
    listCategory.value = data.value
  }

  const getListCategories = async () => {
    await loadMoreData(CategoryApi.getListCategoryPagination.bind(CategoryApi));
    listCategory.value = data.value
  }

  return {
    //state
    listCategory,

    //action
    getListCategory,
    getListCategories
  }
}

export default useCategory