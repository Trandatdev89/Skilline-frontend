import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import AuthenticationApi from '@/api/AuthenticationApi.ts'
import { TokenType } from '@/enums/TokenType.ts'
import AuthenticationSecurity from '@/security/AuthenticationSecurity.ts'


const useAuthentication = defineStore('useAuthentication', () => {

    const userInfo = reactive({
      userId: '',
      isAuthenticated: false,
      name: '',
      role: '',
      avatar: null
    })

    const isLoading = ref<boolean>(false)

    const isAuthentication = async () => {
      try {
        const res = await AuthenticationApi.checkAuthentication(TokenType.ACCESS_TOKEN) // server tự đọc cookie
        if (res?.code !== 200) {
          throw new Error(res.message);
        }
        return true;
      } catch (e) {
        resetUserInfo()
        return false
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

    return { userInfo, isAuthentication, logout, setAuthToken, isLoading }
  },
  {
    persist: {
      key: 'userInfo',
      pick: ['userInfo']
    }
  })

export default useAuthentication