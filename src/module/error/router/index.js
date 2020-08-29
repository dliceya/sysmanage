import Home from '@/module/home/page/home.vue';
import error from '@/module/error/page/error.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/error', component: error, hidden: false},
    ]
  }
]
