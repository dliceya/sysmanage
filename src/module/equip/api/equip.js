import http from '@/base/api/public'


export default {

  //查询部门下拉树列表
  deptTree: function () {
    return http.requestQuickGet("system/dept/depttree")
  },

  //通过id查询装备
  getEquipByid(eid){
    return http.requestQuickGet('system/equip/getequip?eid=' + eid)
  },

  //分页查询装备列表
  listEquip(query){
    return http.requestPost('system/equip/list', query)
  },

  //更新装备信息
  updateEquip(post){
    return http.requestPost('system/equip/updateEquip', post)
  },

  //添加装备
  addEquip(post){
    return http.requestPost('system/equip/addEquip', post)
  },

  //删除装备
  delEquip(post){
    return http.requestPost('system/equip/delEquip', post)
  },


  //获取所有顶级菜单
  getMenuParent(){
    return http.requestQuickGet('system/equip/parentmenu')
  },

  //修改菜单状态
  changeMenuStatus(mid, status){
    return http.requestQuickGet('system/equip/changemenustatus?mid=' + mid + '&status=' + status)
  },




}
