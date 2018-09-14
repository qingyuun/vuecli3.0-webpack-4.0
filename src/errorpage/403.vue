<template>
  <div class="error403">
    <div class="error403-body-con">
      <el-card style="margin-top:10vh">
        <div class="error403-body-con-title">4<span class="error403-0-span"><i class="fa fa-lock"></i></span>3</div>
        <p class="error403-body-con-message">您当前登录账号没有访问此页面权限或尚未的登录，如有疑问请联系管理员。</p>
        <div class="error403-btn-con">
          <el-button @click="goHome" size="large" type="text">返回首页</el-button>
          <el-button @click="backPage" size="large" type="primary">返回上一页</el-button>
          <el-button @click="goLogin" size="large" type="text">登录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'page403',
  data () {
    return { }
  },
  methods: {
    backPage () {
      this.$router.go(-1)
    },
    goHome () {
      this.$router.push({
        name: 'Home'
      })
    },
    goLogin () {
      localStorage.removeItem('roles')
      localStorage.removeItem('token')
      this.$router.push({
        name: 'Login'
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import './403.scss';
</style>
