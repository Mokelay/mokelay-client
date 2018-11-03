<template>
  <div class="radioExamination">
    <!-- <div class="serialNumber">
      <span class="text">Q{{serial}}</span>
      <span class="deleteItem">
        <i class="deleteIcon icon-icon_lajitong"></i>
      </span>
    </div> -->
    <div class="subjectContent">
      <div class="subjectText">
        <!-- <input class="title" v-model="title" /> -->
        <div class="title">{{title}}</div>
        <div class="items">
          <el-radio-group v-model="radioValue">
            <div v-for="(value, index) in options" :key="index" tabindex="2"  class="radioItem">
              <el-radio :label="index">{{""}}</el-radio>
              <!-- <div class="itemOperate"> -->
                <!-- <input class="radioText" v-model="value.text"/> -->
                <div class="radioText">{{value.timu}}</div>
                <!-- <span class="deleteIcon"><i class="deleteIcon icon-icon_lajitong"></i></span> -->
              <!-- </div> -->
            </div>
          </el-radio-group>
        </div>
      </div>
      <!-- <div class="addItem">
        <div>
          <i class="addIcon icon-icon_faqi1"></i>
          <span>添加选项</span>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
  export default {
    name:'bb-radio-examination',
    props: {
      title:{
        type:String,
        default: '单选题'
      },
      isRequired: {
        type: Boolean,
        default: true
      },
      options:{
        type:Array,
        default: function(){ return [{timu: "选项一"}];}
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
.radioExamination {
  width: 100%;
  margin-top: 10px;
  border: 1px solid #e4e4e4;
  display: inline-flex;
  display: -webkit-inline-flex;
  box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  -moz-box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  // .serialNumber {
  //   width: 50px;
  //   padding-top: 10px;
  //   background: #f5f5f5;
  //   border-right: 1px solid #e4e4e4;
  //   text-align: center;
  //   position: relative;
  //   .text{
  //     font-family: PingFangSC-Regular;
  //     font-size: 16px;
  //     color: #444444;
  //   }
  //   .deleteItem{
  //     position: absolute;
  //     left: 0px;
  //     right: 0px;
  //     margin: auto;
  //     bottom: 11px;
  //     cursor: pointer;
  //     .deleteIcon{
  //       font-family: "iconfont";
  //       font-size: 12px;
  //       color: #999999;
  //       font-style: normal;
  //     }
  //   }
  // }
  .subjectContent {
    flex-basis: 100%;
    padding: 6px 0px 0px 0px;
    .subjectText {
      // border-bottom: 1px dashed #E4E4E4;
      padding: 0px 20px 0px 20px;
      .title {
        line-height: 36px;
        width: 100%;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #444444;
        border: none;
        // padding-left: 10px;
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