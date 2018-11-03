<template>
  <div class="openQuestions">
    <div class="title">{{title}}</div>
    <div class="items">
        <div class="checkItem" v-for="(value, index) in options" :key="index">
          <div class="itemText">{{value.timu}}</div>
          <div class="inputArea"></div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "bb_open_questions",
  props: {
    title: {
      type: String,
      default: '开放题'
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Array,
      default: function(){ return [{timu: '题目一'}]; }
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
.openQuestions{
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
      width: 100%;
      padding-right: 20px;
      padding-bottom: 10px;
      .itemText{
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        width: 100%;
        padding-left: 6px;
      }
      .inputArea{
        height: 36px;
        width: 100%;
        border: 1px solid #E4E4E4;
        border-radius: 4px;
      }
    }
  }
}
</style>