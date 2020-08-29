<template>
  <div id="start" class="homeBox">
    <el-container>
      <!--左侧导航菜单-->
      <el-aside :style="{width: widAside}" @mouseenter v-if="!mobile || !isCollapse">
        <div id="menu" style="height: 100%">
          <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" background-color="#444455" text-color="#dddddd" unique-opened
              router     >
            <template v-for="(items, index) in Menulist">
              <el-submenu :index = "index + ''">
                <template slot="title">
                  <i :class="items.icon"></i>
                  <span slot="title">{{items.name}}</span>
                </template>
                <el-menu-item-group >
                  <template v-for="(item, childrenindex) in items.child">
                    <el-menu-item :index="item.component"><i :class="item.icon"></i>{{item.name}}</el-menu-item>
                  </template>
                </el-menu-item-group>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <!--主页面-->
      <el-container @mouseenter>
        <!--页头-->
        <el-header>
          <p_Head @changeCollapse="changeCollapse"></p_Head>
        </el-header>
        <!--页面内容-->
        <el-main>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ parh: '/uCenter'}"><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
          </el-breadcrumb>
          <transition name="fade" mode="out-in">
            <router-view>

            </router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import p_Head from '@/base/components/head.vue';
  import utilApi from '../../../common/utils';
  import api from '../api/home'
  export default {
    components: {
      p_Head
    },
    data() {
      return {


        Menulist: [],
        user: {
          "qq": "158156325"
        },

        isCollapse: false,

        mobile: false,
        icon: 'el-icon-s-unfold',
        left: 100,
        widAside: '185px',
        size: 'large',
        fullscreenLoading: false,
        viasrc: 'https://q1.qlogo.cn/g?b=qq&nk=158156325&s=640',
      }
    },
    methods: {
      changeCollapse(){
        this.isCollapse = !this.isCollapse;
        this.widAside = this.widAside == '56px' ? '185px' : '56px';
        if(this.mobile){
          this.widAside = '185px'
        }
      },

      getMenuList(){
        api.getMenuList()
          .then(res => {
            this.Menulist = res.menuList;
          })
      }

    },
    created() {
      const loading = this.$loading();
      this.getMenuList();
      loading.close();

    },
    mounted(){
      this.mobile = parseInt(document.body.clientWidth) < 630
      this.isCollapse = this.mobile
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/style/mixin";
  @import "../../../assets/style/variables";

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    margin-left: -8px;
    width: 200px;
    min-height: 100%;
    height: 100%;
  }

  #menu {
    margin-left: -8px;
    height: 100%;
  }
  #drawer {
    margin-left: -8px;
    height: 100%;
  }
  html,
  body,
  .homeBox,
  .el-container {
    padding: 0px;
    height: 100%;
  }

  .el-header,
  .el-footer {
    background-color: Transparent;
    color: #333;
    text-align: left;
    line-height: 60px;
  }

  .el-aside {
    background-color: #444455;
    color: #333;
    text-align: left;
    line-height: 200px;
  }

  .el-main {
    padding: 10px;
    color: #333;
    text-align: center;
  }

  .el-link {
    font-size: 25px
  }

  body>.el-container {
    margin-bottom: 40px;
  }

</style>
