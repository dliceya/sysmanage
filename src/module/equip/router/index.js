import Home from '@/module/home/page/home.vue';
import equip from '@/module/equip/page/equip.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/equip',  component: equip, hidden: false},
    ]
  }
]
