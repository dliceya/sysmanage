import Home from '@/module/home/page/home.vue';
import uCenter from '@/module/uCenter/page/uCenter.vue';

export default [
  {
    path: '/',
    component: Home,
    name: 'uCenter',       //菜单名称
    hidden: false,
    children:[
      {
        path: '/uCenter',
        name: '页面列表',
        component: uCenter,
        hidden: false,
        meta: {
          permission: 'SYSTEM:UCENTER',
          name:'test'
        }
      },
    ]
  }
]
