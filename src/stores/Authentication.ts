import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import UserApi from '@/api/UserApi.ts'

const useAuthentication = defineStore('useAuthentication', () => {

    const userInfo = reactive({
      userId: '',
      isAuthenticated: false,
      name: '',
      role: '',
      avatar: null,
      email:'',
      phone:''
    })

    const initialized = ref(false)

    const isLoading = ref<boolean>(false)

    const initialize = async () => {

      if (initialized.value) {
        return
      }

      initialized.value = true

      try {
        await fetchCurrentInfoUser()
      } catch {
        resetUserInfo()
      }
    }

    const fetchCurrentInfoUser = async () => {
      try {
        isLoading.value = true
        const res = await UserApi.getDetail();
        if (res?.code !== 200) {
          throw new Error(res.message)
        }
        setAuthToken(res.data)
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
      userInfo.email=''
      userInfo.phone=''
    }

    const setAuthToken = (value: any) => {
      userInfo.isAuthenticated = true
      userInfo.userId = value.userId
      userInfo.name = value.username
      userInfo.role = value.role
      userInfo.avatar = value.avatar
      userInfo.email=value.email
      userInfo.phone=value.phone
    }

    const logout = () => {
      isLoading.value = true
      resetUserInfo()
      isLoading.value = false
    }

    return { userInfo, logout, setAuthToken, isLoading, fetchCurrentInfoUser, resetUserInfo,initialize }
  },
  {
    persist: {
      key: 'userInfo',
      pick: ['userInfo']
    }
  })

export default useAuthentication