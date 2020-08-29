import Home from '@/module/home/page/home.vue';
import menuList from '@/module/menuList/page/menuList.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/menuList',  component: menuList, hidden: false},
    ]
  }
]
