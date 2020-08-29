import http from '@/base/api/public'


export default {

  //查询系统权限列表
  listRole(query){
    return http.requestPost('system/role/rolelist', query)
  },

  //根据id查询角色
  getRole(rid){
    return http.requestQuickGet('system/role/role?rid=' + rid)
  },

  //修改角色状态
  changeRoleStatus(rid, status){
    return http.requestQuickGet('system/role/changeRoleStatus?rid=' + rid + '&status=' + status)
  },

  //增加角色
  addRole(post){
    return http.requestPost('system/role/addrole', post)
  },

  //修改角色信息
  updateRole(post){
    return http.requestPost('system/role/updaterole', post)
  },

  //根据Id删除角色
  delRole(rids){
    return http.requestPost('system/role/deluser', rids)
  },

  //获取权限列表
  getPermissionList(){
    return http.requestQuickGet('system/permission/list')
  },

  //获取当前角色授权信息
  getCurrent(rid){
    return http.requestQuickGet('system/permission/current?rid=' + rid)
  },
  //给角色授权
  auth(permission){
    return http.requestPost('system/permission/auth', permission)
  }
}


