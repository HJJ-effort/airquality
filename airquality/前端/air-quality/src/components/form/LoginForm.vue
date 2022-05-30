<template>
  <el-form
    label-width="0px"
    class="login_form"
    :model="loginForm"
    :rules="loginFormRules"
    ref="loginForm"
  >
    <!-- 帐号 -->
    <el-form-item prop="username">
      <el-input
        prefix-icon="iconfont icon-profile"
        v-model="loginForm.username"
      ></el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password">
      <el-input
        prefix-icon="iconfont icon-mima"
        v-model="loginForm.password"
        type="password"
        show-password
        @keyup.native.enter="login"
      ></el-input>
      <!-- element的事件修饰符要加native -->
    </el-form-item>
    <!-- 按钮区域 -->
    <el-form-item class="buttons">
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="info" @click="resetLoginForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      // 表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入登录密码 ', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(async (valid) => {
        // 预校验
        // console.log(valid); // true or false
        if (!valid) return
        let { data: result } = await this.$axios.post(
          '/login/login',
          this.loginForm
        )
        let { status, username, token, msg } = result
        if (status === false)
          return this.$message({
            showClose: true,
            message: msg,
            type: 'error',
          })
        this.$message({
          showClose: true,
          message: msg,
          type: 'success',
        })
        window.sessionStorage.setItem('token', token)
        this.$router.push({ path: `/Home/${username}` })
      })
    },
    resetLoginForm() {
      // 重置表单 element提供的api
      this.$refs.loginForm.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.login_form {
  margin-top: 10px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
