<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">装备履历管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          placeholder="请输入账号"
          auto-complete="off"
          autofocus clearable
          prefix-icon = "el-icon-user">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          auto-complete="off"
          show-password clearable
          prefix-icon = "el-icon-key"
          @keyup.enter.native="handleLogin">
        </el-input>
      </el-form-item>
      <el-form-item prop="verifycode">
        <el-input
          v-model="loginForm.verifycode"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          prefix-icon="el-icon-info"
          @keyup.enter.native="handleLogin"
        >
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-link @click="reset">忘记密码</el-link>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>
        <p>Copyright © 2020-2050 dlice All Rights Reserved</p>
        <el-link href="http://www.beian.miit.gov.cn/"><img src="../../../assets/police.png">陕ICP20006900号</el-link>
      </span>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import api from '../api/home.js'
  import axios from 'axios'
  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
          verifycode: '',
          remeber: true,
          uuid: '',
        },
        loginRules: {
          username: [
            { required: true, trigger: "blur", message: "用户名不能为空" }
          ],
          password: [
            { required: true, trigger: "blur", message: "密码不能为空" }
          ],
          code: [{ required: true, trigger: "blur", message: "验证码不能为空" }]
        },
        loading: false,
        codeUrl: '',
        checkCode: '',
        remeber: true
      };
    },
    created() {
      this.getCode();
      this.getCookie();
    },
    methods: {
      reset(){

      },
      handleLogin: function(){
        var element = this;
        this.$refs.loginForm.validate(valid=>{
          if(valid){
            this.loading = true;
            api.login(this.loginForm).then(res => {
              this.loading = false;
              if(res.success){
                this.$notify({
                  title: '登录成功',
                  message: '登录成功，正在加载系统资源！请稍后......',
                  type: 'success'
                });
                this.$router.push({ path: "/" });
              }else {
                element.getCode();
                this.$notify.error({
                  title: '错误',
                  message: res.message
                });
              }
            }).catch(res => {
              this.loading = false;
              if(res.success){
                this.$notify({
                  title: '登录失败',
                  message: '请检查您的网络连接后重试......',
                  type: 'success'
                });
              }else {
                this.$notify.error({
                  title: '错误',
                  message: res.message
                });
              }
            })
          }
        })
      },
      getCode() {
        api.getCodeImg().then(res => {
          if(res){
            this.codeUrl = "data:image/gif;base64," + res.img;
            this.loginForm.uuid = res.uuid;
          }else {
            this.$notify({
              title: '获取验证码失败',
              message: '系统繁忙！请刷新后重试......',
              type: 'error'
            });
          }
        }).catch(e=>{
          this.$notify({
            title: '获取验证码失败',
            message: '网络错误，请稍后重试',
            type: 'error'
          });
          }
        );
      },
      getCookie() {
        const username = Cookies.get("username");
        const password = Cookies.get("password");
        const rememberMe = Cookies.get('rememberMe')
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
        };
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../../../assets/bge.png");
    background-size: cover;
  }
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
  .el-login-footer {
    height: 60px;
    line-height: 12px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
</style>
