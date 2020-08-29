import Home from '@/module/home/page/home.vue';
import permission from '@/module/permission/page/permission.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/permission',  component: permission, hidden: false},
    ]
  }
]
