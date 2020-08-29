import Home from '@/module/home/page/home.vue';
import status from '@/module/status/page/status.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/status', component: status, hidden: false},
    ]
  }
]
