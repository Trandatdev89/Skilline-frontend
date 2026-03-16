import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutDefault from '@/layout/layout-default/LayoutDefault.vue'
import LayoutAdmin from '@/layout/layout-admin/LayoutAdmin.vue'
import About from '@/views/About.vue'
import Pages from '@/router/pages.ts'
import pages from '@/router/pages.ts'
import Login from '@/views/login/Login.vue'
import Post from '@/views/Post.vue'
import Fobiden from '@/views/errorPage/Fobiden.vue'
import Course from '@/views/Course.vue'
import Lecture from '@/views/Lecture.vue'
import Cart from '@/views/Cart.vue'
import Register from '@/views/login/Register.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import ManageCourse from '@/views/admin/ManageCourse.vue'
import Success from '@/views/Success.vue'
import Logout from '@/views/Logout.vue'
import Category from '@/views/Category.vue'
import ManageOrder from '@/views/admin/ManageOrder.vue'
import ManageFile from '@/views/admin/ManageFile.vue'
import Setting from '@/views/admin/Setting.vue'
import ManageLecture from '@/views/admin/ManageLecture.vue'
import ManageCategory from '@/views/ManageCategory.vue'
import Bought from '@/views/Bought.vue'
import Order from '@/views/Order.vue'
import Info from '@/views/Info.vue'
import ManageQuiz from '@/views/admin/ManageQuiz.vue'


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
          component: About
        },
        {
          ...Pages.fobiden,
          component: Fobiden
        },
        {
          ...Pages.success,
          component: Success
        },
        {
          ...Pages.category,
          component: Category
        },
        {
          ...Pages.logout,
          component: Logout,
          meta: {
            requireAuth: true,
            roles: ['ADMIN', 'USER']
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
          component: Bought
        },
        {
          ...Pages.order,
          component: Order
        },
        {
          ...Pages.cart,
          component: Cart
        },
        {
          ...Pages.info,
          component: Info
        },
        {
          ...Pages.post,
          component: Post
        }
      ]
    },
    {
      ...Pages.layoutAdmin,
      component: LayoutAdmin,
      meta: {
        requireAuth: true,
        roles: ['ADMIN','TEACHER']
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
          ...Pages.manageFile,
          component: ManageFile
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

  // const authStore = useAuthentication();
  // await authStore.fetchCurrentInfoUser(true);

  if (to.matched.some(item => item.meta.requireAuth)) {

    // const userInfo = useAuthentication().userInfo;

    try {
      const role = userInfo.role
      if (!role) {
        return next(pages.login.path)
      }
      const roles = to.meta.roles as string[]
      if (roles && !roles.includes(role)) {
        return next(pages.fobiden.path)
      }
    } catch (error) {
      return next(Pages.login.path)
    }

  }
  return next()
})


export default router
