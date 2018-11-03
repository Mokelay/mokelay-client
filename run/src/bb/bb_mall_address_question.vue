<template>
    <div class="mallAddress">
        <div class="questionName">{{title}}</div>
        <div class="questionContent" v-for="(value, index) in options.list" :key="index">
            <div class="timu">{{value.timu}}</div>
            <div class="input"><span class="text">请选择{{value.timu}}</span><i></i></div>
        </div>
    </div>
</template>
<script>
export default {
  name: "bb_mall_address_question",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: '请编辑题目'
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default: function(){
        return {list: [{timu: '请编辑添加项'}]}
      }
    },
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.mallAddress {
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  padding-right: 20px;
  padding-left: 20px;
  border: 1px solid #e4e4e4;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  .questionName{
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #444444;
  }
  .questionContent{
    .timu{
      line-height: 36px;
      font-size: 14px;
      color: #444;
      line-height: 36px;
    }
    .input{
      display: inline-block;
      width: 260px;
      height: 36px;
      padding-left: 10px;
      border: 1px solid #E4E4E4;
      border-radius: 4px;
      position: relative;
      .text{
        font-size: 14px;
        color: #999;
        display: inline-block;
        line-height: 36px;
      }
      i{
        position: absolute;
        right: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        border: none;
        width: 0px;
        height: 0px;
        border-top: 5px solid #666666; 
        border-right: 5px solid transparent;  
        border-left: 5px solid transparent; 
      }
    }
  }
}
</style>