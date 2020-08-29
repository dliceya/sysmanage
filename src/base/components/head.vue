<template>
  <div>
    <el-link :icon="icon" @click="changeView"></el-link>
    <div class="rightMenu">
      <el-avatar class="via" :size="size" :src="viasrc"></el-avatar>
      <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-caret-bottom"></i>
                                </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="uCenter" icon="el-icon-user-solid">个人中心</el-dropdown-item>
          <el-dropdown-item command="management" icon="el-icon-s-tools">布局管理</el-dropdown-item>
          <el-dropdown-item command="signout" icon="el-icon-switch-button">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script type="text/javascript">
  import jwtDecode from 'jwt-decode'
  import utilApi from '../../common/utils'
  import api from '../../module/home/api/home'
  export default {
    data() {
      return {
        icon: 'el-icon-s-fold',
        size: 'large',
        viasrc: '',               //用户头像地址
      }
    },
    methods: {
      changeView() {
        this.icon = this.icon == 'el-icon-s-fold' ? 'el-icon-s-unfold' : 'el-icon-s-fold';
        this.$emit('changeCollapse');
      },
      handleCommand(command) {
        if(command === 'signout'){
          this.$confirm('确认退出吗?', '提示', {
          }).then(() => {
            this.logout();
          }).catch(() => {
            this.$notify.warning({
              title: '警告',
              message: '您已取消退出',
              duration: 0
            });
          });
        }
      },
      //退出登录
      logout: function () {
        api.loginout().then(res=>{
          if(res.success){
            sessionStorage.removeItem('activeUser');
            this.$notify.success({
              title: '成功',
              message: '退出成功',
            });
            utilApi.setCookie('jwt', '0', -1)
            this.$router.push({ path: "/login" });
          }
        }).catch(res=>{
          this.$notify.warning({
            title: '退出失败',
            message: res.message,
            duration: 0
          });
        })
      },
      refresh_user:function(){
        let activeUser= utilApi.getActiveUser();

        if(activeUser){
          this.logined = true
          this.user = activeUser;
          //console.log(this.user.username)
        }
      }
    },
    mounted() {
      let mobile = parseInt(document.body.clientWidth) < 630
      this.icon = mobile ? "el-icon-s-unfold" : "el-icon-s-fold"
      let activeUser = utilApi.getActiveUser()
      this.viasrc = activeUser ? 'https://q1.qlogo.cn/g?b=qq&nk=' + activeUser.qq + '&s=640' : 'https://q1.qlogo.cn/g?b=qq&nk=1767953212&s=640',
      this.refresh_user()

    }
  }
</script>
<style scoped lang="scss">
  .rightMenu {
    padding: 0px;
    float: right;
    height: 100%;
    margin-right: 20px;
    text-align: right;
  }
  .via {

    margin-top: 10px;
    height: 40px;
    width: 40px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-link {
    font-size: 25px
  }
</style>
