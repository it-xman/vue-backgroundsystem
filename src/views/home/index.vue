<template>
  <el-container>
    <el-aside :width=" isCollapse? '65px' : '200px'">
      <el-menu
              background-color="#545c64"
              text-color="#fff"
              active-text-color= '#ffd04b'
              :collapse="isCollapse"
              :collapse-transition="false"
              router
      >
        <el-menu-item index="/welcome" :style="{width:isCollapse? '65px' : '200px' }">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:isCollapse? '65px' : '200px' }">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="2-1">发布文章</el-menu-item>
          <el-menu-item index="2-2">文章列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" :style="{width:isCollapse? '65px' : '200px' }">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="4" :style="{width:isCollapse? '65px' : '200px' }">
          <i class="el-icon-location"></i>
          <span slot="title">账户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="position: relative">
        <div id="lt">
          <i
                  slot="prefix"
                  :class=" isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                  @click="isCollapse=!isCollapse"
                  style="cursor: pointer;position: absolute; left: 18px"
          >
          </i>
          <span style="margin-left: 20px;">XCR后台管理系统</span>
        </div>
        <div id="rt">
          <el-input type="text" placeholder="请输入搜索的文章内容" style="width: 300px">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin: 0 30px 0 15px;">消息</span>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <img :src="photo" alt="" width="40" height="40" style="margin-right: 10px">
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>GitHub地址</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    name () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  methods: {
    logout () {
      this.$confirm('确定要退出系统吗?', '退出系统', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.clear()
        this.$router.push({ name: 'login' })
      })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
  .el-container {
    height: 100%;
    background-color: #cccccc;
    }

  .el-aside {
    background-color: #323745;
  }
    .el-header {
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 10px;
      min-width: 950px;

      #lt {
        width: 45%;
        height: 100%;
        font-size: 24px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      #rt {
        font-size: 18px;
        width: 45%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .el-dropdown-link {
          display: flex;
          justify-content: center;
          align-items: center;
        }

      }
    }

</style>
