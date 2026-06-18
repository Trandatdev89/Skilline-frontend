<template>
  <div class="NotificationPermission">
    <div class="NotificationPermission__setting">Cai dat thong bao</div>
    <div class="NotificationPermission__box">
      <div class="NotificationPermission__system">
        <div>Cai dat he thong</div>
        <el-radio-group v-model="notificationPermission.system" @change="changeStatusNotiSystem">
          <el-radio :label="true">Bật thông báo</el-radio>
          <el-radio :label="false">Tắt thông báo</el-radio>
        </el-radio-group>
      </div>
      <div class="NotificationPermission__app">
        <div>Cai dat ung dung</div>
        <el-radio-group v-model="notificationPermission.app" @change="changeStatusNotiApp">
          <el-radio :label="true">Bật thông báo</el-radio>
          <el-radio :label="false">Tắt thông báo</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watchEffect } from 'vue'
import usePushNotification from '@/composable/usePushNotification.ts'
import AlertService from '@/service/AlertService.ts'
import useAuthentication from '@/stores/Authentication.ts'

const notificationPermission = reactive({
  system: false,
  app: false
})

const userId = useAuthentication().userInfo.userId

const { isSupport, checkSupport, subscribeToPush, subscription, unSubscribeToPush } = usePushNotification()

const changeStatusNotiSystem = async (value: boolean) => {
  if (!isSupport.value) {
    AlertService.error('Error', 'Thiet bi cua ban khong ho tro tinh nang nay')
    return
  }

  if (value) {
    await subscribeToPush(Number(userId))
    AlertService.success('Success', 'Bat thong bao he thong thanh cong')
  } else {
    await unSubscribeToPush(Number(userId))
    AlertService.success('Success', 'Tat thong bao he thong thanh cong')
  }
  updateStatusToggleNotification()
}

const changeStatusNotiApp = (value: any) => {
  console.log(value)
}

const loadStatusOnOffNotification = () => {
  const toggleNotification = localStorage.getItem('toggleNotification')
  if (toggleNotification) {
    try {
      const parsed = JSON.parse(toggleNotification)
      notificationPermission.app = parsed.app ?? false
      notificationPermission.system = parsed.system ?? false
    } catch (error) {
      notificationPermission.app = false
      notificationPermission.system = false
    }
  }
}

const updateStatusToggleNotification = () => {
  localStorage.setItem('toggleNotification', JSON.stringify(notificationPermission))
}


onMounted(() => {
  checkSupport()
  loadStatusOnOffNotification()
})

</script>

<style scoped lang="scss">
.NotificationPermission {
  &__setting {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }
}
</style>