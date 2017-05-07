<template>  
   <!--<el-table v-loading="loading" :data="filtedList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="240">
      </el-table-column>
    </el-table>-->
  <div>
    <div class="tool-bar">
      <el-button type="primary" @click="openCreateDialog" icon="plus">新建歌单</el-button>
    </div>
    <el-table v-loading="loading" :data="list" stripe style="width: 100%">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline>
            <el-form-item label="歌单描述">
              <span>{{ props.row.desc || '暂无简介' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="240">
      </el-table-column>
      <el-table-column prop="userid" label="所属用户ID" width="240">
      </el-table-column>
      <el-table-column sortable prop="created" label="创建时间">
        <template scope="scope">
          {{new Date(scope.row.created).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column sortable prop="updated" label="最后修改时间">
        <template scope="scope">
          {{new Date(scope.row.updated).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌单名" width="180">
      </el-table-column>
      <el-table-column prop="cover" label="歌单封面">
        <template scope="scope">
          <el-button @click="openCoverDialog(scope)" type="text" size="small">查看封面</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template scope="scope">
          <el-button @click="deleteList(scope)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新建歌单" :visible.sync="createDialogVisable" size="tiny">
      <list-dialog @done="createDone"></list-dialog>
    </el-dialog>
    <!-- 查看封面 -->
    <el-dialog title="封面图片" :visible.sync="coverDialogVisible" size="tiny">
      <img :src="coverUrl" alt="" width="100%">
    </el-dialog>
  </div>
</template>
<script>
  import { api, HOST } from '../api'
  import CreateListDialog from '../components/CreateListDialog'
  export default {
    data () {
      return {
        createDialogVisable: false,
        list: [],
        loading: false,
        coverDialogVisible: false,
        coverUrl: ''
      }
    },
    mounted () {
      this.getAllLists()
    },
    methods: {
      getAllLists () {
        this.loading = true
        api.getAllLists()
          .then(res => {
            this.list = res.data
            this.loading = false
          })
      },
      openCreateDialog () {
        this.createDialogVisable = true
      },
      createDone () {
        this.createDialogVisable = false
        this.getAllLists()
      },
      deleteList (scope) {
        api.deleteList(scope.row.id)
          .then(res => {
            this.$store.dispatch('toast', {success: res.success, msg: res.msg, vm: this})
            this.getAllLists()
          })
      },
      openCoverDialog (scope) {
        let file = scope.row.cover
        this.coverUrl = HOST + '/static/covers/' + file
        this.coverDialogVisible = true
      }
    },
    components: {
      'list-dialog': CreateListDialog
    }
  }
</script>
