<template>
  <div class="multipleRadio">
    <div class="questionTitle"><span>Q{{componentIndex+1}}</span>{{componentData ? componentData.title : ''}}</div>
    <div class="tableArea">
      <div class="dataTable">
        <div v-for="(value, index) in tableData" :key="index">
          <div class="separateArea" :style="{display: index==0 ? 'none' : 'block'}"></div>
          <el-table
            :data="value.tData"
            style="width: 100%">
            <el-table-column v-for="(value2, index2) in value.tColumn"  :key="index2"
                :prop="value2.prop"
                :label="value2.label">
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
  name: "multiple-radio-question",
  props: {
    componentData: {
      type: Object
    },
    componentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableData: this.componentData ? this.componentData.tableData : [],
    }
  },
  methods: {
  }
};
</script>
<style lang="less" scoped>
.multipleRadio {
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
    padding: 20px 20px 20px 20px;
    .dataTable {
      width: 100%;
      border: 1px solid #e4e4e4;
      .separateArea{
        width: 100%;
        height: 10px;
        background-color: #f5f5f5;
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
}
</style>