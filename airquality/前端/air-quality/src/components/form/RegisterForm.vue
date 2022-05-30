<template>
  <el-form
    label-width="0px"
    class="register_form"
    :model="registerForm"
    :rules="registerFormRules"
    ref="registerForm"
  >
    <!-- 帐号 -->
    <el-form-item prop="username">
      <el-input
        prefix-icon="iconfont icon-profile"
        v-model="registerForm.username"
      ></el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password">
      <el-input
        prefix-icon="iconfont icon-mima"
        v-model="registerForm.password"
        type="password"
        show-password
        @keyup.native.enter="register"
      ></el-input>
    </el-form-item>
    <div class="radiosAndButtons">
      <!-- 按钮区域 -->
      <el-form-item class="buttons">
        <el-button type="primary" @click="register">注册</el-button>
        <el-button type="info" @click="resetRegisterForm">重置</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
      },
      // 表单验证规则对象
      registerFormRules: {
        username: [
          { required: true, message: '请输入3-10位用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入6-10密码 ', trigger: 'blur' },
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
    register() {
      this.$refs.registerForm.validate(async (valid) => {
        // 预校验
        // console.log(valid); // true or false
        if (!valid) return
        let { data: result } = await this.$axios.post(
          '/login/register',
          this.registerForm
        )
        if (result.status === false)
          return this.$message({
            showClose: true,
            message: result.msg,
            type: 'error',
          })
        this.$message({
          showClose: true,
          message: result.msg,
          type: 'success',
        })
      })
    },
    resetRegisterForm() {
      // 重置表单 element提供的api
      this.$refs.registerForm.resetFields()
    },
  },
}
</script>

<style scoped>
.register_form {
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
