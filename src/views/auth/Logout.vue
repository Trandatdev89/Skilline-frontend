<template>
  <div style="text-align: center;margin-top: 50px" v-loading="isLoading">Đang đăng xuất</div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import useAuthentication from '@/stores/Authentication.js'
  import AlertService from '@/service/AlertService.js'
  import { useRouter } from 'vue-router'
  import UserApi from '@/api/UserApi.js'

  const router = useRouter()
  const { logout, isLoading } = useAuthentication()

  const logoutAccount = async () => {
    const res = await UserApi.logout()
    if (res.code === 200) {
      logout()
      await router.push('/login')
      AlertService.success('Thành công', 'Đăng xuất thành công')
    } else {
      AlertService.error('Thất bại', 'Đăng xuất thất bại')
    }
  }

  onMounted(async () => {
    await logoutAccount()
  })

</script>

<style lang="scss" scoped>

</style>