import Home from '@/module/home/page/home.vue';
import event from '@/module/event/page/event.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/event', component: event, hidden: false},
    ]
  }
]
