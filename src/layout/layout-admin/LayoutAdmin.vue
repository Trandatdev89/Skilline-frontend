<template>
  <div class="layoutAdmin">
    <el-container class="layoutAdmin__container">
      <el-aside :width="collapse.isCollapse ? '64px' : '320px'" class="layoutAdmin__aside">
        <LeftMenu v-model="collapse" />
      </el-aside>

      <el-container>
        <el-header class="layoutAdmin__header">
          <HeaderAdmin :pageTitle="collapse.pageTitle"/>
        </el-header>
        <el-main class="layoutAdmin__main" style="padding: 0 15px">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import LeftMenu from '@/layout/layout-admin/LeftMenu.vue'
  import HeaderAdmin from '@/layout/layout-admin/HeaderAdmin.vue'

  const collapse = reactive({
    pageTitle: 'Trang quản lý',
    isCollapse: false
  })
</script>

<style scoped lang="scss">
  .layoutAdmin {
    &__container {
      min-height: 100vh !important;
      display: flex;
    }

    &__aside {
      transition: width 0.3s;
      overflow: hidden;
    }

    &__header,
    &__main {
      padding: 0;
    }

    &__header {
      margin-bottom: 15px;
    }
  }
</style>