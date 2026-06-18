import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutDefault from '@/layout/layout-default/LayoutDefault.vue'
import LayoutAdmin from '@/layout/layout-admin/LayoutAdmin.vue'
import About from '@/views/About.vue'
import Pages from '@/router/pages.ts'
import Login from '@/views/auth/Login.vue'
import Fobiden from '@/views/errorPage/Fobiden.vue'
import Course from '@/views/Course.vue'
import Lecture from '@/views/Lecture.vue'
import Cart from '@/views/private/Cart.vue'
import Register from '@/views/auth/Register.vue'
import Dashboard from '@/views/admin/dashboard/Dashboard.vue'
import ManageCourse from '@/views/admin/manage-course/ManageCourse.vue'
import ResultPage from '@/views/ResultPage.vue'
import Logout from '@/views/auth/Logout.vue'
import ManageOrder from '@/views/admin/manage-order/ManageOrder.vue'
import Setting from '@/views/admin/config/Setting.vue'
import ManageLecture from '@/views/admin/manage-lecture/ManageLecture.vue'
import ManageCategory from '@/views/admin/manage-category/ManageCategory.vue'
import Bought from '@/views/private/Bought.vue'
import Order from '@/views/private/Order.vue'
import Info from '@/views/private/Info.vue'
import ManageQuiz from '@/views/admin/manage-quiz/ManageQuiz.vue'
import useAuthentication from '@/stores/Authentication.ts'
import Blog from '@/views/Blog.vue'
import Feedback from '@/views/Feedback.vue'
import Notfound from '@/views/errorPage/Notfound.vue'
import { RoleType } from '@/enums/RoleType.ts'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      ...Pages.layoutDefault,
      component: LayoutDefault,
      children: [
        {
          ...Pages.home,
          component: HomeView
        },
        {
          ...Pages.blog,
          component: Blog
        },
        {
          ...Pages.about,
          component: About
        },
        {
          ...Pages.feedback,
          component: Feedback
        },
        {
          ...Pages.blog,
          component: Blog
        },
        {
          ...Pages.fobiden,
          component: Fobiden
        },
        {
          ...Pages.notfound,
          component:Notfound
        },
        {
          ...Pages.resultPage,
          component: ResultPage
        },
        {
          ...Pages.logout,
          component: Logout,
          meta: {
            requireAuth: true,
            roles: [RoleType.ADMIN, RoleType.USER,RoleType.TEACHER]
          }
        },
        {
          ...Pages.login,
          component: Login
        },
        {
          ...Pages.course,
          component: Course
        },
        {
          ...Pages.lecture,
          component: Lecture
        },
        {
          ...Pages.register,
          component: Register
        },
        {
          ...Pages.bought,
          component: Bought,
          meta: {
            requireAuth: true,
            roles: [RoleType.ADMIN, RoleType.USER,RoleType.TEACHER]
          }
        },
        {
          ...Pages.order,
          component: Order,
          meta: {
            requireAuth: true,
            roles: [RoleType.ADMIN, RoleType.USER,RoleType.TEACHER]
          }
        },
        {
          ...Pages.cart,
          component: Cart,
          meta: {
            requireAuth: true,
            roles: [RoleType.ADMIN, RoleType.USER,RoleType.TEACHER]
          }
        },
        {
          ...Pages.info,
          component: Info,
          meta: {
            requireAuth: true,
            roles: ['ADMIN', 'USER', 'TEACHER']
          }
        }
      ]
    },
    {
      ...Pages.layoutAdmin,
      component: LayoutAdmin,
      meta: {
        requireAuth: true,
        roles: ['ADMIN', 'TEACHER']
      },
      children: [
        {
          ...Pages.dashboard,
          component: Dashboard
        },
        {
          ...Pages.manageCourses,
          component: ManageCourse
        },
        {
          ...Pages.manageQuiz,
          component: ManageQuiz
        },
        {
          ...Pages.manageLecture,
          component: ManageLecture
        },
        {
          ...Pages.manageCategory,
          component: ManageCategory
        },
        {
          ...Pages.manageOrder,
          component: ManageOrder
        },
        {
          ...Pages.setting,
          component: Setting
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {

  const authStore = useAuthentication()

  if (to.matched.some(item => item.meta.requireAuth)) {

    const userInfo = authStore.userInfo

    if (!userInfo.isAuthenticated || !userInfo.role) {
      return next('/login')
    }

    const roles = to.meta.roles as string[]

    if (roles && !roles.includes(userInfo.role)) {
      return next('/fobiden')
    }
  }

  next()
})


export default router
