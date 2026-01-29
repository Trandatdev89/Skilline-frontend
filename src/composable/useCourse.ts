import { ref } from 'vue'
import type { CourseRes } from '@/type/res/CourseRes.ts'
import CourseApi from '@/api/CourseApi.ts'
import AlertService from '@/service/AlertService.ts'
import useLoadMore from '@/composable/useLoadMore.ts'
import type { SearchCourse } from '@/views/Course.vue'

const useCourse = () => {

  const listCourse = ref<CourseRes[]>([])

  const { loadMoreData, data,request,resetLoadMore } = useLoadMore();

  const getListCourse = async () => {
    await loadMoreData(CourseApi.getListCourses)
    listCourse.value = data.value
  }

  const getListCourseByMySelf = async () => {
    await loadMoreData(CourseApi.getListCoursesMySelf)
    listCourse.value = data.value
  }

  const saveCourse = async (formData: any) => {
    try {
      const res = await CourseApi.saveCourse(formData)
      if (res.code !== 200) {
        throw res.message
      }
      AlertService.success('Success', res.message)
    } catch (error: any) {
      AlertService.error('Error', error)
    }
  }

  const getListCourseByListId = async (ids: number[]) => {
    try {
      const res = await CourseApi.getListCourseById(ids)
      if (res.code !== 200) {
        throw res.message
      }

      listCourse.value = res.data
    } catch (error: any) {
      AlertService.error('Error', error)
    }
  }

  const deleteCourse = async (ids: number[]) => {
    try {
      const res = await CourseApi.deleteCourse(ids)
      if (res.code !== 200) {
        throw res.message
      }

      AlertService.success('Success', res.message)

    } catch (error: any) {
      AlertService.error('Error', error)
    }
  }

  const searchCourse = async (filters:SearchCourse)=>{

    let paramSearch : any[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      if(value !== null && value !== undefined && value !== ''){
        if(key && key === 'priceStart'){
          paramSearch.push(`price>=${value}`);
        }else if(key && key === 'priceEnd'){
          paramSearch.push(`price<=${value}`);
        }else{
          if(typeof value === 'number'){
            paramSearch.push(`${key}:${value}`)
          }else{
            paramSearch.push(`${key}~${value}`)
          }
        }
      }
    });

    resetLoadMore();
    const paramSearchStr = paramSearch.join(",").toString();
    request.page = 1;
    request.size = 10;
    request.search = paramSearchStr;
    await loadMoreData(CourseApi.searchCourse)
    listCourse.value = data.value
    console.log(request.search);
  }

  return {
    //state
    listCourse,

    //action
    getListCourse,
    saveCourse,
    getListCourseByListId,
    deleteCourse,
    getListCourseByMySelf,
    searchCourse
  }
}

export default useCourse