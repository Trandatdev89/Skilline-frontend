import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CourseRes } from '@/type/res/CourseRes.ts'



const useOrderStore = defineStore('order-store', () => {

  const pendingCourses = ref<CourseRes[]>([])

  const setPendingCourses = (courses: CourseRes[]) => {
    pendingCourses.value = courses
  }

  const clearOrder = () => {
    pendingCourses.value = []
  }

  const pendingCourseIds = computed(() => pendingCourses.value.map(c => c.id))

  const totalAmount = computed(() =>
    pendingCourses.value.reduce(
      (sum, item) => sum + (item.priceDiscount ?? item.priceOriginal ?? 0),
      0
    )
  )

  const totalSaved = computed(() =>
    pendingCourses.value.reduce(
      (sum, item) => sum + Math.max(0, (item.priceOriginal ?? 0) - (item.priceDiscount ?? 0)),
      0
    )
  )

  return {
    pendingCourses,
    pendingCourseIds,
    totalAmount,
    totalSaved,
    setPendingCourses,
    clearOrder
  }
})

export default useOrderStore