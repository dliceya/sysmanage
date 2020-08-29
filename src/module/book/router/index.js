import Home from '@/module/home/page/home.vue';
import book from '@/module/book/page/book.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/book', component: book, hidden: false},
    ]
  }
]
