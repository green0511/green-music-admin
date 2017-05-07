<template>
  <div class="login">
    <div class="login-inner">
      <div class="login-form">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { api } from '../api'
  export default {
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.login(this.loginForm.username, this.loginForm.password)
            .then(res => {
              let { msg, success, token } = res
              this.$store.dispatch('toast', {msg, success, vm: this})
              if (!success) {
                return
              }
              api.setToken(token)
              let next = this.$route.query.next
              if (!next || next.indexOf('login') > -1) {
                next = '/'
              }
              this.$router.push({path: next})
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang="less" scoped>
  .login {
    display: table;
    width: 100%;
    height: 100%;
  }
  .login-inner {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  .login-form {
    display: inline-block;
    width: 500px;
    font-size: 16px;

    input {
      height: 36px;
    }
  }
</style>
