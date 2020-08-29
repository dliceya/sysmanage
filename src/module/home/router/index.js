import Home from '@/module/home/page/home.vue';
import login from '@/module/home/page/login.vue';
export default [
  {
    path: '/login',
    component: login,
    name: 'login页面',
    hidden: false,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/',
    component: Home,
    name: '系统管理首页',
    hidden: false,
    meta: {
      requiresAuth: false,
      permission: 'SYSTEM:HOME',
      name:'test'
    }
    // ,
    // redirect: '/home',
    // children: [
    //   {path: 'home', component: Home}
    // ]
  },

]
