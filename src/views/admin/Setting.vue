<template>
  <div class="setting">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane :label="tab.title" :name='`tab${tab.id}`' v-for="tab in listTab" :key="tab.id">
        <component :is="tab.component" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">

  import ConfigEmail from '@/views/admin/config/ConfigEmail.vue'
  import type { TabsPaneContext } from 'element-plus'
  import { ref } from 'vue'
  import ConfigNotification from '@/views/admin/config/ConfigNotification.vue'
  import ConfigCpu from './config/ConfigCpu.vue'
  import ConfigPolicy from '@/views/admin/config/ConfigPolicy.vue'

  const listTab = [
    { id: 1, title: 'Cai dat email', component: ConfigEmail },
    { id: 2, title: 'Cai dat thong bao', component: ConfigNotification },
    { id: 3, title: 'Gioi han dung luong', component: ConfigCpu },
    { id: 4, title: 'Chinh sach va dieu khoan', component: ConfigPolicy }
  ]

  const activeName = ref('tab1')

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }


</script>

<style scoped lang="scss">

</style>