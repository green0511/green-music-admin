<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="选择用户" prop="userId">
        <el-select v-model="form.userId" placeholder="请选择用户">
          <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="歌单名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写歌单名称"></el-input>
      </el-form-item>
      <el-form-item label="歌单简介" prop="desc">
        <el-input type="textarea" placeholder="请输入歌单简介" :autosize="{ minRows: 2, maxRows: 4 }" v-model="form.desc">
        </el-input>
      </el-form-item>
    </el-form>
    <span>选择封面：</span>
    <el-carousel :autoplay="false" type="card" height="160px" @change="setCover($event)">
      <el-carousel-item v-for="item in covers" :key="item.name" :name="item.name">
        <div>
          <img :src="item.url" alt="item.name" width="100%">
        </div>
      </el-carousel-item>
    </el-carousel>
    <span class="dialog-footer">
      <el-button type="primary" @click="createList" :loading="creating">确认创建</el-button>
    </span>
  </div>
</template>
<script>
  import { api } from '../api'
  export default {
    data () {
      return {
        covers: [],
        form: {
          userId: '',
          name: '',
          desc: '',
          cover: ''
        },
        rules: {
          userId: [
            { required: true, message: '选择一名用户', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请填写歌单名称', trigger: 'blur' }
          ]
        },
        users: [],
        creating: false
      }
    },
    mounted () {
      api.getAllCovers()
        .then(res => {
          this.covers = res.data
        })
      api.getAllUsers()
        .then(res => {
          this.users = res.data
        })
    },
    methods: {
      setCover (index) {
        this.form.cover = this.covers[index].name
      },
      createList () {
        this.creating = true
        let { userId, name, desc, cover } = this.form
        api.createListForUser(userId, name, desc, cover)
          .then(res => {
            this.creating = false
            if (res.success) {
              this.$emit('done')
            }
            this.$store.dispatch('toast', {success: res.success, msg: res.msg, vm: this})
          })
      }
    }
  }
</script>
<style lang="less" scoped>
  .dialog-footer {
    float: right;
    margin: 20px 0;
  }
</style>
