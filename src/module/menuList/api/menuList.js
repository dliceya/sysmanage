import http from '@/base/api/public'


export default {
  //获取所有顶级菜单
  getMenuParent(){
    return http.requestQuickGet('system/menu/parentmenu')
  },

  //通过id查询菜单
  getMenuByid(mid){
    return http.requestQuickGet('system/menu/getmenu?mid=' + mid)
  },

  //分页查询菜单列表
  listMenu(query){
    return http.requestPost('system/menu/list', query)
  },

  //修改菜单状态
  changeMenuStatus(mid, status){
    return http.requestQuickGet('system/menu/changemenustatus?mid=' + mid + '&status=' + status)
  },

  //添加菜单
  addMenu(post){
    return http.requestPost('system/menu/addmenu', post)
  },
  //删除菜单
  delMenu(post){
    return http.requestPost('system/menu/delmenu', post)
  },
  //更新菜单
  updateMenu(post){
    return http.requestPost('system/menu/updatemenu', post)
  },
}
