<template>  
   <!--<el-table v-loading="loading" :data="filtedList" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="240">
      </el-table-column>
    </el-table>-->
  <div>
    <div class="tool-bar">
      <el-button type="primary" @click="openCreateDialog" icon="plus">新建歌单</el-button>
    </div>
    <div class="tag-bar">
      <el-tag v-if="selectedUser" :closable="true" @close="getAllLists">仅显示 {{selectedUser.username}} 的歌单</el-tag>
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
      <el-table-column prop="name" label="歌单名">
      </el-table-column>
      <el-table-column prop="user" label="所属用户">
        <template scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看该用户所有歌单" placement="top">
            <el-button type="text" @click="selectUser(scope.row.user)">{{scope.row.user.username}}</el-button>
          </el-tooltip>
        </template>
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
      <el-table-column prop="cover" label="歌单封面">
        <template scope="scope">
          <el-button @click="openCoverDialog(scope)" type="text" size="small">查看封面</el-button>
        </template>
      </el-table-column>
      <el-table-column label="包含的歌曲">
        <template scope="scope">
          <el-button @click="openSongDialog(scope)" type="text" size="small">
            <span>共 <el-tag>{{scope.row.musics.length}}</el-tag> 首歌曲</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template scope="scope">
          <el-button @click="openAddSongDialog(scope)" type="text">添加歌曲</el-button>
          <el-button @click="openEditSongDialog(scope)" type="text">编辑</el-button>
          <el-button @click="deleteList(scope)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @size-change="handleLengthChange" @current-change="handlePageChange"
        :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="length" 
        layout="total, sizes, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </div>
    <!-- 弹窗：新建歌单 -->
    <el-dialog title="新建歌单" :visible.sync="createDialogVisable" size="tiny">
      <list-dialog @done="createDone"></list-dialog>
    </el-dialog>
    <!-- 弹窗：查看封面 -->
    <el-dialog title="封面图片" :visible.sync="coverDialogVisible" size="tiny">
      <img :src="coverUrl" alt="" width="100%">
    </el-dialog>
    <!-- 弹窗：查看歌曲 -->
    <el-dialog title="查看歌曲" :visible.sync="songDialogVisible" size="tiny">
      <div v-if="!musicsInDialog || !musicsInDialog.length">该列表中没有歌曲</div>
      <el-collapse>
        <el-collapse-item v-for="music in musicsInDialog" :title="music.id" :key="music.id">
          <div>创建时间： {{new Date(music.date).toLocaleString()}}</div>
          <div>歌曲来源： {{platformMap[music.platform]}}</div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <!-- 弹窗：添加歌曲 -->
    <el-dialog title="新建歌单" :visible.sync="addDialogVisible" size="tiny">
      <add-dialog :list="listEditing" @done="addSong"></add-dialog>
    </el-dialog>
    <!-- 弹窗：编辑歌单 -->
    <el-dialog title="编辑歌单" :visible.sync="editDialogVisible" size="tiny">
      <edit-dialog :list="listEditing" @done="editSong"></edit-dialog>
    </el-dialog>
  </div>
</template>
<script>
  import { api, HOST } from '../api'
  import CreateListDialog from '../components/CreateListDialog'
  import AddSongDialog from '../components/AddSongDialog'
  import EditSongDialog from '../components/EditSongDialog'
  export default {
    data () {
      return {
        createDialogVisable: false,
        list: [],
        loading: false,
        coverDialogVisible: false,
        songDialogVisible: false,
        addDialogVisible: false,
        editDialogVisible: false,
        listEditing: null,
        coverUrl: '',
        musicsInDialog: [],
        platformMap: {
          qq: 'QQ音乐'
        },
        selectedUser: null,
        // 分页
        count: 0,
        page: 1,
        length: 10
      }
    },
    mounted () {
      this.getAllLists()
    },
    methods: {
      getAllLists () {
        this.loading = true
        // 关闭标签
        this.selectedUser = null
        api.getAllLists(this.page, this.length)
          .then(res => {
            this.list = res.data
            this.loading = false
            this.count = res.count
          })
      },
      getAllListsOfUser () {
        this.loading = true
        if (!this.selectedUser) {
          return
        }
        api.getAllListsOfUser(this.selectedUser.id, this.page, this.length).then(res => {
          this.list = res.data
          this.count = res.count
          this.loading = false
        })
      },
      selectUser (user) {
        this.selectedUser = user
        this.getAllListsOfUser()
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
      },
      openSongDialog (scope) {
        this.musicsInDialog = scope.row.musics
        this.songDialogVisible = true
      },
      openAddSongDialog (scope) {
        this.listEditing = scope.row
        this.addDialogVisible = true
      },
      openEditSongDialog (scope) {
        this.listEditing = scope.row
        this.editDialogVisible = true
      },
      addSong () {
        this.addDialogVisible = false
        this.getAllLists()
      },
      editSong () {
        this.editDialogVisible = false
        this.getAllLists()
      },
      handleLengthChange (length) {
        this.length = length
        this.selectedUser ? this.getAllListsOfUser() : this.getAllLists()
      },
      handlePageChange (page) {
        this.page = page
        this.selectedUser ? this.getAllListsOfUser() : this.getAllLists()
      }
    },
    components: {
      'list-dialog': CreateListDialog,
      'add-dialog': AddSongDialog,
      'edit-dialog': EditSongDialog
    }
  }
</script>
<style lang="less" scoped>
.tag-bar {
  margin-bottom: 20px;
}
</style>
