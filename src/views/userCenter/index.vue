<template>
  <div>
    <p class="top">个人中心</p>
    <el-row>
      <el-col :span="5">
        <div class="userCenter_left">
          <div class="avatar">
            <div>
              <img :src="avatar">
            </div>
            <p>一个人名</p>
            <span>(修改头像)</span>
          </div>
          <el-menu :default-active="activeMenu" router active-text-color="#b01f24"  @select="handleSelect">
            <el-menu-item index="user">
              <img src="../../assets/img/grzx.png" v-if="activeMenu==='user'">
              <img src='../../assets/img/wxgrzx.png' v-else>
              <span>个人中心</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index="myCourse">
              <img src="../../assets/img/xzkc.png" v-if="activeMenu==='myCourse'">
              <img src='../../assets/img/wdkc.png' v-else>
              <span>我的课程</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
            <el-menu-item index="myOrder">
              <img src="../../assets/img/xzdd.png" v-if="activeMenu==='myOrder'">
              <img src='../../assets/img/wddd.png' v-else>
              <span>我的订单</span>
              <i class="el-icon-arrow-right"></i>
            </el-menu-item>
          </el-menu>
          <div class="userCenter_left_bottom">
            <p>关注京师法培公众号</p>
            <img src="../../assets/img/EWM.png">
            <span>获取更多法考动态</span>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="userCenter_right">
          <router-view v-on:listenToChildEvent="change"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: '',

  components: {

  },

  data () {
    return {
      activeMenu: this.$route.name,
      avatar: '../../assets/img/EWM.png'
    }
  },

  watch: {
  },

  mounted () {
    this.getUserInfo()
  },

  methods: {
    getUserInfo () {
      this.axios.get('/api/services/app/Profile/GetCurrAccountProfile').then(res => {
        this.avatar = res.data.result.avatar
      })
    },
    handleSelect (key) {
      this.activeMenu = key
    },
    change (val) {
      this.avatar = val
    }
  }
}
</script>

<style lang='scss' scoped>
.top{
  height:50px;
  line-height: 50px;
  font-size: 12px;
}
.userCenter_left{
  width:230px;
  text-align: center;
  border:1px #cecece solid;
  background:#fff;
  .avatar{
    padding-top:50px;
    padding-bottom:20px;
    border-bottom:1px #e1e1e1 solid;
    >div{
      width:120px;
      height:120px;
      display:block;
      margin:0 auto;
      border-radius: 20px;
      overflow:hidden;
      img{
        width:100%;
        height:100%;
      }
    }
    p{
      margin-top:20px;
      font-size: 16px;
    }
    span{
      line-height: 24px;
    }
  }
  .el-menu{
    border-right:none;
    .el-menu-item{
      border-bottom:1px #e1e1e1 solid;
    }
  }
  .userCenter_left_bottom{
    padding-top: 40px;
    padding-bottom:120px;
    p{
      font-size: 16px;
      margin-bottom:30px;
    }
    img{
      width:110px;
      height:110px;
      margin-bottom:30px;
    }
    span{
      display:block;
      font-size:14px;
    }
  }
}
.userCenter_right{
  width:828px;
  min-height: 786px;
  float:right;
  background:#fff;
  padding:30px;
  border:1px #cecece solid;
}
</style>
