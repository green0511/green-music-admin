<template>
  <div class="dialog-container">
    <el-form label-width="100px" :rules="rules" :model="form">
      <el-form-item label="歌曲ID" prop="id">
        <el-input v-model="form.id" placeholder="歌曲ID可从测试接口获得"></el-input>
      </el-form-item>
      <el-form-item label="歌曲来源" prop="platform">
        <el-select v-model="form.platform" placeholder="请选择歌曲来源平台">
          <el-option v-for="option in platformOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">添加</el-button>
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
          id: '',
          platform: 'qq'
        },
        platformOptions: [
          { value: 'qq', label: 'QQ音乐' }
        ],
        rules: {
          id: [
            { required: true, message: '请输入歌曲ID', trigger: 'blur' }
          ],
          platform: [
            { required: true, message: '请输入歌曲来源平台', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      list: {
        required: true
      }
    },
    methods: {
      submit () {
        let { id, platform } = this.form
        api.addSongToList(this.list.id, id, platform)
          .then(res => {
            if (res.success) {
              this.$emit('done')
            }
            this.$store.dispatch('toast', {success: res.success, vm: this})
          })
      }
    }
  }
</script>
