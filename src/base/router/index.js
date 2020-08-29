import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
// 定义路由配置
let routes = []
let concat = (router) => {
  routes = routes.concat(router)
}
// // 导入路由规则
import HomeRouter from '@/module/home/router'
import uCenter from '@/module/uCenter/router'
import book from '@/module/book/router'
import role from '@/module/role/router'
import menuList from '@/module/menuList/router'
import equip from '@/module/equip/router'
import assess from '@/module/assess/router'
import life from '@/module/life/router'
import event from '@/module/event/router'
import status from '@/module/status/router'
import error from '@/module/error/router'
import online from '@/module/online/router'
import permission from '@/module/permission/router'
import QRCode from '@/module/QRCode/router'
// 合并路由规则
concat(HomeRouter)
concat(uCenter)
concat(book)
concat(role)
concat(menuList)
concat(equip)
concat(assess)
concat(life)
concat(event)
concat(status)
concat(error)
concat(online)
concat(permission)
concat(QRCode)

export default routes;
