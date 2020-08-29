import http from '@/base/api/public'

export default {

  /**
   * 履历记录Api
   */

  //分页查询履历记录
  listRecord(query){
    return http.requestPost('system/record/list', query)
  },

  //添加履历记录
  addRecord(record){
    return http.requestPost('system/record/addRecord', record)
  },

  //删除履历记录
  delRecord(rids){
    return http.requestPost('system/record/delRecord', rids)
  },


  //结束履历状态
  endStatus(rid){
    return http.requestQuickGet('system/record/endStatus?rid=' + rid)
  },



  /**
   * 履历本Api
   */

  //查询当前用户的履历本
  getbook(uid) {
    return http.requestQuickGet('system/book/bookList?uid=' + uid)
  },

  //添加履历本
  addBook(name, createBy){
    return http.requestQuickGet('system/book/addBook?name=' + name + '&createBy=' + createBy)
  },

  //更新履历本
  updateBook(bid, name){
    return http.requestQuickGet('system/book/updateBook?bid=' + bid + '&name=' + name)
  },
  //删除履历本
  delBook(bid){
    return http.requestQuickGet('system/book/delBook?bid=' + bid)
  },


  //分页查询装备列表
  listEquip(query){
    return http.requestPost('system/equip/list', query)
  },

















}
