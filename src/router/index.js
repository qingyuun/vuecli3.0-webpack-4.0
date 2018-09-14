import Home from '@/views/Home.vue'

export const constantRouterMap = [
  {
    path: '/',
    name: '',
    redirect: '/userCenter'
  },
  {
    path: '/Login',
    name: 'Login',
    title: '登录',
    component: () => import('@/views/account/login.vue')
  },
  {
    path: '/userCenter',
    name: 'userCenter',
    component: Home,
    redirect: '/userCenter/home',
    children: [
      {
        path: 'home',
        title: '用户中心首页',
        name: 'home',
        component: () => import('@/views/userCenter/index.vue'),
        redirect: '/userCenter/home/user',
        children: [
          { path: 'user', title: '个人中心', name: 'user', component: () => import('@/views/userCenter/userDataChange.vue') },
          { path: 'myCourse', title: '我的课程', name: 'myCourse', component: () => import('@/views/userCenter/myCourse.vue') },
          { path: 'myOrder', title: '我的订单', name: 'myOrder', component: () => import('@/views/userCenter/myOrder.vue') }
        ]
      }
    ]
  },
  {
    path: '/course',
    name: 'course',
    component: Home,
    redirect: '/course/info',
    children: [
      { path: 'info/:id', title: '课程详情', name: 'info', component: () => import('@/views/Course/Info.vue') },
      { path: 'play/:id?', title: '课程播放', name: 'play', component: () => import('@/views/Course/play.vue') }
    ]
  },
  {
    path: '/pay',
    name: 'pay',
    component: Home,
    redirect: 'pay/info',
    children: [
      { path: 'info', title: '支付', name: 'payInfo', component: () => import('@/views/Pay/pay.vue') }
    ]
  }
]

export const appRouterMap = [...constantRouterMap]
