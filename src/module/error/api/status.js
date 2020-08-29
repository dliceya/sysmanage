import http from '@/base/api/public'

export default {

  //分页查询装备列表
  listEquip(query){
    return http.requestPost('system/equip/list', query)
  },
  error(name){
    return http.requestQuickGet('system/upload/error?name=' + name)
  }
}
