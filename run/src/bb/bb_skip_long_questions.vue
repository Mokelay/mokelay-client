<template>
  <div class="skipLongQuestions">
    <div class="subjectContent">
      <div class="subjectText">
        <div class="title">{{title}}</div>
        <div class="items">
          <el-radio-group v-model="radioValue">
            <div v-for="(value, index) in options" :key="index" tabindex="2"  class="radioItem">
              <el-radio :label="index">{{""}}</el-radio>
              <!-- <div class="itemOperate"> -->
                <div class="radioText">{{value.timu}}</div>
              <!-- </div> -->
            </div>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'bb-skip-long-questions',
    props: {
      title:{
        type:String,
        default: '请编辑标题'
      },
      isRequired: {
        type: Boolean,
        default: true
      },
      options:{
        type:Array,
        default: function(){ return [{timu: "请编辑选项"}];}
      }
    },
    data() {
      return {
        radioValue: ''
      };
    },
    created:function(){
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>
.skipLongQuestions {
  width: 100%;
  margin-top: 10px;
  border: 1px solid #e4e4e4;
  display: inline-flex;
  display: -webkit-inline-flex;
  box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  -moz-box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  .subjectContent {
    flex-basis: 100%;
    padding: 6px 0px 0px 0px;
    .subjectText {
      padding: 0px 20px 0px 20px;
      .title {
        line-height: 36px;
        width: 100%;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #444444;
        border: none;
        &:focus {
          border: 1px solid #e4e4e4;
          outline: none;
        }
      }
      .items {
        padding-left: 9px;
        .el-radio-group{
          width: 100%;
          .radioItem{
            width: 100%;
            outline: none;
            height: 36px;
            display: inline-flex;
            display: -webkit-inline-flex;
            .el-radio__inner{
              width: 16px;
              height: 16px;
            }
            .radioText{
              flex-basis: 100%;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #666666;
            }
          }
        }
      }
    }
    .addItem {
      padding: 0px 20px 0px 20px;
      line-height: 33.5px;
      div{
        width: 75px;
        cursor: pointer;
        .addIcon{
          font-family: "iconfont";
          font-size: 14px;
          color: #999999;
          font-style: normal;
        }
        span{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
        }
      }
    }
  }
}
</style>