import Home from '@/module/home/page/home.vue';
import life from '@/module/life/page/life.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/life', component: life, hidden: false},
    ]
  }
]
