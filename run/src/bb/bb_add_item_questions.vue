<template>
  <div class="addItemQuestions">
    <div class="title">{{title.timu}}</div>
    <div class="inputArea"></div>
    <div class="itemQuestion" v-for="(value, index) in options.list" :key="index">
      <div class="title">{{value.timu}}</div>
      <div class="inputArea"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "bb_add_item_questions",
  props: {
    title: {
      type: Object,
      default: function(){
        return {timu: '可添加项题'}
      }
    },
    options: {
      type: Object,
      default: function(){ 
        return {list: [{timu: '可添加项题一'}]};
      }
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      checkList: []
    };
  },
  beforeDestroy() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.addItemQuestions{
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  padding-right: 20px;
  padding-left: 20px;
  border: 1px solid #e4e4e4;
  box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  -moz-box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
  .title{
        width: 100%;
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #444444;
    }
    .inputArea{
        height: 36px;
        width: 100%;
        border: 1px solid #E4E4E4;
        border-radius: 4px;
    }
  .itemQuestion{
    .title{
        width: 100%;
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #444444;
    }
    .inputArea{
        height: 36px;
        width: 100%;
        border: 1px solid #E4E4E4;
        border-radius: 4px;
    }
  }
}
</style>