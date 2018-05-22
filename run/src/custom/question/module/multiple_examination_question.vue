<template>
  <div class="multipleExamination">
    <div class="questionTitle"><span>Q{{componentIndex+1}}</span>{{componentData ? componentData.title : ''}}</div>
    <div class="dataChart">
      <div id="chartId" ref="chartRef"></div>
    </div>
    <div class="dataTable">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
            prop="timu"
            label="选项">
        </el-table-column>
        <el-table-column
            prop="count"
            label="计数">
        </el-table-column>
        <el-table-column
            prop="percent"
            label="占比">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "multiple-examination-question",
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
      scalY: this.componentData ? this.componentData.scalY : [],
      scalX: this.componentData ? this.componentData.scalX : [],
      tableData: this.componentData ? this.componentData.tableData : [],
    };
  },
  mounted() {
    var t=this;
    require.ensure(['echarts'], function(require){
      var myChart = require("echarts").init(t.$refs.chartRef);
      var options = {
        // title: {
        //     text: '世界人口总量',
        //     subtext: '数据来自网络'
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          //data: ["巴西", "印尼", "美国", "印度", "中国", "世界人口(万)"]
          data: t.scalY,
        },
        series: [
          {
            name: "计数",
            type: "bar",
            data: t.scalX,
            itemStyle: {
                normal:{
                    color: '#3DB8FA'
                },
            },
          }
        ]
      };
      // 绘制图表
      myChart.setOption(options);
    },'echarts');
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.multipleExamination {
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
  .dataChart {
    width: 100%;
    padding: 20px;
    #chartId {
      width: 100%;
      height: 200px;
    }
  }
  .dataTable {
    width: 100%;
    padding: 0 20px 20px 20px;
  }
}
</style>