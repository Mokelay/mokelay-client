<template>
  <div class="compoundRadioQuestion">
    <div class="questionTitle"><span>Q{{componentIndex+1}}</span>{{componentData ? componentData.title : ''}}</div>
    <div class="tableArea">
      <div class="dataTable" v-for="(value1, index1) in componentData.tableList" :key="index1">
        <div class="title">{{value1.title}}</div>
        <div class="table" v-for="(value2, index2) in value1.tlist" :key="index2">
          <el-table
            :data="value2.tData"
            style="width: 100%">
            <el-table-column v-for="(value3, index3) in value2.tColumn" :key="index3"
                :prop="value3.prop"
                :label="value3.label">
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="personNumber">答题人数：{{componentData ? componentData.questionCount : ''}}人</div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "compound-radio-question",
  props: {
    componentData: {
      type: Object,
      default: {
        tableList: []
      }
    },
    componentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
.compoundRadioQuestion {
  width: 100%;
  margin-top: 20px;
  border: 1px solid #e4e4e4;
  .questionTitle {
    width: 100%;
    padding: 10px 15px;
    background: #f5f5f5;
    border-bottom: 1px solid #e4e4e4;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #444444;
    span {
      margin-right: 20px;
    }
  }
  .tableArea{
    width: 100%;
    padding: 20px 20px 2px 20px;
    .dataTable {
      width: 100%;
      margin-bottom: 10px;
      border: 1px solid #e4e4e4;
      .title{
        width: 100%;
        padding: 10px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #444444;
      }
      .table{
        width: 100%;
      }
      .personNumber{
        line-height: 36px;
        width: 100%;
        padding-left: 15px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #444444;
      }
    }
  }
  .another{
    width: 100%;
    margin: 20px 20px 10px 20px;
    border: 1px solid #e4e4e4;
    .title{
      width: 100%;
      padding: 10px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #444444;
    }
    .table{
      width: 100%;
    }
    .personNumber{
      line-height: 36px;
      width: 100%;
      padding-left: 15px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #444444;
    }
  }
}
</style>