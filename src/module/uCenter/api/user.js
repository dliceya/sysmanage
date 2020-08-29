import request from "@/base/api/public"
import { praseStrEmpty } from "@/common/utils";

const uCenterApi = ":40400/user";

export default {

  // 查询用户列表
  listUser: function (query) {
    return request.requestPost('ucenter/userlist', query)
  },

  //根据id查询用户
  getUser: function(uid){
    return request.requestQuickGet('ucenter/finduser?uid=' + uid)
  },

  updateUser: function(post){
    return request.requestPost('ucenter/updateuser', post)
  },

  //改密码
  reset(uid, pass){
    return request.requestQuickGet('ucenter/reset?uid=' + uid + '&password=' + pass)
  },



  //添加用户
  addUser: function (post) {
    return request.requestPost("ucenter/adduser", post)
  },

  //删除用户
  delUser: function(uids){
    return request.requestPost("ucenter/deluser", uids)
  },

  //获取系统角色列表（权限
  getRole: function () {
   return request.requestQuickGet("system/role/roleSelect")
  },

  //查询部门下拉树列表
  deptTree: function () {
    return request.requestQuickGet("system/dept/depttree")
  },




}

