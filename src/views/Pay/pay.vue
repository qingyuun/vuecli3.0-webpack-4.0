<template>
  <div class="pay">
    <div class="title">
      <img src="../../assets/img/loginlogo.png">
      <h1>收银台</h1>
    </div>
    <el-row class="order">
      <el-col :span="12" :offset="1">
        <p>订单编号：{{orderData.outTradeNo}}</p>
        <p>商品名称：<span v-for="(item,index) in orderData.items" :key="index">{{item.courseName}}</span></p>
      </el-col>
      <el-col :span="8" :offset="3">
        应付金额：<span style="font-size:24px;">￥{{orderData.totalAmount}}</span>
      </el-col>
    </el-row>
    <el-tabs v-model="payMthod" class="payMthod" @tab-click="changePay">
      <el-tab-pane name="wxPay" :disabled="showPaySuccess">
        <span slot="label">微信支付<img src="../../assets/img/wx/buttonTag.png"></span>
        <div v-if="!showPaySuccess">
          <div class="wxtitle"><img src="../../assets/img/wx/logo_green.png">微信支付<span style="margin-left:60px;color:#9c9c9c;">亿万用户的选择，更快更安全</span><span style="float:right;margin-right:20PX;">支付<span style="margin:0 10px;color:#ff7519;">{{orderData.totalAmount}}</span>元</span></div>
          <div class="qrcode">
            <img :src="wxPayImg">
            <img src="../../assets/img/wx/Explain.png">
          </div>
        </div>
        <div v-else class="successBtn">
           <h1>订单支付成功</h1>
           <img src="../../assets/img/paySuccess.png">
           <div>
            <el-button class="myorder"><router-link tag="span" to="/userCenter/home/myorder">我的订单</router-link></el-button>
            <el-button class="study"><router-link tag="span" :to="{path:'/course/info/'+orderData.items[0].courseId}">立即学习</router-link></el-button>
           </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="支付宝支付" name="zfbPay" :disabled="changeTabs">
        <div v-if="showPaySuccess" class="successBtn">
          <h1>订单支付成功</h1>
           <img src="../../assets/img/paySuccess.png">
           <div>
            <el-button class="myorder"><router-link tag="span" to="/userCenter/home/myorder">我的订单</router-link></el-button>
            <el-button class="study"><router-link tag="span" :to="{path:'/course/info/'+orderData.items[0].courseId}">立即学习</router-link></el-button>
           </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const Qrcode = require('qrcode')
export default {
  name: '',

  components: {

  },

  data () {
    return {
      wxPayImg: '',
      payMthod: 'wxPay',
      orderData: {},
      iframeSrc: '',
      showPaySuccess: false,
      changeTabs: false
    }
  },

  watch: {
  },

  mounted () {
    if (this.$route.query.out_trade_no) {
      this.getOrderData(this.$route.query.out_trade_no)
      this.showPaySuccess = true
      this.payMthod = 'zfbPay'
    } else {
      this.getOrderData(this.$route.query.outTradeNo)
    }
  },

  methods: {
    // 获取订单数据
    getOrderData (outTradeNo) {
      let _this = this
      _this.axios.get('/api/services/app/Order/GetMyOrder?OutTradeNo=' + outTradeNo).then(res => {
        if (res.data.success) {
          _this.orderData = res.data.result
          _this.pay(res.data.result.outTradeNo, 2, 1)
        }
      })
    },
    // 付款（订单号，付款方式，付款类型）
    pay (outTradeNo, paymentMethod, tradeType) {
      let _this = this
      _this.axios.post('/api/services/app/Order/PaymentMyOrder', { outTradeNo: outTradeNo, paymentMethod: paymentMethod, tradeType: tradeType }).then(res => {
        if (res.data.success) {
          if (paymentMethod === 2) {
            Qrcode.toDataURL(res.data.result, {
              width: '260',
              errorCorrectionLevel: 'H'
            }).then(url => {
              _this.wxPayImg = url
              let checkOrderStatus = setInterval(function () {
                _this.axios.get('/api/services/app/Order/GetMyOrder?OutTradeNo=' + outTradeNo).then(res => {
                  if (res.data.success) {
                    if (res.data.result.status) {
                      clearInterval(checkOrderStatus)
                      _this.showPaySuccess = true
                      _this.changeTabs = true
                    }
                  }
                })
              }, 1500)
            })
          } else {
            location.href = res.data.result
          }
        } else {
          _this.$message.error(res.data.error.message)
        }
      })
    },
    changePay (tab, event) {
      if (tab.$options.propsData.name === 'wxpay') {
        this.pay(this.orderData.outTradeNo, 2, 1)
      } else {
        this.pay(this.orderData.outTradeNo, 1, 1)
      }
    }
  }
}
</script>

<style lang='scss'>
.pay{
  border:1px solid #cecece;
  margin-top: 30px;
  height: 861px;
  .title{
    padding: 20px 0 20px 30px;
    img{
      float: left;
      margin: 3px 30px 3px 0;
    }
    h1{
      display: inline-block;
      line-height: 50px;
    }
  }
  .order{
    background: #dcdcdc;;
    padding: 30px 0;
    .el-col-12{
      p{
        line-height: 40px;
      }
    }
    .el-col-8{
      line-height: 80px;
    }
  }
  .payMthod{
    padding: 20px;
    .el-tabs__item{
      font-size: 18px;
      img{
        width: 40px;
      }
    }
    .wxtitle{
      line-height: 35px;
      border:2px solid rgb(204, 204, 204);
      padding: 10px 15px;
      img{
        width: 35px;
        float: left;
        margin-right: 10px;
      }
    }
    .qrcode{
      padding: 50px 0 79px 0;
      img{
        display: block;
        margin: 0 auto;
      }
    }
  }
  .successBtn{
    text-align: center;
    h1{
      margin-top:60px;
      margin-bottom: 50px;
      color:#666;
    }
    div{
      margin-top: 50px;
      button{
        width:125px;
        height: 35px;
        padding:10px 12px 20px;
      }
      .myorder{
        margin-right:80px;
        color:#dcdcdc;
        border-color: #dcdcdc;
        &:hover{
          color:#fff;
          border-color: #fff;
          background-color: #dcdcdc;
        }
      }
      .study{
        border-color:#11a074;
        color:#11a074;
        &:hover{
          border-color:#fff;
          color: #fff;
          background-color: #11a074;
        }
      }
    }
  }
}
</style>
