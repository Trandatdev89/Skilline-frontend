import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import AuthenticationApi from '@/api/AuthenticationApi.ts'
import { TokenType } from '@/enums/TokenType.ts'


const useAuthentication = defineStore('useAuthentication', () => {

    const userInfo = reactive({
      userId: '',
      isAuthenticated: false,
      name: '',
      role: '',
      avatar: null
    })

    const isLoading = ref<boolean>(false)
    const lastFetchTime = ref<number>(0)
    const CACHE_DURATION = 5 * 60 * 1000 //5 phut

    const isAuthentication = async () => {
      try {
        const res = await AuthenticationApi.checkAuthentication(TokenType.ACCESS_TOKEN) // server tự đọc cookie
        if (res?.code !== 200) {
          throw new Error(res.message)
        }
        return res.data
      } catch (e) {
        resetUserInfo()
        return false
      }
    }

    const fetchCurrentInfoUser = async (forceRefresh = false) => {
      try {
        const now = Date.now()
        if (!forceRefresh && now - lastFetchTime.value < CACHE_DURATION) {
          return true
        }

        isLoading.value = true
        const res = await AuthenticationApi.getUserInfo()
        if (res?.code !== 200) {
          throw new Error(res.message)
        }
        setAuthToken(res.data)
        lastFetchTime.value = now // ✅ Update cache time
        return true
      } catch (e) {
        resetUserInfo()
        return false
      } finally {
        isLoading.value = false
      }
    }

    const resetUserInfo = () => {
      userInfo.isAuthenticated = false
      userInfo.userId = ''
      userInfo.name = ''
      userInfo.role = ''
      userInfo.avatar = null
    }

    const setAuthToken = (value: any) => {
      userInfo.isAuthenticated = true
      userInfo.userId = value.userId
      userInfo.name = value.username
      userInfo.role = value.role
      userInfo.avatar = value.avatar
    }

    const logout = () => {
      isLoading.value = true
      resetUserInfo()
      localStorage.removeItem('userInfo')
      isLoading.value = false
    }

    return { userInfo, isAuthentication, logout, setAuthToken, isLoading, fetchCurrentInfoUser, resetUserInfo }
  },
  {
    persist: {
      key: 'userInfo',
      pick: ['userInfo']
    }
  })

export default useAuthentication