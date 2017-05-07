<template>
  <div class="login">
    <el-upload class="upload-demo" :action="uploadAddr" :headers="headers" :on-success="handleAvatarSuccess" 
              :on-preview="handlePreview" :file-list="fileList" :before-upload="beforeAvatarUpload" 
              name="avatars" list-type="picture-card">
    <i class="el-icon-plus"></i>
    <div slot="tip" class="el-upload__tip">单张图片不超过1MB</div>
  </el-upload>
  <el-dialog v-model="dialogVisible" size="tiny">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  </div>
</template>
<script>
  import { HOST, http, api } from '../api'
  export default {
    data () {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        uploadAddr: HOST + '/images/avatars',
        fileList: [],
        headers: {
          Authorization: http.defaults.headers.common['Authorization']
        }
      }
    },
    mounted () {
      this.getAllAvatars()
    },
    methods: {
      getAllAvatars () {
        api.getAllAvatars().then(res => {
          if (res.success) {
            this.$store.dispatch('toast', {msg: '已读取所有头像', success: true, vm: this})
          }
          this.fileList = res.data
        })
      },
      handlePreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      beforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isLt2M) {
          this.$store.dispatch('toast', {success: false, msg: '上传头像图片大小不能超过 1MB', vm: this})
        }
        return isLt2M
      },
      handleAvatarSuccess () {
        this.$store.dispatch('toast', {success: true, msg: '上传成功', vm: this})
      }
    }
  }
</script>
