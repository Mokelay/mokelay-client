<template>
  <div class="multipleChoice">
    <div class="title">{{title}}</div>
    <div class="items">
        <div class="checkItem" v-for="(value, index) in options" :key="index">
          <el-checkbox label=""></el-checkbox>
          <div class="itemText">{{value.timu}}</div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "bb_multiple_choice_question",
  props: {
    title: {
      type: String,
      default: '多选题',
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    leastNum: {
      type: Number,
      default: 0,
    },
    mostNum: {
      type: Number,
      default: 10,
    },
    options: {
      type: Array,
      default: function(){ return [{timu: '选项一'}]; }
    }
  },
  data() {
    return {
      checkList: []
    };
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.multipleChoice{
  width: 100%;
  margin-top: 10px;
  border: 1px solid #e4e4e4;
  box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  -moz-box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  .title{
    width: 100%;
    line-height: 36px;
    padding-left: 20px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #444444;
  }
  .items{
    width: 100%;
    padding-left: 30px;
    .checkItem{
      line-height: 36px;
      width: 100%;
      display: inline-flex;
      display: -webkit-inline-flex;
      .el-radio__inner{
        width: 16px;
        height: 16px;
      }
      .itemText{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        flex-basis: 100%;
        padding-left: 6px;
      }
    }
  }
}
</style>