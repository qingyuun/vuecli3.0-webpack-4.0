<template>
  <div>
    <h2 class="title">我的订单</h2>
    <div class="user_content">
      <div class="user_content_top">
        <span>课程名称</span>
        <span>订单价格</span>
        <span>订单状态</span>
        <span>订单操作</span>
      </div>
      <ul>
        <li v-for="(item,index) in orderData" :key="index">
          <div><span>{{item.gmtCreate.split(' ')[0]}}</span>订单编号：{{item.outTradeNo}}<i class="el-icon-delete" @click="removeOrder(item.outTradeNo)"></i></div>
          <div>
            <div>
                <img :src="item.items[0].courseCover">
                <div>
                  <p>{{item.items[0].courseName}}</p>
                  <p>
                    讲师：
                    <span v-for="(items,indexs) in item.items[0].courseTeacher" :key="indexs" :style="{marginLeft:indexs>0?'8px':''}">{{items}}</span>
                  </p>
                </div>
            </div>
            <div>￥{{item.totalAmount}}</div>
            <div>{{item.status===0?'等待支付':item.status===1?'订单关闭':item.status===2?'支付成功':'订单关闭'}}</div>
            <div>
              <el-button type="danger" v-if="item.status===0"><router-link tag="span" :to="{name:'pay',query:{outTradeNo:item.outTradeNo}}">立即付款</router-link></el-button>
              <el-button type="success" v-if="item.status===2">立即学习</el-button>
            </div>
          </div>
        </li>
      </ul>
      <page style="text-align:center;margin-top:20px;" v-show="totalCount>14" :page-index="PageIndex" :page-size="PageSize" :total="totalCount" v-on:listenToChildEvent="changePage"></page>
    </div>
  </div>
</template>

<script>
import page from '@/components/page.vue'
export default {
  name: '',

  components: {
    page
  },

  data () {
    return {
      orderData: [],
      PageIndex: 1,
      PageSize: 5,
      totalCount: 0
    }
  },

  watch: {
  },

  mounted () {
    this.getOrderData()
  },

  methods: {
    getOrderData () {
      let _this = this
      this.axios.get('/api/services/app/Order/GetMyOrderPagedList?PageIndex=' + this.PageIndex + '&PageSize=' + this.PageSize).then(res => {
        if (res.data.success) {
          _this.orderData = res.data.result.items
          _this.totalCount = res.data.result.totalCount
        }
      })
    },
    changePage (data) {
      this.PageIndex = data.index
      this.PageSize = data.size
      this.getOrderData()
    },
    removeOrder (id) {
      let _this = this
      this.$confirm('您确定要删除该订单吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.axios.delete('/api/services/app/Order/DeleteMyOrder?OutTradeNo=' + id).then(res => {
          if (res.data.success) {
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
            this.orderData.map((x, index) => x.outTradeNo === id ? _this.orderData.splice(index, 1) : this.orderData)
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
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
  padding-top:20px;
  .user_content_top{
    height:45px;
    line-height: 45px;
    font-size: 16px;
    background:#f4f4f4;
    padding:0 35px;
    span{
      padding-left: 20px;
      display:inline-block;
      &:first-child{
        width:380px;
      }
      &:nth-child(2){
        width:80px;
      }
      &:nth-child(3){
        width:130px;
      }
    }
  }
  ul{
    li{
      margin-top:30px;
      >div{
        border:1px #f4f4f4 solid;
        border-radius: 5px;
        &:first-child{
          padding:0 20px;
          line-height: 43px;
          border-bottom: none;
          span{
            display:inline-block;
            padding:0 0 0 10px;
            margin-right:40px;
          }
          i{
            float:right;
            line-height: 44px;
            cursor:pointer;
          }
        }
        &:nth-child(2){
          padding:20px;
          >div{
            display:inline-block;
            height:95px;
            &:first-child{
                width:420px;
                float:left;
              img{
                width:165px;
                height:95px;
                margin-right: 20px;
                float:left;
              }
              div{
                width:215px;
                display:inline-block;
                p{
                  line-height: 31px;
                }
              }
            }
            &:nth-child(2){
              width:100px;
              text-align: center;
              line-height: 95px;
              float:left;
            }
            &:nth-child(3){
              width:150px;
              text-align: center;
              line-height: 95px;
              float:left;
            }
            &:nth-child(4){
              line-height: 95px;
            }
          }

        }
      }
    }
  }
}
</style>
