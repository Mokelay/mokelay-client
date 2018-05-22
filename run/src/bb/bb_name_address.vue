<template>
    <div class="nameAddress">
        <div class="dealerName">{{name.timu}}</div>
        <div class="inputArea"></div>
        <div class="companyLocation">{{location.timu}}</div>
        <div class="locationSelect">
            <div class="province">
                <span class="location">请选择省份</span>
                <span class="downpoint"><i></i></span>
            </div>
            <div class="city">
                <span class="location">请选择城市</span>
                <span class="downpoint"><i></i></span>
            </div>
            <div class="county">
                <span class="location">请选择区县</span>
                <span class="downpoint"><i></i></span>
            </div>
        </div>
        <div class="inputArea"></div>
    </div>
</template>
<script>
export default {
  name: "bb_name_address",
  data() {
    return {};
  },
  props: {
    name: {
      type: Object,
      default: function(){
        return {timu: '请编辑题目'}
      }
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    location: {
      type: Object,
      default: function(){
        return {timu: '请编辑题目'}
      }
    },
  },
  mounted() {},
  beforeDestroy() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.nameAddress {
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  padding-right: 20px;
  padding-left: 20px;
  border: 1px solid #e4e4e4;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  .dealerName,
  .companyLocation {
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #444444;
  }
  .inputArea {
    height: 36px;
    width: 100%;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
  }
  .locationSelect {
    display: inline-flex;
    display: -webkit-inline-flex;
    .province,
    .city,
    .county {
      height: 36px;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
      margin-right: 10px;
      .location {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
        line-height: 36px;
        width: 133px;
        text-align: center;
        display: inline-block;
        vertical-align: top;
      }
      .downpoint{
        display: inline-block;
        width: 36px;
        height: 36px;
        border-left: 1px solid #E4E4E4;
        position: relative;
        i{
          position: absolute;
          left: 0;
          right: 0;
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
}
</style>