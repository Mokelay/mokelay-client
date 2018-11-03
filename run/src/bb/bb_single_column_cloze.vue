<template>
  <div class="singleColumnCloze">
    <div class="title">{{title}}</div>
    <div class="items">
      <div class="inputArea"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "bb_single_column_cloze",
  props: {
    title: {
      type: String,
      default: '单行填空题',
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
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.singleColumnCloze{
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  padding-right: 20px;
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
    .inputArea{
      height: 36px;
      width: 100%;
      border: 1px solid #E4E4E4;
      border-radius: 4px;
    }
  }
}
</style>