<template>
  <div id="app">
    <el-row class="app-wrap">
      <el-col :span="3" class="app-aside bg-black-light">
        <div class="grid-content bg-purple">
          <div class="title text-gray">
            <h4>GREEN MUSIC</h4>
          </div>
          <el-menu mode="vertical" default-active="1" class="el-menu-vertical-demo" theme="dark" :router="true">
            <el-menu-item-group>
              <el-menu-item v-for="(nav, index) in navs" :key="index" :index="nav.path">
                <i :class="nav.icon"></i>
                {{nav.title}}
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="搜索 Api 测试">
              <el-menu-item index="qq"><i class="el-icon-search"></i>QQ 音乐</el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="21" class="app-main">
        <el-menu class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1" @click="logout">注销</el-menu-item>
          <el-menu-item index="2" >{{currentUser}}</el-menu-item>
        </el-menu>
        <div class="router-container">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { api } from './api'
export default {
  name: 'app',
  data () {
    return {
      currentUser: '',
      navs: [
        {
          icon: 'el-icon-setting',
          title: '用户管理',
          path: 'user'
        },
        {
          icon: 'el-icon-document',
          title: '歌单管理',
          path: 'list'
        },
        {
          icon: 'el-icon-picture',
          title: '歌单封面管理',
          path: 'cover'
        },
        {
          icon: 'el-icon-star-on',
          title: '头像管理',
          path: 'avatar'
        }
      ]
    }
  },
  mounted () {
    api.initVm(this)
    let token = localStorage.getItem('token')
    if (token) {
      api.setToken(token, true)
      api.getCurrentUser()
        .then(user => {
          this.currentUser = user.username
        })
        .catch(_ => {
          api.setToken()
        })
    } else {
      this.$router.push({path: 'login', query: {next: this.$route.path}})
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('token')
      this.$router.push({path: '/login'})
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  height: 100%;

  .app-wrap,
  .app-aside,
  .app-main {
      height: 100%;
  }

  .app-main {
    overflow: auto;
    .router-container {
      padding: 40px;
    }
    .el-menu-item {
      float: right;
    }
  }
  .title {
    text-align: center;
    color: #fff;
  }
}
</style>
