
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const useCartStore = defineStore('cart-store', () => {
  const courseIds = ref<number[]>([])

  const handleAddToCart = (courseId: number): boolean => {
    if (courseIds.value.includes(Number(courseId))) return false
    courseIds.value.push(Number(courseId))
    return true
  }

  const handleSubCart = (courseId: number) => {
    courseIds.value = courseIds.value.filter(id => id !== Number(courseId))
  }

  const handleDeletes = () => {
    courseIds.value = []
  }

  const cartCount = computed(() => courseIds.value.length)

  return { courseIds, cartCount, handleAddToCart, handleSubCart, handleDeletes }
}, {
  persist: true
})

export default useCartStore