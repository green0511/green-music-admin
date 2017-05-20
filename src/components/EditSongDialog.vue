<template>
  <div>
    <el-form label-width="100px" :rules="rules" :model="form">
      <el-form-item label="歌曲名称" prop="name">
        <el-input v-model="form.name" placeholder="填写歌曲名称"></el-input>
      </el-form-item>
      <el-form-item label="歌曲简介" prop="desc">
        <el-input v-model="form.desc" placeholder="填写歌曲简介" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { api } from '../api'
  export default {
    data () {
      return {
        form: {
          name: '',
          desc: ''
        },
        rules: {
          name: [
            {required: true, message: '请填写歌单名称', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请填写歌单简介', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      if (!this.list) {
        return
      }
      this.form.name = this.list.name
      this.form.desc = this.list.desc
    },
    props: {
      list: {
        required: true
      }
    },
    watch: {
      list: function (val) {
        if (!val) {
          return
        }
        this.form.name = val.name
        this.form.desc = val.desc
      }
    },
    methods: {
      submit () {
        let list = this.list
        let { name, desc } = this.form
        if (name === list.name) {
          name = null
        }
        api.editList(this.list.id, name, desc)
          .then(res => {
            if (res.success) {
              this.$emit('done')
            }
            this.$store.dispatch('toast', {success: res.success, msg: res.msg, vm: this})
          })
      }
    }
  }
</script>
