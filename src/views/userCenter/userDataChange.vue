<template>
  <div>
    <h2 class="title">资料设置</h2>
    <div class="user_content">
      <el-form ref="myData" :model="myData" :rules="myDataRules" label-width="70px" label-position="left">
        <el-form-item prop="avatar">
          <el-upload
            :action="uploadOption.uploadUrl"
            :headers="uploadOption.uploadHeader"
            :name="uploadOption.name"
            :file-list="uploadOption.fileList"
            :list-type="uploadOption.listType"
            :multiple="uploadOption.multiple"
            :limit="uploadOption.limit"
            :drag="uploadOption.drag"
            :accept="uploadOption.accept"
            :auto-upload="uploadOption.autoUpload"
            :http-request="upload"
            :on-exceed="allowableQuantity"
            :before-upload="beforeUpload"
            :on-progress="uploadProgress"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-remove="removeFile">
            <img src="../../assets/img/SCZP.png" style="width:146px;">
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="myData.nickName" placeholder="" style="width:230px;margin-right:10px;"></el-input>支持汉字、字母、数字、下划线、长度2-15
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="myData.sex" text-color="#666666" fill="#b01f24">
            <el-radio :label="null">保密</el-radio>
            <el-radio :label="true">男</el-radio>
            <el-radio :label="false">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报考地">
          <el-cascader
            v-model="selectRegionId"
            :options="regionData"
            :props="regionDataProps"
            expand-trigger="hover"
            filterable
            @change="handleChange"
            style="width:500px;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="手机">
          152****1067&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="text" sttyle="color:#b01f24;" v-if="false">修改手机</el-button>
        </el-form-item>
        <el-form-item label="密码">
          ******&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="text" sttyle="color:#b01f24;" @click="showChangePassWord=true">修改密码</el-button>
        </el-form-item>
        <el-form-item class="myDataButton">
          <el-button type="" @click="saveMyData">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="修改密码"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="showChangePassWord"
      width="400px"
      @close="changePassWordClose">
      <el-form :model="changePassWordForm" ref="changePassWord"  :rules="changePassWordFormRules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassWord">
          <el-input v-model="changePassWordForm.oldPassWord"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassWord">
          <el-input v-model="changePassWordForm.newPassWord"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="changePassWordForm.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChangePassWord = false">取 消</el-button>
        <el-button type="primary" @click="changePassWord">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jQuery from 'jquery'
export default {
  name: '',

  components: {

  },

  data () {
    let validateConfirmPassword = (rule, value, callback) => {
      if (this.changePassWordForm.newPassWord !== value) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    let validatenickName = (rule, value, callback) => {
      if (value === '' || value.length < 2) {
        callback(new Error('昵称不可为空且不可少于2个字符'))
      } else if (/\W/.test(value)) {
        callback(new Error('昵称包括非法字符'))
      } else if (value.length > 15) {
        callback(new Error('昵称长度超过允许长度'))
      } else {
        callback()
      }
    }
    return {
      uploadOption: {
        name: '',
        headers: {},
        ossUploadPath: 'course/content/cover', // oss上传路径
        isCustomUpload: true, // 是否自定义上传
        action: '', // 文件上传地址
        fileList: [], // 已上传文件列表  格式 {name:sdf,url:src}
        listType: 'picture-card', // 列表展示类型
        limit: 1, // 允许上传数量
        messageErrorFormat: '上传文件格式不正确', // 文件格式错误提示
        messageErrorNumber: '最多允许上传1个头像', // 文件个数超出
        messageSuccess: '头像上传成功', // 文件上传成功提示
        autoUpload: true, // 是否自动上传
        accept: 'image/jpeg,image/gif,image/png,image/bmp,image/tiff,application/x-shockwave-flash,image/svg+xml,', // 文件允许类型格式
        uploadUrl: '' // 文件上传地址
      },
      regionData: [],
      regionDataProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      selectRegionId: null,
      myData: {
        avatar: '',
        nickName: '',
        sex: '',
        regionId: null,
        phoneNumber: ''
      },
      myDataRules: {
        avatar: [
          { required: true, message: '头像不可为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '昵称不可为空', trigger: 'blur' },
          {
            validator: validatenickName,
            trigger: 'blur'
          }
        ]
      },
      showChangePassWord: false,
      changePassWordForm: {
        oldPassWord: '',
        newPassWord: '',
        confirmPassword: ''
      },
      changePassWordFormRules: {
        oldPassWord: [
          {
            required: true,
            message: '旧密码不可为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 32,
            message: '请输入6-32位旧新密码',
            trigger: 'blur'
          }
        ],
        newPassWord: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 32,
            message: '请输入6-32位新密码',
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
        ]
      }
    }
  },

  watch: {
  },

  mounted () {
    this.getRegionData()
    this.getMyData()
  },

  methods: {
    handleChange (value) {
      this.myData.regionId = value[value.length - 1]
    },
    // 自定义上传方法
    upload (file) {
      if (this.uploadOption.isCustomUpload) {
        // let _this = this
        let a = ''
        a = file.file.type.split('/')[1] === 'vnd.android.package-archive' ? 'apk' : file.file.type.split('/')[1]
        let data = { FileName: this.uploadOption.ossUploadPath + '/{guid}.' + a }
        this.axios.post('/api/Oss/Sign', data).then(response => {
          if (response.data.success) {
            let header = response.data.result
            this.uploadFile(file.file, header)
          } else {
            this.$notify.error(response.data.error.message)
          }
        })
      }
    },
    // 允许上传文件个数过滤
    allowableQuantity (files) {
      if (files.length >= this.uploadOption.limit) {
        this.$notify.error(this.uploadOption.messageErrorNumber)
      }
    },
    // 文件格式过滤
    beforeUpload (file) {
      // 上传之前
      let isImg = true
      let isLength = this.uploadOption.fileList.length >= this.uploadOption.limit
      if (this.uploadOption.accept !== '') {
        let type = this.uploadOption.accept.split(',')
        isImg = type.indexOf(file.type) !== -1
      }
      if (!isImg) {
        this.$notify.error(this.uploadOption.messageErrorFormat)
      }
      if (isLength) {
        this.$notify.error(this.uploadOption.messageErrorNumber)
      }
      return isImg && !isLength
    },
    // 文件上传进行中
    uploadProgress (event, file, fileList) {
      this.UploadProgress = 0
    },
    // 文件上传成功
    uploadSuccess (response, file, fileList) {
      this.$notify.success('文件上传成功')
      // this.message.fileList.push({url: response.result})
      // this.$emit('listenToChildEvent', response.result.url)
    },
    // 文件上传失败
    uploadError (err, file, fileList) {
      let error = JSON.parse(err.message)
      if (error.error) {
        this.$notify.error(error.error.message)
      } else {
        this.$notify.error(error.result.message)
      }
    },
    // 删除已上传文件
    removeFile (file, fileList) {
      let index = this.uploadOption.fileList.indexOf(file)
      this.uploadOption.fileList.splice(index, 1)
      this.myData.avatar = ''
    },
    // 文件上传
    uploadFile (file, header) {
      let _this = this
      let data = new FormData()
      for (let item in header) {
        data.append(item, header[item])
      }
      data.append('File', file)

      function progressHandlingFunction (event) {
        if (event.lengthComputable) {
          let value = (event.loaded / event.total * 100 | 0)
          _this.showUploadProgress = true
          _this.UploadProgress = value
          if (value === 100) {
            _this.showUploadProgress = false
          }
        }
      }
      this.ajax({
        type: 'post',
        url: header.host,
        processData: false, // 用于对data参数进行序列化处理 这里必须false
        contentType: false, // 必须
        headers: { contentType: 'multipart/form-data' },
        dataType: 'json',
        data: data,
        xhr: function () { // 这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
          let myXhr = jQuery.ajaxSettings.xhr()
          if (myXhr.upload) {
            // progress事件会在浏览器接收新数据期间周期性地触发。而onprogress事件处理程序会接收到一个event对象，其target属性是XHR对象，但包含着三个额外的属性：lengthComputable、loaded和total。其中，lengthComputable是一个表示进度信息是否可用的布尔值，loaded表示已经接收的字节数，loaded表示根据Content-Length响应头部确定的预期字节数。
            myXhr.upload.addEventListener('progress', progressHandlingFunction, false)
          }
          return myXhr
        },
        success: function (data) {
          _this.$notify.success(_this.uploadOption.messageSuccess)
          _this.uploadOption.fileList.push({ url: data.result.url })
          _this.myData.avatar = data.result.url
        },
        error: function (data) {
          _this.$notify.error(data)
        }
      })
    },
    getRegionData () {
      this.axios.get('/api/services/app/Region/GetRegionTree').then(res => {
        if (res.data.success) {
          this.regionData = res.data.result
        }
      })
    },
    getMyData () {
      this.axios.get('/api/services/app/Profile/GetCurrAccountProfile').then(res => {
        if (res.data.success) {
          this.myData = { avatar: res.data.result.avatar, nickName: res.data.result.nickName, sex: res.data.result.sex, regionId: res.data.result.regionId, phoneNumber: res.data.result.phoneNumber }
          this.uploadOption.fileList = [{ url: res.data.result.avatar }]
          this.selectRegionId = res.data.result.regionIds.reverse()
        }
      })
    },
    saveMyData () {
      let _this = this
      _this.$refs.myData.validate((valid) => {
        if (valid) {
          _this.axios.put('/api/services/app/Profile/UpdateCurrAccountAvatar', { avatar: _this.myData.avatar }).then(res => {
            if (res.data.success) {
              _this.$emit('listenToChildEvent', _this.myData.avatar)
            }
          })
          _this.axios.put('/api/services/app/Profile/UpdateCurrAccountProfile', _this.myData).then(res => {
            if (res.data.success) {
              _this.$notify.success('账号资料保存成功')
              localStorage.nickName = _this.myData.nickName
              localStorage.avatar = _this.myData.avatar
            } else {
              _this.$notify.error(res.data.error.message)
            }
          })
        }
      })
    },
    changePassWordClose () {
      this.$refs.changePassWord.resetFields()
    },
    changePassWord () {
      this.$refs.changePassWord.validate((valid) => {
        if (valid) {
          this.axios.post('/api/services/app/Profile/ChangePassword', this.changePassWordForm).then(res => {
            if (res.data.success) {
              this.$notify.success('密码修改成功，请重新登陆')
              this.$router.push('login')
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
.title{
  padding-bottom: 20px;
  border-bottom:2px #b01f24 solid;
}
.user_content{
  border-top:2px #f7e8e9 solid;
  .el-form{
    padding-top:40px;
    padding-left: 10px;
  }
}
.myDataButton{
  text-align: center;
  padding-top:40px;
  border-top:1px #f4f4f4 solid;
  .el-button{
    width:240px;
    height:40px;
    background:#b01f24;
    border-color:#b01f24;
    font-size:16px;
    color:#fff;
  }
}
.el-button--text{
  color:#b01f24;
}
</style>
