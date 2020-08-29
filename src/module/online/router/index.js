import Home from '@/module/home/page/home.vue';
import online from '@/module/online/page/online.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/online', component: online, hidden: false},
    ]
  }
]
