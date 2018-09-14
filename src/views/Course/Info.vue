<template>
  <div>
    <p class="top">课程 > {{courseInfo.name}}</p>
    <el-row>
      <el-col :span="24" class="course_content_top">
        <div class="course_content_top_left">
          <img :src="courseInfo.cover">
        </div>
        <div class="course_content_top_right">
          <h1>{{courseInfo.name}}</h1>
          <p>适用人群：{{courseInfo.targetUser}}</p>
          <p>课程目标：{{courseInfo.target}}</p>
          <div><span>课时：{{courseInfo.period}}节</span><span style="margin-left:45px;">学员：{{courseInfo.studentCount}}</span></div>
          <div>讲师：<span v-for="(item,index) in courseInfo.teacher" :key="index" :style="{marginLeft:index>0?'8px':''}">{{item.name}}</span></div>
          <div class="price">
            价格:<span>{{courseInfo.isFree?'免费': courseInfo.currentPrice}}</span>
            <el-button type="primary" v-if="courseInfo.isPay||courseInfo.isFree"><router-link tag="span" :to="'/course/play/'+courseInfo.id">立即学习</router-link></el-button>
            <el-button type="primary" v-else @click="goToPay">立即购买</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="16" class="course_content_left">
        <el-tabs type="border-card">
          <el-tab-pane label="课程介绍">
            <div v-html="courseInfo.info"></div>
          </el-tab-pane>
          <el-tab-pane label="课程列表">
            <el-tree
              ref="CatalogTree"
              :data="courseInfo.courseCatalog"
              default-expand-all
              node-key="id"
              :indent="25">
              <span class="course-catalog-tree-node" slot-scope="{ node, data }" :style="{background:node.data.type===0?'#f4f4f4':node.data.type===1?'#fafafa':''}">
                <span>
                  <img src="../../assets/img/nosow.png" v-if="node.data.type===2">
                  {{ node.data.name }}
                  <span v-if="node.data.type===2">
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">{{courseInfo.isFree?'立即学习':courseInfo.isPay?'立即学习':node.data.isAudition?'免费试听':'需要购买'}}</div>
                      <router-link :to="{name:'play',params:{id:courseInfo.id},query: { courseContentId: node.data.id }}" v-if="courseInfo.isFree||courseInfo.isPay||node.data.isAudition"><img src="../../assets/img/SP.png"></router-link>
                      <div v-else style="display:inline-block;width:36px;">&nbsp;</div>
                    </el-tooltip>
                    <span>{{node.data.duration}}</span>
                  </span>
                  <i class="fa fa-minus" v-if="node.expanded && node.data.type!==2"></i>
                  <i class="fa fa-plus" v-else-if="node.data.type!==2"></i>
                </span>
              </span>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="8" class="course_content_right">
        <div style="margin-bottom:15px;">
          <p style="margin-top:25px;border-left:5px solid #b01f24;padding-left:10px;">推荐课程</p>
          <ul>
            <router-link tag="li" :to="'/course/info/'+item.id" v-for="(item,index) in recommend" :key="index">
                <div>
                  <img :src="item.cover">
                  <div>
                    <p>{{item.name}}</p>
                    <span>讲师：<span v-for="(items,indexs) in item.teacher" :key="indexs" :style="{marginLeft:indexs>0?'8px':''}">{{items.name}}</span></span>
                    <p>课时：{{item.period}}</p>
                  </div>
                </div>
            </router-link>
          </ul>
        </div>
        <div>
          <div style="padding:20px;">
            <img src="../../assets/img/EWM.png" style="width:100px;height:100px;float:left;margin-right:20px;">
            <h3 style="line-height:28px;font-weight:400;padding:22px 0;">关注公众号<br/>获取更多法考动态</h3>
          </div>
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
      courseInfo: {},
      recommend: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  watch: {
    '$route' (to, from) {
      this.getCourseInfo()
      this.getRecommendList()
    }
  },

  mounted () {
    this.getCourseInfo()
    this.getRecommendList()
  },

  methods: {
    // 获取课程详情
    getCourseInfo () {
      this.axios.get('/api/services/app/Course/GetCourse?Id=' + this.$route.params.id).then(res => {
        if (res.data.success) {
          this.courseInfo = res.data.result
        }
      })
    },
    // 获取推荐课程
    getRecommendList () {
      this.axios.get('/api/services/app/Course/GetRecommendList').then(res => {
        if (res.data.success) {
          this.recommend = res.data.result
        }
      })
    },
    // 前往支付
    goToPay () {
      let _this = this
      if (_this.cookie.get('token')) {
        _this.axios.post('/api/services/app/Order/CreateMyWebOrder', { buyerMessage: '', item: [{ courseId: _this.courseInfo.id, quantity: 1 }] }).then(res => {
          if (res.data.success) {
            _this.$router.push({ name: 'pay', query: { outTradeNo: res.data.result } })
          }
        })
      } else {
        _this.$router.push({ name: 'Login', query: { 'returnUrl': _this.$route.fullPath } })
      }
    }
  }
}
</script>

<style lang='scss'>
.top{
  height:50px;
  line-height: 50px;
  font-size: 12px;
}
.course_content_top{
  background:#fff;
  padding:25px 15px;
  margin-bottom: 20px;
  .course_content_top_left{
    width:475px;
    height:290px;
    float:left;
    margin-right: 30px;
    img{
      width:100%;
      height:100%;
    }
  }
  .course_content_top_right{
    width:605px;;
    float:right;
    h1{
      font-weight: 400;
      margin:20px 0;
    }
    P{
      font-size: 14px;
      margin-bottom:10px;
    }
    div{
      font-size: 14px;
      margin-bottom:10px;
    }
    .price{
      padding:15px 0 4px;
      border-top:2px dotted #ebeaeb;
      font-size:14px;
      line-height: 40px;
      margin-bottom: 0;
      >span{
        font-size: 24px;
        font-weight: bold;
        color:#b01f24;
        margin-left: 20px;
      }
      button{
        width:155px;
        height:45px;
        background:#b01f24;
        border-radius: 0;
        float:right;
        margin-right: 15px;
      }
    }
  }
}
.course_content_left{
  >div{
    background:#fff;
    width:760px;
    float:left;
    border:none;
    .el-tabs__header{
      background-color: #fff;
      .el-tabs__nav-scroll{
        padding-left:15px;
      }
      .el-tabs__item{
        height: 45px;
        font-size: 18px;
      }
      .el-tabs__item.is-active{
        color:red;
        background-color:#FEF2F2;
        border-left-color: #EB1B1B;
        border-right-color: #EB1B1B;
        border-top:3px solid #EB1B1B;
      }
      .el-tabs__item:not(.is-disabled):hover{
        color:#333;
        background:#eee;
      }
    }
  }
}
.course_content_right{
  >div{
    background:#fff;
    width:360px;
    float:right;
    ul{
      margin-bottom: 10px;
      li{
        padding:15px 20px;
        img{
          width:72px;
          height:72px;
          float:left;
          margin-right:15px;
        }
        div{
          line-height: 24px;
        }
      }
    }
  }
}
.el-tree{
  padding-top: 30px;
  .el-tree-node__expand-icon{
    font-size: 20px;
  }
  .el-tree-node__content{
    height: 55px;
    margin-bottom: 15px;
    .el-tree-node__expand-icon{
      display:none;
    }
  }
}
.course-catalog-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 5px;
  padding-left: 10px;
  height: 55px;
  border-bottom: 1px solid #f4f4f4;
  img{
    display:inline-block;
  }
  i{
    float:right;
    margin-right: 20px;
  }
  >span{
    width:100%;
    span{
      float:right;
      img{
        margin-right: 20px;
      }
    }
  }
}
.el-tooltip__popper.is-light{
  border:none;
}
</style>
