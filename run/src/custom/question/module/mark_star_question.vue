<template>
  <div class="markStarQuestion">
    <div class="questionTitle"><span>Q{{componentIndex+1}}</span>{{componentData ? componentData.title : ''}}</div>
    <div class="questionAnswer" v-for="(value, index) in componentData.options" :key="index">
        <!-- <span class="number">答题人数：{{componentData ? componentData.questionCount : ''}}人</span> -->
      <el-table
        :data="tableDataList[index]"
        style="width: 100%">
        <el-table-column
          prop="timu"
          label="">
        </el-table-column>
        <el-table-column v-for="(v, i) in (value.totalStar+1)" :key="v"
          :prop="i.toString()"
          :label="i.toString()+'星'">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
const Util = window._TY_Tool;
export default {
  name: "mark-star-question",
  props: {
    componentData: {
      type: Object
    },
    componentIndex: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 99999,
      total: 0,
      answerList: [],
      // tableData: [],
      tableDataList: {}
    }
  },
  mounted(){
    this.setTabelData();
    this.getPaginationData();
  },
  methods: {
    setTabelData(){
      this.componentData.options.map((value, index)=>{
        let data = {
            "timu": value.timu,
        };
        for(let i=0; i<=value.totalStar; i++){
            data[i] = '0';
        }
        let item = [];
        item.push(data);
        // this.tableData.push(data);
        this.tableDataList[index] = item;
      })
    },
    getPaginationData(){
      let t = this;
      if(t.componentData){
        t.componentData.options.map((value, index)=>{
            Util.get(window._TY_ContentPath+'/cms-page-question-answer', {
            page: t.currentPage,
            pageSize: t.pageSize,
            questionnaire_id: t.componentData ? t.componentData.questionnaire_id : 0,
            question_id: t.componentData ? t.componentData.question_id : 0,
            option_id: t.componentData ? t.componentData.options[index]['option_id'] : 0,
          }).then((response)=>{
            if(response.data.code == 200){
              let data = response.data.data;
              let list = data.page_data.currentRecords;
              let tData = t.tableDataList[index][0];
              list.map((item)=>{
                let key = item.option_content.length == 0 ? '0' : item.option_content;
                let m = tData[key];
                m = parseInt(m) + 1;
                tData[key] = m;
              });
              t.tableDataList[index][0] = tData;
            }
          });
        })
      }
    },
  }
};
</script>
<style lang="less" scoped>
.markStarQuestion{
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
  .questionAnswer{
  }
}
</style>