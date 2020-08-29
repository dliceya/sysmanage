import Home from '@/module/home/page/home.vue';
import role from '@/module/role/page/role.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/role',  component: role, hidden: false},
    ]
  }
]
