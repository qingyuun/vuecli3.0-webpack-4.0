<template>
  <el-container style="background:#f4f4f4;">
    <el-header>
      <div class="layout-logo">
        <img src="../assets/img/top_logo.png">
      </div>
      <el-menu
        :default-active="activeIndex2"
        mode="horizontal"
        @select="handleSelect"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="index">首页</el-menu-item>
        <el-menu-item index="course">课程</el-menu-item>
        <el-menu-item index="lecturer">讲师</el-menu-item>
        <el-menu-item index="2018">2018私塾班</el-menu-item>
        <el-menu-item index="about">关于我们</el-menu-item>
        <el-submenu index="" style="float:right;" v-if="showUser">
          <template slot="title">
            <img :src="userInfo.avatar" style="width:40px;height:40px;border-radius:50%;">
            {{userInfo.nickName}}
          </template>
          <el-menu-item index="" style="color:#999;text-align:right;padding-right:25px;">个人中心</el-menu-item>
          <el-menu-item index="signOut" style="color:#999;text-align:right;padding-right:25px;">退出</el-menu-item>
        </el-submenu>
        <el-menu-item index="login" style="float:right;" v-else>登陆 | 注册</el-menu-item>
      </el-menu>
      <div class="layout-logo" style="top:0;right:0;">
        <img src="../assets/img/KC（DH）.png">
      </div>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
    <el-footer class="layout-footer-center">
      <div style="width:1140px;min-width:1140px;margin:0 auto;padding-top:45px;">
          <el-row>
            <el-col :span="4">
              <img src="../assets/img/LOGO(BD).png">
              <el-button type="danger">通关计划</el-button>
            </el-col>
            <el-col :span="4">
              <p>新手指南</p>
              <ul>
                <li><a :href="url.about">关于我们</a></li>
                <li><a :href="url.userAgreement">用户协议</a></li>
                <li><a :href="url.commonProblem">常见问题</a></li>
              </ul>
            </el-col>
            <el-col :span="7">
              <p>联系我们</p>
              <span>
                客服：010-62651590
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;周一至周日9：00-24：00(春节除外)
              </span>
              <span>邮箱：service@juristedu.com</span>
            </el-col>
            <el-col :span="9">
              <div>
                <div>
                  <img :src="iosQrcode" alt="iosQrcode">
                  <b>App Store</b>
                </div>
                <div>
                  <img :src="androidQrcode" alt="androidQrcode">
                  <b>Android</b>
                </div>
              </div>

            </el-col>
            <el-col :span="24" style="text-align:center;el-color:#fff;border-top:1px #fff solid;padding:15px 0;font-size:12px;">
              京 ICP 证 09002463 号  |  Copyright © 1999-2018, CSDN.NET, All Rights Reserved
            </el-col>
          </el-row>
        </div>
    </el-footer>
  </el-container>
</template>

<script>
const Qrcode = require('qrcode')
export default {
  name: '',

  components: {},

  data () {
    return {
      activeIndex2: '1',
      iosQrcode: '',
      androidQrcode: '',
      data: [
      ],
      showUser: false,
      userInfo: {
        avatar: '',
        nickName: ''
      },
      url: {
        about: process.env.API_WEB_URL + '/Home/About',
        userAgreement: process.env.API_WEB_URL + '/Protocol/Index',
        commonProblem: process.env.API_WEB_URL + '/Common/Index'
      }
    }
  },

  watch: {},

  mounted () {
    this.getLogin()
    this.createQrcode()
    this.getAndroid()
  },

  methods: {
    getLogin () {
      if (this.cookie.get('token')) {
        this.showUser = true
        this.userInfo = {
          avatar: localStorage.avatar,
          nickName: localStorage.nickName
        }
      }
    },
    getAndroid () {
      this.axios.get('/api/services/app/AppVersion/GetVersion?Version=1.0&AppType=1').then(res => {
        if (res.data.success) {
          Qrcode.toDataURL(res.data.result.filePath, {
            width: '140',
            errorCorrectionLevel: 'H'
          }).then(url => {
            this.androidQrcode = url
          })
        }
      })
    },
    createQrcode () {
      Qrcode.toDataURL('https://itunes.apple.com/cn/app/%E4%BA%AC%E5%B8%88%E6%B3%95%E5%9F%B9/id1383533025?mt=8', {
        width: '140',
        errorCorrectionLevel: 'H'
      }).then(url => {
        this.iosQrcode = url
      })
    },
    handleSelect (key, keyPath) {
      let _this = this
      switch (key) {
        case 'index':
          location.href = process.env.API_WEB_URL
          break
        case 'course':
          location.href = process.env.API_WEB_URL + '/Course/List'
          break
        case 'lecturer':
          location.href = process.env.API_WEB_URL + '/Teacher/List'
          break
        case '2018':
          location.href = process.env.API_WEB_URL + '/Private/Index'
          break
        case 'about':
          location.href = process.env.API_WEB_URL + '/Home/About'
          break
        case 'login':
          _this.$router.push({ name: 'Login', query: { returnUrl: _this.$route.fullPath } })
          break
        case 'signOut':
          _this.cookie.delete('token')
          if (_this.$route.fullPath.indexOf('/userCenter') !== -1) {
            _this.$router.push('/login')
          }
          break
        default:
          _this.cookie.get('token') ? _this.$router.push('/') : _this.$rouert.push('/login')
          break
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  .el-header{
    height: 60px;
    line-height: 60px;
    background: #2e313d;
    padding: 0 10px;
    .layout-logo {
      width: 190px;
      height: 60px;
      float: left;
      position: absolute;
      @media screen and (max-width: 1560px) {
        &:first-child{
          display:none;
        }
      }
    }
    .el-menu{
      width: 1140px;
      margin: 0 auto;
      background:none;
      border:none;
    }
  }
  .el-main {
    width: 1140px;
    margin: 0 auto 55px;
    min-height: 500px;
    padding:0;
  }
  .el-footer{
    background:#666;
    height:auto !important;
    color:#fff;
    .el-col-4{
      button{
        margin-top:20px;
        width:155px;
        height:45px;
        background:#d34537;
        font-size: 18px;
        font-weight: bold;
      }
      &:nth-child(2){
        text-align: center;
        p{
          font-size: 18px;
          font-weight:bold;
          padding:8px 0;
          margin-bottom: 10px;
        }
        ul{
          li{
            font-size: 16px;
            line-height: 40px;
            a{
              color:#fff;
              text-decoration:none;
            }
          }
        }
      }
    }
    .el-col-7{
      p{
        font-size: 18px;
        font-weight:bold;
        padding:8px 0;
        margin-bottom: 20px;
      }
      >span{
        display:block;
        &:nth-child(3){
          margin-top:25px;
        }
      }
    }
    .el-col-9{
      text-align: center;
      >div{
        width:380px;
        float:right;
        div{
          width:140px;
          margin:0 25px;
          float:left;
          b{
            display:inline-block;
            font-size: 18px;
            padding:20px 0;
          }
        }
      }
    }
  }
</style>
