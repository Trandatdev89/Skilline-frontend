<template>
  <header :class="['header', { 'header__home': isHomePage }]">
    <div class="container">
      <div class="header__top">
        <div class="header__logo">
          <RouterLink to="/">
            <img :srcset="logo" alt="logo">
          </RouterLink>
        </div>
        <div class="header__list">
          <div class="header__item">
            <RouterLink to="/">Home</RouterLink>
          </div>
          <div class="header__item">
            <RouterLink to="/course">Course</RouterLink>
          </div>
          <div class="header__item">
            <RouterLink to="/blog">Blog</RouterLink>
          </div>
          <div class="header__item">
            <RouterLink to="/feedback">Feedback</RouterLink>
          </div>
          <div class="header__item">
            <RouterLink to="/about">About</RouterLink>
          </div>
        </div>
        <div class="header__auth header__auth--dropdown" v-if="userInfo.isAuthenticated"
             style="display: flex;align-items: center;">
          <DropDownCustom :title="userInfo.name"
                          :list-link="listLink"
                          :role="userInfo.role"
                          avatar="https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg" />
          <RouterLink to="/cart">
            <el-badge :value="courseIds.length" class="item">
              <el-icon style="font-size: 24px;color: #000000">
                <ShoppingCart />
              </el-icon>
            </el-badge>
          </RouterLink>
          <div class="notification">
            <el-button :icon="Bell" style="font-size: 24px;border: none;background-color: transparent" />
          </div>
        </div>
        <div class="header__auth" v-else>
          <RouterLink to="/login" class="btn btn--primary">
            Login
          </RouterLink>
          <RouterLink to="/register" class=" btn btn--second">
            Sign Up
          </RouterLink>
        </div>
        <div class="header__bar">
          <i class="fa-solid fa-bars" @click="handleShowBar"></i>
        </div>
        <div :class="['dropdown', { show: isShow }]">
          <ul class="dropdown__item">
            <a href="/public">Home</a>
          </ul>
          <ul class="dropdown__item">
            <a href="/public">Careers</a>
          </ul>
          <ul class="dropdown__item">
            <a href="/public">Blog</a>
          </ul>
          <ul class="dropdown__item">
            <a href="/public">About Us</a>
          </ul>
        </div>
      </div>
      <div class="header__banner" v-if="router.path==='/'">
        <div class="header__content">
          <div class="header__title">
            <span>Studying</span>
            Online is now much easier
          </div>
          <div class="header__desc">
            Skilline is an interesting platform that will teach you in more an interactive way
          </div>
          <div class="header__watch">
            <a href="/public" class="btn btn--second">
              Join for free
            </a>
            <div class="header__play">
              Play
            </div>
            <div class="header__subdesc">
              Watch how it works
            </div>
          </div>
        </div>
        <div class="header__girl">
          <img :srcset="girl" alt="gril">
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>

  import { Bell, ShoppingCart } from '@element-plus/icons-vue'
  import logo from '@/assets/img/logo.png'
  import girl from '@/assets/img/header-pic.png'
  import { computed, onMounted, ref } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  import useAuthentication from '@/stores/Authentication.ts'
  import DropDownCustom from '@/components/dropdown/DropDownCustom.vue'
  import { storeToRefs } from 'pinia'
  import useCartStore from '@/stores/cart.ts'
  import usePushNotification from '@/composable/usePushNotification.ts'
  import AlertService from '@/service/AlertService.ts'
  import axios from 'axios'
  import { RoleType } from '@/enums/RoleType.ts'
  import useLoadMore from '@/composable/useLoadMore.ts'

  const isShow = ref<boolean>(false)
  const router = useRoute()
  const { courseIds } = storeToRefs(useCartStore())
  const userId = useAuthentication().userInfo.userId

  const handleShowBar = () => {
    isShow.value = !isShow.value
  }

  const {
    isSupport,
    isSubscribed,
    subscription,
    checkSupport,
    subscribeToPush
  } = usePushNotification()

  const { loadMoreData, data, request } = useLoadMore()

  const subscribeNotification = async () => {
    await subscribeToPush(Number(userId))
    AlertService.success('Thanh cong', 'Dang ky nhan thong bao thanh cong!')
  }

  const sendPushNoti = async () => {
    await axios.post('http://localhost:8080/api/push/send', null, {
      params: {
        userId: userId,
        title: 'Test Notification',
        body: 'Đây là thông báo test từ Vue.js + Spring Boot!'
      }
    })
  }

  const route = useRoute()
  const isHomePage = computed(() => route.name === 'home' || route.path === '/')

  const listLink = ref<any>([
    {
      title: 'Trang quản lý',
      url: '/admin/dashboard',
      role: [RoleType.ADMIN, RoleType.TEACHER]
    },
    {
      title: 'Khóa học đã mua',
      url: '/bought',
      role: [RoleType.ADMIN, RoleType.TEACHER, RoleType.USER]
    },
    {
      title: 'Thông tin cá nhân',
      url: '/info',
      role: [RoleType.USER, RoleType.ADMIN, RoleType.TEACHER]
    },
    {
      title: 'Đăng xuất',
      url: '/logout',
      role: [RoleType.USER, RoleType.ADMIN, RoleType.TEACHER]
    }
  ])

  const listCategory = ref<any>([])

  const { userInfo } = storeToRefs(useAuthentication())

  onMounted(() => {
    checkSupport()
  })

</script>

<style lang="scss" scoped>
  a {
    text-decoration: none;
    font-size: 18px;
    font-weight: 500;
  }

  .header {
    &__item {
      a {
        font-size: 20px;
        color: #000000;
      }
    }
  }
</style>