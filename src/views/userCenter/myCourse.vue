<template>
  <div>
    <h2 class="title">我的课程</h2>
    <div class="user_content">
      <ul>
        <li v-for="(item,index) in myCourseData" :key="index">
          <div class="user_content_time">
            <h2>{{item.startTime.split('-')[0]}}</h2>
            <span>{{item.startTime.split('-')[1]}}月{{item.startTime.split('-')[2].split(' ')[0]}}日</span>
          </div>
          <div class="user_content_line">
            <div :style="{border:index===0?'none':''}"></div>
            <div></div>
            <div></div>
          </div>
          <div class="user_content_content">
            <img :src="item.cover" alt="">
            <div>
              <h2>{{item.name}}</h2>
              <div>
                <span>讲师：
                  <span v-for="(items,indexs) in item.teacher" :key="indexs" :style="{marginLeft:indexs>0?'8px':''}">{{items.name}}</span>
                </span>
              </div>
              <p>学习至<span>（ 民法私塾班11 )</span></p>
            </div>
            <el-button type="error" ghost>
              <router-link tag="span" :to="{name:'play',params:{id:item.id}}">继续学习</router-link>
            </el-button>
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
      myCourseData: [],
      PageIndex: 1,
      PageSize: 5,
      totalCount: 0
    }
  },

  watch: {
  },

  mounted () {
    this.getMyCourse()
  },

  methods: {
    getMyCourse () {
      this.axios.get('/api/services/app/Course/GetMyCoursePagedList?PageIndex=' + this.PageIndex + '&PageSize=' + this.PageSize).then(res => {
        this.myCourseData = res.data.result.items
        this.totalCount = res.data.result.totalCount
      })
    },
    changePage (data) {
      this.PageIndex = data.index
      this.PageSize = data.size
      this.getMyCourse()
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
  ul {
    padding:0;
    li{
      height:165px;
      >div{
        float:left;
      }
      .user_content_time{
        display:inline-block;
        padding-top:35px;
        margin-right:5px;
      }
      .user_content_line{
        width:20px;
        display:inline-block;
        margin-right:13px;
        div:nth-child(1){
          border-left:1px #d9d9d9 solid;
          height:50px;
          margin:0 9px;
        }
        div:nth-child(2){
          width:8px;
          height:8px;
          border:1px #d9d9d9 solid;
          border-radius: 50%;
          background:#d9d9d9;
          margin:0 6px;
        }
        div:nth-child(3){
          border-left:1px #d9d9d9 solid;
          height:105px;
          margin:0 9px;
        }
      }
      .user_content_content{
        padding:38px 0 31px;
        border-bottom: 1px #d9d9d9 solid;
        img{
          width:165px;
          height:95px;
          margin-right:25px;
          float:left;
        }
        div{
          width:430px;
          display:inline-block;
          line-height: 31px;
          h2{
            font-weight: 400;
          }
          div{
            font-size: 14px;
            >span:nth-child(1){
              margin-right: 40px;
            }
          }
          p{
            font-size:14px;
            span{
              color:red;
            }
          }
        }
        .el-button{
          width:100px;
          height:35px;
          float:right;
          margin-top:60px;
          border-color:#b01f24;
          color:#b01f24;
          &:hover{
            background-color:#fff3f3
          }
        }
      }
    }
  }
  .el-pagination{
    text-align:center;
  }
}
</style>
