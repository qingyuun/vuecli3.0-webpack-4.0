<template>
  <div class="bj">
    <div class="login_content">
      <div class="login_content_nav">
        <p>欢迎来到京师法培！</p>
        <p>返回首页</p>
      </div>
      <div class="login_content_top">
        <div>
          <img src="../../assets/img/loginlogo.png" alt="">
          <h2>{{tittle}}</h2>
        </div>
        <div>
          <Button class="btn" :class="{btnactive:tittle==='用户登陆'}"  @click="tittle='用户登陆'">登录</Button>
          <Button class="btn" :class="{btnactive:tittle==='新用户注册'}" @click="tittle='新用户注册'">免费注册</Button>
        </div>
      </div>
      <p>您的当前位置：首页 > <span>{{tittle}}</span></p>
      <el-row class="login_form">
        <el-col :span="9" :offset="15">
          <p>{{tittle}}</p>
          <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" v-show="tittle==='用户登陆'">
            <el-form-item prop="userName">
              <el-input v-model="loginForm.userName" placeholder="请输入手机号">
                <img src="../../assets/img/SJ.png" slot="prefix" style="padding-top:5px;">
              </el-input>
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input type="password" v-model="loginForm.passWord" placeholder="请输入密码">
                <img src="../../assets/img/mm.png" slot="prefix" style="padding-top:5px;">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="login" class="loginBtn" type="primary" long>登    录</el-button>
              <span style="display:inline-block;float:right;color:#b01f24;cursor:pointer;" @click="tittle='找回密码'">忘记密码</span>
            </el-form-item>
          </el-form>
          <el-form ref="registerForm" :model="registerForm" :rules="registerFormRules" v-show="tittle==='新用户注册'">
            <el-form-item prop="phoneNumber">
              <el-input v-model="registerForm.phoneNumber" placeholder="请输入手机号">
                <img src="../../assets/img/SJ.png" slot="prefix" style="padding-top:5px;">
              </el-input>
            </el-form-item>
            <el-form-item prop="code" ref="code">
              <el-input v-model="registerForm.code" placeholder="请输入验证码">
                <img src="../../assets/img/YZ.png" slot="prefix" style="padding-top:5px;">
                 <el-button slot="append" :disabled="time<60" @click="sendCode">获取验证码<span v-if="time<60">({{time}})</span></el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input type="password" v-model="registerForm.passWord" placeholder="设置密码">
                <img src="../../assets/img/mm.png" slot="prefix" style="padding-top:5px;">
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input type="password" v-model="registerForm.confirmPassword" placeholder="确认密码">
                <img src="../../assets/img/mm.png" slot="prefix" style="padding-top:5px;">
              </el-input>
            </el-form-item>
            <el-form-item prop="checked">
              <el-checkbox label="我已阅读并接受" v-model="registerForm.checked" name="type"></el-checkbox><span :style="{color:registerForm.checked===true?'#409EFF':'#606266'}">《使用条款》</span>
            </el-form-item>
            <el-form-item>
              <el-button @click="register" class="loginBtn" type="primary" long>注     册</el-button>
              <span style="display:inline-block;float:right;color:#b01f24;cursor:pointer;" @click="tittle='用户登陆'">已有账号前往登陆</span>
            </el-form-item>
          </el-form>

          <el-form ref="FindPassWordForm" :model="FindPassWordForm" :rules="FindPassWordFormRules" v-show="tittle==='找回密码'">
            <el-form-item prop="phoneNumber">
              <el-input v-model="FindPassWordForm.phoneNumber" placeholder="请输入手机号">
                <img src="../../assets/img/SJ.png" slot="prefix" style="padding-top:5px;">
              </el-input>
            </el-form-item>
            <el-form-item prop="code" ref="code">
              <el-input v-model="FindPassWordForm.code" placeholder="请输入验证码">
                <img src="../../assets/img/YZ.png" slot="prefix" style="padding-top:5px;">
                 <el-button slot="append" :disabled="findTime<60" @click="findSendCode">获取验证码<span v-if="findTime<60">({{findTime}})</span></el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="newPassWord">
              <el-input type="password" v-model="FindPassWordForm.newPassWord" placeholder="设置密码">
                <img src="../../assets/img/mm.png" slot="prefix" style="padding-top:5px;">
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input type="password" v-model="FindPassWordForm.confirmPassword" placeholder="确认密码">
                <img src="../../assets/img/mm.png" slot="prefix" style="padding-top:5px;">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="Find" class="loginBtn" type="primary" long>找     回</el-button>
              <span style="display:inline-block;float:right;color:#b01f24;cursor:pointer;" @click="tittle='新用户注册'">没有账号，前往注册</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="login_content_bottom">
        452sjhdfskfkjsdhfk
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  components: {

  },

  data () {
    let validateConfirmPassword = (rule, value, callback) => {
      if (this.registerForm.passWord !== value) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    let validateChecked = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请阅读使用条款'))
      } else {
        callback()
      }
    }
    let validateFindConfirmPassword = (rule, value, callback) => {
      if (this.FindPassWordForm.newPassWord !== value) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      tittle: '用户登陆',
      time: 60,
      loginForm: {
        client_id: 'Web',
        grant_type: 'password',
        userName: '',
        passWord: ''
      },
      loginFormRules: {
        userName: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        passWord: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      registerForm: {
        phoneNumber: '',
        passWord: '',
        confirmPassword: '',
        code: '',
        codeToken: '',
        checked: false
      },
      registerFormRules: {
        phoneNumber: [
          { required: true,
            message: '手机号不可为空',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '手机号格式不正确，请输入11位手机号',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不可为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 6,
            message: '验证码格式不正确',
            trigger: 'blur'
          }
        ],
        passWord: [
          {
            required: true,
            message: '密码不可为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 32,
            message: '请输入6-32位密码',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '确认密码不可为空',
            trigger: 'blur'
          },
          {
            validator: validateConfirmPassword,
            trigger: 'blur'
          }
        ],
        checked: [
          {
            validator: validateChecked,
            tirgger: 'change'
          }
        ]

      },
      findTime: 60,
      FindPassWordForm: {
        phoneNumber: '',
        newPassWord: '',
        confirmPassword: '',
        code: '',
        codeToken: '',
        checked: false
      },
      FindPassWordFormRules: {
        phoneNumber: [
          { required: true,
            message: '手机号不可为空',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '手机号格式不正确，请输入11位手机号',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不可为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 6,
            message: '验证码格式不正确',
            trigger: 'blur'
          }
        ],
        newPassWord: [
          {
            required: true,
            message: '密码不可为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 32,
            message: '请输入6-32位密码',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '确认密码不可为空',
            trigger: 'blur'
          },
          {
            validator: validateFindConfirmPassword,
            trigger: 'blur'
          }
        ]
      }
    }
  },

  watch: {

  },

  mounted () {
    console.log(process.env.VUE_APP_SECRET)
  },

  methods: {
    login () {
      const _this = this
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.ajax({
            type: 'post',
            url: process.env.API_LOGIN,
            data: this.loginForm,
            success: function (data) {
              _this.cookie.set('tokenRefresh', data.refresh_token, data.expires_in * 24, location.hostname)
              _this.cookie.set('tokenType', data.token_type, data.expires_in * 24, location.hostname)
              _this.cookie.set('token', data.access_token, data.expires_in, location.hostname)
              _this.cookie.set('tokenExpires', data.expires_in, data.expires_in * 24, location.hostname)
              _this.cookie.set('tokenTime', (new Date()).getTime(), data.expires_in * 24, location.hostname)
              _this.$message.success('登陆成功')
              _this.axios.get('/api/services/app/Profile/GetCurrAccountProfile').then(res => {
                if (res.data.success) {
                  localStorage['avatar'] = res.data.result.avatar
                  localStorage['nickName'] = res.data.result.nickName
                  if (_this.$route.query.returnUrl) {
                    _this.$router.push(_this.$route.query.returnUrl)
                  } else {
                    _this.$router.push('/userCenter')
                  }
                }
              })
            },
            error: function (data) {
              if (data.responseJSON.error_description) {
                _this.$message.error(data.responseJSON.error_description)
              }
            }
          })
        }
      })
    },
    sendCode () {
      let _this = this
      if (this.registerForm.phoneNumber !== '' && this.registerForm.phoneNumber.length === 11) {
        this.axios.post('/api/services/app/Sms/SendSms', { phoneNumber: this.registerForm.phoneNumber, type: 0 }).then(res => {
          if (res.data.success) {
            _this.registerForm.codeToken = res.data.result.codeToken
            _this.$notify.success('短信验证码已发送至您手机,请注意查收')
            _this.time--
            let timer = setInterval(function () {
              _this.time--
              if (_this.time <= 0) {
                clearInterval(timer)
                _this.time = 60
              }
            }, 1000)
          } else {
            this.$notify.error(res.data.error.message)
          }
        })
      } else if (this.registerForm.phoneNumber === '') {
        this.$notify.error('手机号不可空')
      } else {
        this.$notify.error('手机号格式不正确')
      }
    },
    register () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.axios.post('/api/services/app/Account/RegisteredStudent', this.registerForm).then(res => {
            if (res.data.success) {
              this.$notify.success('账号注册成功')
            } else {
              this.$notify.error(res.data.error.message)
            }
          })
        }
      })
    },
    findSendCode () {
      let _this = this
      if (this.FindPassWordForm.phoneNumber !== '' && this.FindPassWordForm.phoneNumber.length === 11) {
        this.axios.post('/api/services/app/Sms/SendSms', { phoneNumber: this.FindPassWordForm.phoneNumber, type: 2 }).then(res => {
          if (res.data.success) {
            _this.FindPassWordForm.codeToken = res.data.result.codeToken
            _this.$notify.success('短信验证码已发送至您手机,请注意查收')
            _this.findTime--
            let timer = setInterval(function () {
              _this.findTime--
              if (_this.findTime <= 0) {
                clearInterval(timer)
                _this.findTime = 60
              }
            }, 1000)
          } else {
            this.$notify.error(res.data.error.message)
          }
        })
      } else if (this.FindPassWordForm.phoneNumber === '') {
        this.$notify.error('手机号不可空')
      } else {
        this.$notify.error('手机号格式不正确')
      }
    },
    Find () {
      this.$refs.FindPassWordForm.validate((valid) => {
        if (valid) {
          this.axios.post('/api/services/app/Account/ResetPassword', this.FindPassWordForm).then(res => {
            if (res.data.success) {
              this.$notify.success('密码找回成功')
              this.tittle = '用户登陆'
            } else {
              this.$notify.error(res.data.error.message)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.bj{
  background:url('../../assets/img/loginbj.png') no-repeat;
  .login_content{
    width:1140px;
    margin:0 auto;
    .login_content_nav{
      height:35px;
      line-height: 35px;
      font-size: 14px;
      p{
        display:inline-block;
        &:last-child{
          float:right;
        }
      }
    }
    .login_content_top{
      padding:30px 0;
      div{
        display:inline-block;
        img{
          float:left;
          margin-right:25px;
        }
        h2{
          height:45px;
          line-height: 45px;
          display:inline-block;
          padding-left: 25px;
          border-left: 1px #cecece solid;
          &::before{
            border-right: 1px #cecece solid
          }
        }
        &:last-child{
          float:right;
        }
        .btn{
          width:110px;
          height:35px;
          border-radius: 40px;
          font-size: 14px;
          border:1px #b01f24 solid;
          margin:5px 20px;
          color:#fff;
          background:#b01f24;
          cursor: pointer;
          &.btnactive{
            color:#b01f24;
            background:#fff;
          }
        }
      }
    }
    >p{
      margin-top: 15px;
      font-size: 14px;
      span{
        color:#b01f24;
      }
    }
    .login_form{
      padding-top:105px;
      p{
        font-size:20px;
        text-align: center;
        margin-bottom:60px;
      }
      form{
        padding-bottom:320px;
      }
      .loginBtn{
        width:280px;
        height:40px;
        background:#b01f24;
        font-size:16px;
        color:#fff;
      }

    }
    .login_content_bottom{
      position: absolute;
      bottom: 0;
      width:1140px;
      border-top:1px #e6e6e6 solid;
      padding-top:25px;
      padding-bottom: 40px;
      text-align: center;
    }
  }
}
.el-input{
  input{
    background:red;
  }
}

.el-input__inner{
  border:none;
}
.el-input--prefix .el-input__inner{
  padding-left: 35px;
}
</style>
