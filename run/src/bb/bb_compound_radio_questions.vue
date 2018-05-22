<template>
  <div class="compoundRadioQuestions">
    <div class="title">{{title}}</div>
    <div class="items">
        <div class="quesItem" v-for="(value, index) in options" :key="index">
            <div class="itemTitle">{{value.timu}}</div>
            <div v-for="(value1, index1) in value.list" :key="index1">
                <div class="item1Title">{{value1.timu}}</div>
                <el-radio-group v-model="radioValue[index]">
                    <div class="itemRadio" v-for="(value2, index2) in value1.list" :key="index2">
                        <el-radio :label="index2">{{""}}</el-radio>
                        <div class="radioText">{{value2.timu}}</div>
                    </div>
                </el-radio-group>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "bb_compound_radio_questions",
  props: {
    title: {
      type: String,
      default: "复合型单选题"
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default: function() {
        return [
          {
            timu: "题目一",
            list: [
              {
                timu: "子题目一",
                list: [
                  {timu: '选项一'}
                ]
              }
            ]
          }
        ];
      }
    }
  },
  data() {
    var radioValue = [];
    for (let i = 0; i < this.options.length; i++) radioValue[i] = "";
    return {
      radioValue: radioValue
    };
  },
  beforeDestroy() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.compoundRadioQuestions {
  width: 100%;
  margin-top: 10px;
  border: 1px solid #e4e4e4;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  .title {
    width: 100%;
    line-height: 36px;
    padding-left: 20px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #444444;
  }
  .items {
    width: 100%;
    padding-left: 20px;
    .quesItem {
      width: 100%;
      .itemTitle {
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #444444;
        width: 100%;
        padding-left: 6px;
      }
      .item1Title {
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        width: 100%;
        padding-left: 6px;
      }
      .itemRadio {
        height: 36px;
        width: 100%;
        padding-left: 10px;
        display: inline-flex;
        display: -webkit-inline-flex;
        .el-radio__inner {
          width: 16px;
          height: 16px;
        }
        .radioText {
          flex-basis: 100%;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }
}
</style>


