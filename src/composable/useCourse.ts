import { ref } from 'vue'
import type { CourseRes } from '@/type/res/CourseRes.ts'
import CourseApi from '@/api/CourseApi.ts'
import AlertService from '@/service/AlertService.ts'
import type { SearchCourse } from '@/views/Course.vue'

const useCourse = () => {
  const listCourse = ref<CourseRes[]>([])
  const totalElements = ref<number>(0)
  const totalPages = ref<number>(0)
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(10)
  const isLoading = ref<boolean>(false)

  const getListCourse = async (page = 1, size = 10) => {
    try {
      isLoading.value = true
      const res = await CourseApi.getListCourses({ page, size })
      if (res.code !== 200) throw res.message
      listCourse.value = res.data.list
      totalElements.value = res.data.totalElements
      totalPages.value = res.data.totalPages
      currentPage.value = page
      pageSize.value = size
    } catch (error: any) {
      AlertService.error('Error', error)
    } finally {
      isLoading.value = false
    }
  }

  const getListCourseByMySelf = async (page = 1, size = 10) => {
    try {
      isLoading.value = true
      const res = await CourseApi.getListCoursesMySelf({ page, size })
      if (res.code !== 200) throw res.message
      listCourse.value = res.data.list
      totalElements.value = res.data.totalElements
      currentPage.value = page
    } catch (error: any) {
      AlertService.error('Error', error)
    } finally {
      isLoading.value = false
    }
  }

  const saveCourse = async (formData: any) => {
    try {
      const res = await CourseApi.saveCourse(formData)
      if (res.code !== 200) throw res.message
      AlertService.success('Success', res.message)
    } catch (error: any) {
      AlertService.error('Error', error)
    }
  }

  const getListCourseByListId = async (ids: number[]) => {
    try {
      const res = await CourseApi.getListCourseByIds(ids)
      if (res.code !== 200) throw res.message
      listCourse.value = res.data
    } catch (error: any) {
      AlertService.error('Error', error)
    }
  }

  const deleteCourse = async (ids: number[]) => {
    try {
      const res = await CourseApi.deleteCourse(ids)
      if (res.code !== 200) throw res.message
      AlertService.success('Success', res.message)
    } catch (error: any) {
      AlertService.error('Error', error)
    }
  }

  /**
   * sort = null  → không truyền param sort lên backend → backend dùng default (id desc)
   * sort = "priceDiscount:asc" → truyền thẳng, không cần convert
   *
   * search rules:
   *   title~abc          tìm kiếm mờ
   *   level#BEGINNER     enum exact
   *   categoryId:1       number exact
   *   priceDiscount>1000 lớn hơn
   *   priceDiscount<2000 nhỏ hơn
   *   rate>3.5           lớn hơn
   *   rate<5             nhỏ hơn
   */
  const searchCourse = async (
    filters: SearchCourse,
    sort: string | null = null,
    page = 1,
    size = 10
  ) => {
    try {
      isLoading.value = true
      const paramSearch: string[] = []

      Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') return
        switch (key) {
          case 'title':       paramSearch.push(`title~${value}`);             break
          case 'level':       paramSearch.push(`level:${value}`);             break
          case 'categoryId':  paramSearch.push(`categoryId:${value}`);        break
          case 'priceStart':  paramSearch.push(`priceDiscount>${value}`);     break
          case 'priceEnd':    paramSearch.push(`priceDiscount<${value}`);     break
          case 'rateStart':   paramSearch.push(`rate>${value}`);              break
          case 'rateEnd':     paramSearch.push(`rate<${value}`);              break
        }
      })

      // Chỉ đưa vào req những param có giá trị — sort null thì không truyền
      const req: Record<string, any> = { page, size }
      if (sort) req.sort = sort
      if (paramSearch.length) req.search = paramSearch.join(',')

      const res = await CourseApi.searchCourse(req)
      if (res.code !== 200) throw res.message

      listCourse.value = res.data.list
      totalElements.value = res.data.totalElements
      totalPages.value = res.data.totalPages
      currentPage.value = page
      pageSize.value = size
    } catch (error: any) {
      AlertService.error('Error', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    listCourse,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    getListCourse,
    saveCourse,
    getListCourseByListId,
    deleteCourse,
    getListCourseByMySelf,
    searchCourse
  }
}

export default useCourse