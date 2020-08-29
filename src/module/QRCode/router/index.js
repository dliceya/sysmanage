import Home from '@/module/home/page/home.vue';
import QRCode from '@/module/QRCode/page/QRCode.vue';

export default [
  {
    path: '/',
    component: Home,
    children:[
      {path: '/QRCode',  component: QRCode, hidden: false},
    ]
  }
]
