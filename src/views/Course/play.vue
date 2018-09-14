<template>
  <div>
    <remote-js src="https://juristedu-frontend.oss-cn-beijing.aliyuncs.com/aliplayer-min.js"></remote-js>
    <remote-js src="https://g.alicdn.com/de/prismplayer/2.6.0/json/json.min.js"></remote-js>
    <p class="top">课程 > {{courseInfo.name}}</p>
    <el-row>
      <el-col :span="24" class="course_content_top">
        <div style="position:relative">
          <div ref="J_prismPlayer" class="prism-player" id="J_prismPlayer" style="height:500px;"></div>
          <div v-if="palyerMessage!==''" style="width:100%;height:100%;line-height:200px;position:absolute;top:0;color:#fff;text-align:center;background:#666;">{{palyerMessage}}</div>
        </div>
      </el-col>
      <el-col :span="16" class="course_content_left">
        <el-tabs type="border-card">
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
          <el-tab-pane label="练习">
            <div v-html="courseInfo.info"></div>
          </el-tab-pane>
          <el-tab-pane label="聊天室">
            <div v-html="courseInfo.info"></div>
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

<style>
  @import '//g.alicdn.com/de/prismplayer/2.5.1/skins/default/aliplayer-min.css';
</style>

<script>
export default {
  name: '',

  components: {
    'remote-js': {
      render (createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: this.src } })
      },
      props: {
        src: { type: String, required: true }
      }
    }
  },

  data () {
    return {
      courseInfo: {}, // 课程详情数据
      recommend: [], // 推荐课程数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      id: this.$route.params, // 课程ID
      courseContentId: this.$route.query.courseContentId, // 课程内容ID
      courseContent: {}, // 课程章节内容数据
      Quality: 0, // 视频清晰度
      palyerMessage: ''// 视频播放信息
    }
  },

  watch: {
    '$route' (to, from) {
      this.getCourseContent(this.$route.query.courseContentId)
    }
  },

  mounted () {
    this.getCourseInfo()
    this.getRecommendList()
  },

  methods: {
    // 获取推荐课程
    getRecommendList () {
      this.axios.get('/api/services/app/Course/GetRecommendList').then(res => {
        if (res.data.success) {
          this.recommend = res.data.result
        }
      })
    },
    // 获取课程详情数据
    getCourseInfo () {
      this.axios.get('/api/services/app/Course/GetCourse?Id=' + this.$route.params.id).then(res => {
        if (res.data.success) {
          this.courseInfo = res.data.result
          if (this.courseContentId) {
            this.getCourseContent(this.courseContentId)
          } else {
            this.palyerMessage = '请选择观看课程'
          }
        }
      })
    },
    // 获取课程内容ID
    getCourseContent (id) {
      let _this = this
      _this.axios.get('/api/services/app/CourseContent/GetCourseContent?Id=' + id).then(res => {
        if (res.data.success) {
          _this.courseContent = res.data.result
          if (_this.courseInfo.courseType === 0) {
            // (课程直播已结束  且  支持回看)  或  已生成回看
            if ((res.data.result.liveStatus === 3 && res.data.result.supportPlayback) || res.data.result.recordingCompleted) {
              _this.aliPlay(id)
            }
            // 直播课程不支持回看
            if (!res.data.result.supportPlayback) {
              _this.palyerMessage = '此课程没有视频回看'
            }
            // 直播课程未开始
            if (res.data.result.liveStatus === 0) {
              _this.palyerMessage = '此课程尚未开始'
            }
            // 直播课程进行中或暂停中
            if (res.data.result.liveStatus === 1 || res.data.result.liveStatus === 2) {
              _this.aliLivePlay(id)
            }
          } else {
            _this.aliPlay(id)
          }
        }
      })
    },
    // ali播放
    ali (videoId, playauth, cover) {
      /* global Aliplayer:false */
      /* eslint-disable no-new */
      new Aliplayer(
        {
          id: 'J_prismPlayer',
          width: '100%',
          height: '500px',
          preload: false, // 循环播放
          autoplay: true, // 自动播放
          vid: videoId, // 视频Id
          playauth: playauth, // 播放凭证
          // useH5Prism: true,//H5播放器
          useFlashPrism: true, // Flash播放器
          // cover: cover,//封面
          showBuffer: true, // 显示缓冲图标
          loadDataTimeout: '10', // 切换低清晰度缓冲时间:
          language: 'zh-cn', // 语言
          snapshot: false, // 截图
          showBarTime: 5000, // 隐藏按钮控制按钮时间
          skinLayout: [
            { name: 'bigPlayButton', align: 'cc' },
            {
              name: 'controlBar',
              align: 'blabs',
              x: 0,
              y: 0,
              children: [
                { name: 'progress', align: 'tlabs', x: 0, y: 0 },
                { name: 'playButton', align: 'tl', x: 15, y: 26 },
                { name: 'nextButton', align: 'tl', x: 10, y: 26 },
                { name: 'timeDisplay', align: 'tl', x: 10, y: 24 },
                { name: 'fullScreenButton', align: 'tr', x: 10, y: 25 },
                { name: 'streamButton', align: 'tr', x: 10, y: 23 },
                { name: 'volume', align: 'tr', x: 10, y: 25 }
              ]
            },
            {
              name: 'fullControlBar',
              align: 'tlabs',
              x: 0,
              y: 0,
              children: [
                { name: 'fullTitle', align: 'tl', x: 25, y: 6 },
                { name: 'fullNormalScreenButton', align: 'tr', x: 24, y: 13 },
                { name: 'fullTimeDisplay', align: 'tr', x: 10, y: 12 },
                { name: 'fullZoom', align: 'cc' }
              ]
            }
          ]
        },
        function (player) {
          player.play()
        }
      )
    },
    // 获取点播播放凭证
    aliPlay (id) {
      let _this = this
      this.axios.get('/api/services/app/CourseContent/GetVodVideoPlayAuthForPC?id=' + id).then(response => {
        if (response.status === 200 && response.data.success === true) {
          _this.ali(_this.courseContent.videoFilePath, response.data.result, _this.courseContent.cover)
          this.palyerMessage = ''
        } else {
          _this.ali()
          this.palyerMessage = response.data.error.message
        }
      }).catch(error => {
        if (error) {
          this.$message(error)
        }
      })
    },
    aliLive (source) {
      var player = new Aliplayer(
        {
          id: 'J_prismPlayer',
          width: '100%',
          height: '500px',
          preload: false, // 循环播放
          autoplay: true, // 自动播放
          isLive: true, // 是否直播
          source: source,
          useH5Prism: true, // H5播放器
          // useFlashPrism: true, // Flash播放器
          // cover: cover,//封面
          showBuffer: true, // 显示缓冲图标
          loadDataTimeout: '10', // 切换低清晰度缓冲时间:
          language: 'zh-cn', // 语言
          snapshot: false, // 截图
          showBarTime: 5000, // 隐藏按钮控制按钮时间
          skinLayout: [
            { name: 'bigPlayButton', align: 'cc' },
            {
              name: 'controlBar',
              align: 'blabs',
              x: 0,
              y: 0,
              children: [
                { name: 'progress', align: 'tlabs', x: 0, y: 0 },
                { name: 'playButton', align: 'tl', x: 15, y: 26 },
                { name: 'nextButton', align: 'tl', x: 10, y: 26 },
                { name: 'timeDisplay', align: 'tl', x: 10, y: 24 },
                { name: 'fullScreenButton', align: 'tr', x: 10, y: 25 },
                { name: 'streamButton', align: 'tr', x: 10, y: 23 },
                { name: 'volume', align: 'tr', x: 10, y: 25 }
              ]
            },
            {
              name: 'fullControlBar',
              align: 'tlabs',
              x: 0,
              y: 0,
              children: [
                { name: 'fullTitle', align: 'tl', x: 25, y: 6 },
                { name: 'fullNormalScreenButton', align: 'tr', x: 24, y: 13 },
                { name: 'fullTimeDisplay', align: 'tr', x: 10, y: 12 },
                { name: 'fullZoom', align: 'cc' }
              ]
            }
          ]
        },
        function (player) {
          player.play()
        }
      )
      player.on('onM3u8Retry', function () {
        this.palyerMessage = '主播暂时离开，请稍后......'
      })
      player.on('liveStreamStop', function () {
        this.palyerMessage = '直播已结束'
      })
    },
    aliLivePlay (id) {
      let _this = this
      this.axios.get('/api/services/app/CourseContent/GetCourseContentLivePlayAddressForPC?Id=' + id + '&Quality=' + this.Quality).then(res => {
        console.log(res)
        if (res.data.success) {
          _this.aliLive(res.data.result)
          _this.palyerMessage = ''
        } else {
          _this.palyerMessage = res.data.error.message
        }
      })
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
