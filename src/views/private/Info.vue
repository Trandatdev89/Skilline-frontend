<template>
  <div class="information">
    <div class="container">
      <div class="information__wrap">
        <div class="information__left">
          <div class="information__tab" v-for="tab in listTab" :key="tab.id" @click="changeTab(tab.TypeTabInfo)">
            <el-icon class="information__icon">
              <component :is="tab.icon" />
            </el-icon>
            <span>{{ tab.title }}</span>
          </div>
        </div>
        <div class="information__right">
          <el-card style="min-height: 600px">
            <component :is="tabComponentDisplay" />
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TypeTabInfo } from '@/type/TypeTabInfo.js'
import NotificationPermission from '@/views/private/NotificationPermission.vue'
import ChangePassWord from '@/views/private/ChangePassWord.vue'
import Voucher from '@/views/private/Voucher.vue'
import InformationUser from '@/views/private/InformationUser.vue'
import { Bell, Avatar, Discount, View } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()


const currentTab = ref<string>('')

const listTab = [
  { id: 1, title: 'Thong bao', icon: Bell, TypeTabInfo: TypeTabInfo.NOTIFICATION },
  { id: 2, title: 'Thong tin ca nhan', icon: Avatar, TypeTabInfo: TypeTabInfo.ACCOUNT },
  { id: 3, title: 'Ma giam gia', icon: Discount, TypeTabInfo: TypeTabInfo.VOUCHER },
  { id: 4, title: 'Thay doi mat khau', icon: View, TypeTabInfo: TypeTabInfo.CHANGE_PASSWORD }
]

const tabComponentDisplay = computed(() => {
  switch (currentTab.value) {
    case TypeTabInfo.NOTIFICATION:
      return NotificationPermission
    case TypeTabInfo.CHANGE_PASSWORD:
      return ChangePassWord
    case TypeTabInfo.VOUCHER:
      return Voucher
    case TypeTabInfo.ACCOUNT:
      return InformationUser
    default:
      return InformationUser
  }
})

const changeTab = (tab: string) => {
  router.push(`/info?TypeTabInfo=${tab}`)
}

watchEffect(() => {
  currentTab.value = route.query.TypeTabInfo as string
  console.log(currentTab.value)
})
</script>


<style scoped lang="scss">
.information {
  margin-top: 60px;
  min-height: 90vh;

  &__wrap {
    display: flex;
    gap: 20px;
  }

  &__left {
    width: 200px;
  }

  &__right {
    flex: 1;
  }

  &__tab{
    display: flex;
    align-items: center;
    gap:5px;
    cursor: pointer;
  }

  &__icon {
    font-size: 16px;
  }
}
</style>