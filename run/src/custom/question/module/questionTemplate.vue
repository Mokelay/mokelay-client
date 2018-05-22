<template>
  <div class="myquestion_template">
    <div class="question_info">
      <div class="image_icon">
        <img :src="imgSrc" />
        <div :class="['twoCodeview', data.online_status ? 'afterLocation' : '']" :style="{display: cursorFlag ? 'block' : 'none'}">
          <div class="imgView">
            <canvas :id="'qrccode-canvas'+data.id" ref='twoCodeDom'></canvas>
          </div>
          <div class="text">扫一扫即可答卷</div>
        </div>
      </div>
      <div class="temp_bottom">
        <div class="question_tatus"><i :class="data.online_status == 1 ? 'release ty-icon_duoxuan' : 'notRelease ty-wenjuan_wenfabu'"></i><span :class="data.online_status == 1 ? 'releaseText' : 'notReleaseText'">{{data.online_status == 1 ? '已发布' : '未发布'}}</span></div>
        <div class="question_operate">
          <el-tooltip class="item firstIcon" placement="top" effect="light" content="编辑问卷">
            <router-link :to="`/questionnaire/index/question-layout?param=${data.id}`">
              <i class="iconfont ty-wenjuan_bianji"  :style="{display: data.online_status == 1 ? 'none' : ''}"></i>
            </router-link>
          </el-tooltip>
          <el-tooltip class="item firstIcon" placement="top" effect="light" content="撤回问卷">
            <i :style="{display: data.online_status == 1 ? '' : 'none'}" class="iconfont ty-icon_jujue" @click="releaseReturn"></i>
          </el-tooltip>
          <i class="iconfont ty-icon_erweima twoCodeHover" @mouseover="mouseoverTwocode" @mouseout="cursorFlag=false" @click="createTwoCodeImage"></i>
          <el-tooltip class="item" placement="top" effect="light" content="复制问卷">
            <i class="iconfont ty-wenjuan_fuzhi" @click="questionCopy"></i>
          </el-tooltip>
          <el-tooltip class="item" placement="top" effect="light" content="删除问卷">
            <i class="iconfont ty-icon_lajitong" @click="questionDelete"  :style="{display: data.online_status == 1 ? 'none' : ''}"></i>
          </el-tooltip>
          <el-tooltip class="item" placement="top" effect="light" content="编辑详情">
            <i class="iconfont ty-icon_shezhi1" @click="editQuestionDetail"  :style="{display: data.online_status == 1 ? 'none' : ''}"></i>
          </el-tooltip>
          <el-tooltip class="item" placement="top-start" effect="light" content="数据报表">
            <router-link :to="`/questionnaire/index/question-report?param=${data.id}`">
              <i class="iconfont ty-wenjuan_sjbaobiao" :style="{display: data.online_status == 1 ? '' : 'none'}"></i>
            </router-link>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="question_title">{{data.title}}</div>
  </div>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {
      status: false,
      cursorFlag: false,
    }
  },
  computed: {
    imgSrc: function(){
      return require('../img/questionsImage.png');
    }
  },
  methods: {
    qrcodeShow(){
      var qsId = this.data.id;
      var surveystate = this.data.online_status == 1 ? 'yes' : 'no';
      var path = this.data.slide_page ? 'surveySlide' : 'survey'
      require.ensure(['qrcode'], function(require){
        var QRCode = require('qrcode');
        // QRCode.toCanvas(document.getElementById('qrccode-canvas'+qsId), window._TY_ENV.questionnaireHost+"/#/survey?id="+qsId+'&surveystate='+surveystate,
        //   (error)=>{});
        QRCode.toCanvas(document.getElementById('qrccode-canvas'+qsId), `${window._TY_ENV.questionnaireHost}/#/${path}?id=${qsId}&surveystate=${surveystate}`,
          (error)=>{});
      },'qrcode')
    },
    questionCopy(){
      this.$emit('copyQuestion', {id: this.data.id});
    },
    questionDelete(){
      this.$emit('deleteQuestion', {id: this.data.id});
    },
    mouseoverTwocode(){
      this.cursorFlag = true;
      this.qrcodeShow();
    },
    editQuestionDetail(){
      this.$emit('editQuestionDetail', {data: this.data});
    },
    releaseReturn(){
      this.$emit('releaseReturn', {id: this.data.id});
    },
    fixtype(type){
            type=type.toLocaleLowerCase().replace(/jpg/i,'jpeg');
            var r=type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/'+r;
        },
    createTwoCodeImage(){
      var element = document.createElement("a");
      element.href = this.$refs.twoCodeDom.toDataURL("image/png");
      element.download = this.data.title + ".png";
      element.click();
    }
  }
};
</script>
<style lang="less" scoped>
.myquestion_template{
    margin: 0px 20px 20px 0px;
    .question_info{
        width: 230px;
        height: 250px;
        border: 1px solid #E4E4E4;
        .image_icon{
          width: 100%;
          height: 210px;
          border-bottom: 1px solid #E4E4E4;
          position: relative;
          img{
            width: 210px;
            height: 117px;
            margin-top: 15px;
            margin-left: 10px;
          }
          .twoCodeview{
              position: absolute;
              border: 1px solid #E4E4E4;
              box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
              background-color: #fff;
              left: 0px;
              right: 0px;
              bottom: 0px;
              margin: auto;
              width: 180px;
              height: 200px;
              .imgView{
                width: 100%;
                height: 160px;
                canvas{
                  width: 100% !important;
                  height: 160px !important;
                }
              }
              .text{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #0091EA;
                width: 100%;
                line-height: 40px;
                height: 40px;
                text-align: center;
              }
              &:after{
                border: 12px solid rgba(0,0,0,0);
                border-top-color: #fff;
                width: 12px;
                height: 12px;
                position: absolute;
                bottom: -20px;
                left: 35px;
                content: ''
              }
          }
          .afterLocation{
            &:after{
              left: 35px;
            }
          }
        }
        .temp_bottom{
          .question_tatus{
            width: 100%;
            line-height: 40px;
            padding-left: 10px;
            i{
              font-style: normal;
            }
            .release{
              font-family: 'iconfont';
              font-size: 16px;
              color: #32BE78;
            }
            .notRelease{
              font-family: 'iconfont';
              font-size: 16px;
              color: #FFA63A;
            }
            .releaseText{
              margin-left: 6px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #32BE78;
            }
            .notReleaseText{
              margin-left: 6px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #FFA63A;
            }
          }
          .question_operate{
            display: none;
            width: 100%;
            line-height: 40px;
            background-color: #F5F5F5;
            padding-left: 25px;
            a{
              text-decoration: none;
            }
            i{
              cursor: pointer;
              &:hover{
                color: #0091EA;
              }
            }
            .iconfont{
              margin-left: 20px;
              font-family: 'iconfont';
              font-size: 16px;
              color: #999999;
            }
            .firstIcon{
              margin-left: 0px;
              i{
                margin-left: 0px;
              }
            }
          }
          &:hover{
            .question_tatus{
              display: none;
            }
            .question_operate{
              display: block;
            }
          }
        }
    }
    .question_title{
        width: 230px;
        line-height: 40px;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #444444;
    }
}
</style>