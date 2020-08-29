import Home from '@/module/home/page/home.vue';
import assess from '@/module/assess/page/assess.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/assess', component: assess, hidden: false},
    ]
  }
]
