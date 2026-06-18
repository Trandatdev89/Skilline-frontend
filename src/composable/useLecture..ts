import { ref } from 'vue'
import useLoadMore from '@/composable/useLoadMore.ts'
import LectureApi from '@/api/LectureApi.ts'
import type { RequestParam } from '@/type/RequestParam.ts'
import AlertService from '@/service/AlertService.ts'

const useLecture= ()=>{

  const listLectureOfCourse = ref();
  const { loadMoreData, data, resetLoadMore } = useLoadMore()

  const getListLectureByCourseId = async (courseId:number)=>{
    resetLoadMore()
    console.log("abc");
    await loadMoreData((req: RequestParam) => {
      req.courseId = courseId;
      return LectureApi.getLecturesByCourseId(req);
    });
    console.log(data.value);
    listLectureOfCourse.value = data.value;
  }

  const saveLectureByCourseId = async (formData:any)=>{
    try {
      const res = await LectureApi.saveLecturesByCourseId(formData)
      if (res.code !== 200) {
        throw res.message
      }
      AlertService.success('Success', res.message)
    } catch (error: any) {
      AlertService.error('Error', error)
    }
  }

  return {
    listLectureOfCourse,

    //action
    getListLectureByCourseId,
    saveLectureByCourseId
  }
}

export default useLecture;