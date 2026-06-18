<template>
  <div class="leftMenu" :class="{ 'leftMenu--collapsed': collapse.isCollapse }">
    <div class="leftMenu__header">
      <img
          v-show="!collapse.isCollapse"
          class="leftMenu__logo"
          :src="logo"
          alt="loading..."
          @click="router.push('/')"
          style="cursor: pointer"
      />
      <el-button
          @click="toggleCollapse"
          :icon="collapse.isCollapse ? Expand : Fold"
          class="leftMenu__toggle"
          text
          style="font-size: 30px"
      />
    </div>
    <div class="leftMenu__main">
      <el-menu
          :collapse="collapse.isCollapse"
          :collapse-transition="true"
          default-active="1"
          class="leftMenu__menu"
      >
        <template v-for="menu in listMenu" :key="menu.id">
          <el-menu-item
              :index="String(menu.id)"
              v-if="menu.role.includes(role as RoleType)"
              @click="handleMenuClick(menu.link,menu.title)"
          >
            <el-icon>
              <component :is="menu.icon"/>
            </el-icon>
            <template #title>
              <span>{{ menu.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import logo from '@/assets/img/logo.png'
  import {
    Expand,
    Fold,
    Menu,
    Setting,
    Tickets,
    Monitor,
    QuestionFilled,
    VideoPlay,
    User,
    Grid
  } from '@element-plus/icons-vue'
  import { RoleType } from '@/enums/RoleType.ts'
  import useAuthentication from '@/stores/Authentication.ts'
  import { useRouter } from 'vue-router'

  const collapse = defineModel<{
    pageTitle:string,
    isCollapse:boolean
  }>( { default: false })
  const router = useRouter()
  const role = useAuthentication().userInfo.role

  const listMenu = [
    { id: 1, title: "Trang quản lý", icon: Menu, link: "/admin/dashboard", role: [RoleType.TEACHER, RoleType.ADMIN] },
    { id: 2, title: "Quản lý danh mục", icon: Grid, link: "/admin/category", role: [RoleType.TEACHER, RoleType.ADMIN] },
    { id: 3, title: "Quản lý khóa học", icon: Monitor, link: "/admin/courses", role: [RoleType.TEACHER, RoleType.ADMIN] },
    { id: 4, title: "Quản lý đơn hàng", icon: Tickets, link: "/admin/order", role: [RoleType.TEACHER, RoleType.ADMIN] },
    { id: 5, title: "Quản lý bài học", icon: VideoPlay, link: "/admin/lecture", role: [RoleType.TEACHER, RoleType.ADMIN] },
    { id: 6, title: "Quản lý quiz", icon: QuestionFilled, link: "/admin/quiz", role: [RoleType.ADMIN, RoleType.TEACHER] },
    { id: 7, title: "Quản lý học viên", icon: User, link: "/admin/account", role: [RoleType.TEACHER,RoleType.ADMIN] },
    { id: 9, title: "Cài đặt", icon: Setting, link: "/admin/setting", role: [RoleType.ADMIN] },
  ]

  const toggleCollapse = () => {
    collapse.value.isCollapse = !collapse.value.isCollapse;
  }

  const handleMenuClick = (link: string,pageTitle:string) => {
    collapse.value.pageTitle = pageTitle;
    router.push(link);
  }
</script>

<style lang="scss" scoped>
  .leftMenu {
    width: 100%;
    height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dcdfe6;
    transition: all 0.3s;

    &--collapsed {
      .leftMenu__header {
        justify-content: center;
        padding-left: 0;
      }
    }

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 10px 0px 20px;
      min-height: 70px;
      transition: all 0.3s;
    }

    &__logo {
      max-width: 100px;
      max-height: 70px;
      width: auto;
      transition: opacity 0.3s;
    }

    &__toggle {
      font-size: 24px;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    &__main {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    &__menu {
      border: none !important;
      height: 100%;
    }
  }

  :deep(.el-menu) {
    border: none !important;
  }

  :deep(.el-menu-item) {

    height: 50px;

    &:hover {
      background-color: #ecf5ff;
    }

    &.is-active {
      background-color: #409eff;
      opacity: 0.9;
      color: #fff;

      .el-icon {
        color: #fff;
      }
    }
  }
</style>