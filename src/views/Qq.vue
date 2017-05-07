<template>
  <el-row :gutter="40">
    <el-col :span="12">
      <div>
        <p>
          <el-input placeholder="请输入内容" v-model="baseSearchUrl">
            <template slot="prepend">接口地址</template>
          </el-input>
        </p>
        <el-select v-model="apiToTest" placeholder="请选择要测试的接口">
          <el-option v-for="api in apis" :key="api.url" :label="api.name" :value="api">
          </el-option>
        </el-select>
        <p v-if="selectedApi.params"><el-tag>url参数</el-tag></p>
        <!--query params form-->
        <el-form :model="form.params">
          <el-form-item v-for="param in selectedApi.params" :label="param.label" :key="param.label">
            <el-input v-model="form.params[param.key]"></el-input>
          </el-form-item>
        </el-form>
        <p v-if="selectedApi.queryParams"><el-tag>查询参数</el-tag></p>
        <!--query params form-->
        <el-form :model="form.queryParams">
          <el-form-item v-for="param in selectedApi.queryParams" :label="param.label" :key="param.label">
            <el-input v-model="form.queryParams[param.key]"></el-input>
          </el-form-item>
        </el-form>
        <div class="search-btn">
          <el-button type="primary" @click="search()">搜索</el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div>
        <p>搜索结果：</p>
        <!--{{searchResult}}-->
        <div>
          <div class="result-row" v-for="item in searchResult" v-if="searchResult.length">
            <div class="result-row-item" v-for="(value, key) in item">
              <div class="result">
                <span>{{key}}：{{value}}</span>
              </div>
            </div>
          </div>
          <div class="result-row" v-for="(value, key) in searchResult" v-if="searchResult.length === undefined">
            <div class="result">
              <span>{{key}}：{{value}}</span>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
  import { http } from '../api'
  export default {
    data () {
      return {
        baseSearchUrl: 'http://qq.linhao.me',
        form: {},
        selectedApi: {},
        apis: [
          {
            name: '模糊搜索',
            url: '/search',
            method: 'get',
            queryParams: [
              { key: 'keyword', label: '关键词' },
              { key: 'type', label: '类型' },
              { key: 'page', label: '页码' },
              { key: 'length', label: '每页数量' }
            ]
          },
          {
            name: '查询歌手详情',
            url: '/singers/:singerId',
            method: 'get',
            params: [
              { key: 'singerId', label: '歌手ID' }
            ]
          },
          {
            name: '查询某歌手的所有歌曲',
            url: '/singers/:singerId/songs',
            method: 'get',
            params: [
              { key: 'singerId', label: '歌手ID' }
            ],
            queryParams: [
              { key: 'page', label: '页码' },
              { key: 'length', label: '每页数量' }
            ]
          },
          {
            name: '查询某歌手的所有专辑',
            url: '/singers/:singerId/albums',
            method: 'get',
            params: [
              { key: 'singerId', label: '歌手ID' }
            ],
            queryParams: [
              { key: 'page', label: '页码' },
              { key: 'length', label: '每页数量' }
            ]
          },
          {
            name: '查询歌曲详情',
            url: '/songs/:songId',
            method: 'get',
            params: [
              { key: 'songId', label: '歌曲ID' }
            ]
          },
          {
            name: '查询专辑详情',
            url: '/albums/:albumId',
            method: 'get',
            params: [
              { key: 'albumId', label: '专辑ID' }
            ]
          }
        ],
        searchResult: {}
      }
    },
    computed: {
      apiToTest: {
        get () { return this.selectedApi },
        set (v) {
          this.selectedApi = v
          // 设置 params
          this.form.params = {}
          v.params && v.params.forEach(item => {
            this.form.params[item.key] = ''
          })
          // 设置 queryParams
          this.form.queryParams = {}
          v.queryParams && v.queryParams.forEach(item => {
            this.form.queryParams[item.key] = ''
          })
        }
      }
    },
    methods: {
      search () {
        let queryParams = this.form.queryParams
        let params = this.form.params
        let queryString = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&')
        let url = this.baseSearchUrl + this.selectedApi.url + (queryString ? '?' + queryString : '')
        Object.keys(params).forEach(key => {
          url = url.replace(':' + key, params[key])
        })
        http[this.selectedApi.method](url)
          .then(res => {
            this.searchResult = res.data
          })
      }
    }
  }
</script>
<style scoped>
  .container {
    width: 800px;
  }
  .search-btn {
    margin-top: 20px;
  }
  .result-row {
    margin-bottom: 20px;
  }
</style>
