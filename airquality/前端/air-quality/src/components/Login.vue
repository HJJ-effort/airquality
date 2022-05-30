<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo区域 -->
      <div class="logo_box">
        <div class="logo_boder">
          <img src="../assets/image/logo.png" />
        </div>
      </div>
      <!-- 表单区域 -->
      <el-tabs v-model="activeName" @tab-click="change">
        <el-tab-pane label="登录" name="first" >
          <transition name="el-fade-in-linear">
            <login-form v-show="show"></login-form>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="注册" name="second">
          <transition name="el-fade-in-linear">
            <register-form v-show="!show"></register-form>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import LoginForm from './form/LoginForm'
import RegisterForm from './form/RegisterForm'

export default {
  name: 'Login',
  data() {
    return {
      activeName: 'first',
      show: true,
      current: 'first'
    }
  },
  methods: {
    change(tab, event) {
      if(this.current === tab.name) {
        return;
      }
      this.current = tab.name;
      this.show = !this.show;
    }
  },
  components: {
    LoginForm,
    RegisterForm,
  },
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 340px;
  background: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.logo_box {
  position: absolute;
  left: 50%;
  width: 130px;
  height: 130px;
  border: 2px solid #eee;
  border-radius: 50%;
  padding: 20px;
  box-shadow: 0 0 20px #ddd;
  transform: translate(-50%, -50%);
  background-color: #fff;
  .logo_boder {
    width: 104px;
    height: 104px;
    padding: 10px;
    border: 3px solid #ccc;
    box-shadow: 0 0 10px #ddd;
    border-radius: 50%;
    background-color: rgb(253, 253, 253);
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.el-tabs {
  margin: 80px 20px 0;
}

form {
  transition: all 2s;
}
</style>
