<template>
  <div class="reg-container">
    <el-form :model="form" :rules="formRules" label-position="left" label-suffix="：">
      <el-form-item label="用户名" label-width="100px" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="100px" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" label-width="100px" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password"></el-input>
      </el-form-item>        
    </el-form>
    <span>选择头像：</span>
    <el-carousel :autoplay="false" type="card" height="160px" @change="setAvatar($event)">
      <el-carousel-item v-for="item in avatars" :key="item.name" :name="item.name">
        <div>
          <img :src="item.url" alt="item.name">
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="dialog-footer">
      <el-button @click="emitClose">取 消</el-button>
      <el-button type="primary" @click="regUser" :loading="registering">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import { api } from '../api'
  export default {
    data () {
      return {
        avatarIndex: 0,
        avatars: [],
        registering: false,
        form: {
          username: '',
          password: '',
          confirmPassword: ''
        },
        formRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {validator: this.checkUsername, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            {validator: this.checkPassword, trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.getAllAvatar()
    },
    computed: {
      avatar () {
        return this.avatars[this.avatarIndex].name
      }
    },
    methods: {
      getAllAvatar () {
        api.getAllAvatars()
          .then(res => {
            this.avatars = res.data
          })
      },
      checkUsername (rule, value, callback) {
        if (value !== undefined) {
          api.checkUsername(value)
            .then(res => {
              if (!res.data.exist) {
                callback()
              } else {
                callback(new Error('用户名已被使用'))
              }
            })
            .catch(_ => callback(new Error('网络错误')))
        }
      },
      checkPassword (rule, value, callback) {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      regUser () {
        this.registering = true
        let { username, password, confirmPassword } = this.form
        api.regUser(username, password, confirmPassword, this.avatar)
          .then(res => {
            this.registering = false
            if (res.success) {
              this.restForm()
              this.emitClose()
              this.emitDone()
              return
            }
            this.$store.dispatch('toast', {msg: res.msg, success: res.success, vm: this})
          })
          .catch(_ => {
            this.registering = false
          })
      },
      emitDone () {
        this.$emit('done')
      },
      emitClose () {
        this.$emit('close')
      },
      restForm () {
        this.form = {
          username: '',
          password: '',
          confirmPassword: ''
        }
      },
      setAvatar (avatarIndex) {
        this.avatarIndex = avatarIndex
      }
    }
  }
</script>
<style lang="less" scoped>
  .dialog-footer {
    float: right;
    margin-bottom: 30px;
  }
  
  .el-carousel__item{
    div {
      text-align: center;
      img {
        width: 160px;
        height: 160px;
      }
    }
  }
</style>
