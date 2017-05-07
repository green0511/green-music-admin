<template>
  <div>
    <div class="tool-bar">
      <el-button type="primary" icon="plus" @click="dialogFormVisible = true">添加用户</el-button>
      <div class="right">
        仅显示管理员：
        <el-switch v-model="onlyAdmin" on-text="" off-text="">
        </el-switch>
      </div>
    </div>
    <el-table v-loading="loading" :data="filtedList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="240">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column sortable prop="created" label="注册时间">
        <template scope="scope">
          {{new Date(scope.row.created).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="是否激活">
        <template scope="scope">
          {{scope.row.active?"激活":"禁用"}}
        </template>
      </el-table-column>
      <el-table-column label="是否管理员">
        <template scope="scope">
          <el-tag :type="scope.row.role == 'admin' ? 'success' : 'gray'">{{scope.row.role == 'admin' ? ' 是 ' : ' 否 '}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="用户头像">
        <template scope="scope">
          <el-button @click="openAvatarDialog(scope)" type="text" size="small">查看头像</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template scope="scope">
          <el-button @click="toggle(scope)" type="text" size="small">禁用/激活</el-button>
          <el-button @click="setAdmin(scope)" type="text" size="small">{{scope.row.role == 'admin'?'取消':'设为'}}管理员</el-button>
          <el-button @click="deleteUser(scope)" type="text" size="small">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleLengthChange" @current-change="handlePageChange"
        :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="length" 
        layout="total, sizes, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </div>
    <!--注册对话框-->
    <el-dialog title="添加新用户" :visible.sync="dialogFormVisible" size="tiny">
      <user-reg @close="dialogFormVisible = false" @done="regDone"></user-reg>
    </el-dialog>
    <el-dialog title="用户头像" :visible.sync="avatarDialogVisible" size="tiny">
      <img :src="avatarUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>
<script>
  import { api, HOST } from '../api'
  import UserReg from './UserReg'
  export default {
    data () {
      return {
        tableData: [],
        loading: true,
        avatarDialogVisible: false,
        avatarUrl: '',
        dialogFormVisible: false,
        onlyAdmin: false,
        page: 1,
        length: 10,
        count: 0
      }
    },
    mounted () {
      this.getUsers()
    },
    components: {
      UserReg
    },
    computed: {
      filtedList () {
        return this.tableData.filter(item => {
          if (this.onlyAdmin) {
            return item.role === 'admin'
          }
          return true
        })
      }
    },
    methods: {
      openAvatarDialog (scope) {
        let file = scope.row.avatar
        this.avatarUrl = HOST + '/static/avatars/' + file
        this.avatarDialogVisible = true
      },
      getUsers () {
        this.loading = true
        api.getAllUsers(this.page, this.length)
          .then(res => {
            this.tableData = res.data
            this.loading = false
            this.count = res.count
          })
      },
      toggle (scoped) {
        let user = scoped.row
        api.toggleUser(user.id, !user.active)
          .then(res => {
            this.$store.dispatch('toast', {success: res.success, vm: this})
            if (res.success) {
              user.active = !user.active
            }
          })
          .catch(err => console.log(err))
      },
      setAdmin (scope) {
        let user = scope.row
        api.setRole(user.id, !(user.role === 'admin'))
          .then(res => {
            this.$store.dispatch('toast', {success: res.success, vm: this})
            if (res.success) {
              user.role = user.role === 'admin' ? 'user' : 'admin'
            }
          })
      },
      regDone () {
        this.$message({
          message: '注册成功',
          type: 'success'
        })
        this.getUsers()
      },
      deleteUser (scope) {
        api.removeUser(scope.row.id)
          .then(res => {
            if (res.success) {
              this.getUsers()
            }
            this.$store.dispatch('toast', {success: res.success, vm: this})
          })
      },
      handleLengthChange (length) {
        this.length = length
        this.getUsers()
      },
      handlePageChange (page) {
        this.page = page
        this.getUsers()
      }
    }
  }
</script>
<style lang="less" scope>
.tool-bar {
  margin-bottom: 30px;
  .right {
    float: right;
  }
}
.avatar-preview {
  width: 240px;
  height: 240px;
}
.pagination {
  float: right;
  margin: 20px 0;
}
</style>
