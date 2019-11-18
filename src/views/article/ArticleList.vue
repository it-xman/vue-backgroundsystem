<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div class="text item">
        <el-form ref="searchFormRef"
                 :model="searchForm"
                 label-width="100px"
                :rules="searchFormRules"
        >
          <el-form-item label="文章状态：">
            <el-radio v-model="searchForm.status" label="">全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
          </el-form-item>
          <el-form-item label="频道列表：">
            <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
              <el-option
                      v-for="item in channelList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
                    v-model="selectTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format = "yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <el-table
              :data="articleList"
              style="width: 100%"
      >
        <el-table-column
                label="图标"
        >
          <img slot-scope="stData" :src="stData.row.cover.images[0]" alt="没有图标" width="150" height="150">
        </el-table-column>
        <el-table-column
                prop="title"
                label="标题"
        >
        </el-table-column>
        <el-table-column
                prop="status"
                label="状态"
        >
          <template slot-scope="stData">
            <el-tag v-if="stData.row.status===0">草稿</el-tag>
            <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
            <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
            <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-else type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column
                prop="pubdate"
                label="发布时间"
        >

        </el-table-column>
        <el-table-column
                label="操作"
        >
          <el-button type="primary" size="small">修改</el-button>
          <el-button type="danger" size="small">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      searchForm: {
        status: '',
        channel_id: '',
        pub_date: '',
        end_data: ''

      },
      searchFormRules: {},
      channelList: [],
      selectTime: [],
      articleList: [],
      tot: ''
    }
  },
  watch: {
    selectTime: function (newVal, oldVal) {
      if (newVal) {
        this.searchForm.pub_date = newVal[0]
        this.searchForm.end_data = newVal[1]
      } else {
        this.searchForm.pub_date = ''
        this.searchForm.end_data = ''
      }
    }
  },
  created () {
    this.getChannelList()
    this.getArticleList()
  },
  methods: {
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(error => {
          return this.$message.error('获取文章列表出错' + error)
        })
    },
    getArticleList () {
      let searchData = {}
      for (let i in this.searchForm) {
        if (this.searchForm[i]) {
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.articleList = result.data.data.results
            this.tot = result.data.data.total_count
          }
        })
        .catch(error => {
          return this.$message.error('获取文章列表出错' + error)
        })
    }
  }
}
</script>

<style scoped lang="less">
  .box-card {
    margin-bottom: 15px;

  }

</style>
