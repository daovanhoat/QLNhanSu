import { createRouter, createWebHistory } from 'vue-router'
import UserManager from '@/components/User/UserManager.vue'
import Salary from '@/components/Salary/Salary.vue'
import position from '@/components/position/Position.vue'
import layout from '@/components/layout/layout.vue'
import account from '@/components/loginManager/LoginManager.vue'
import Login from '@/components/login/login.vue' //
import Register from '@/components/register/Register.vue'
import Department from '@/components/Department/Department.vue'
import WorkingInfo from '@/components/workingInfo/workingInfo.vue'
import AttendenceLog from '@/components/AttendenceLog/AttendenceLog.vue'
import LeaveRequest from '@/components/LeaveRequest/LeaveRequest.vue'

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '/',
        redirect: () => {
          const role = localStorage.getItem('role') || ''
          return role === 'Admin' ? '/nhansu' : '/workingInfo'
        },
      },
      {
        path: '/nhansu',
        component: UserManager,
      },
      {
        path: '/luong',
        component: Salary,
      },
      {
        path: '/heso',
        component: position,
      },
      {
        path: '/account',
        component: account,
      },
      {
        path: '/department',
        component: Department,
      },
      {
        path: '/workingInfo',
        component: WorkingInfo,
      },
      {
        path: '/attendencelog',
        component: AttendenceLog,
      },
      {
        path: '/leaverequest',
        component: LeaveRequest,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login', // fallback
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  const role = localStorage.getItem('role')

  if (authRequired && !loggedIn) {
    return next('/login')
  }
  if (
    role === 'User' &&
    ['/nhansu', '/luong', '/heso', '/account', '/department'].includes(to.path)
  ) {
    return next('/workingInfo')
  }
  next()
})

export default router
