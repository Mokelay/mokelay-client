<template>
  <div class="openQuestion">
    <div class="questionTitle"><span>Q{{componentIndex+1}}</span>{{componentData ? componentData.title : ''}}</div>
    <div class="questionAnswer">
      <div class="answerTemplate" v-for="(value1, index1) in answersData" :key="index1">
        <div class="interLayer"></div>
        <div class='questionTitle'>{{value1.timu}}</div>
        <div class="text">回复情况</div>
        <div class="answerText" v-for="(value2, index2) in value1.answers" :key="index2">{{value2.option_content}}</div>
      </div>
      <div class="personsNumber">
        <!-- <span class="number">答题人数：{{componentData ?componentData.questionCount : ''}}人</span> -->
        <span class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total,  prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
const Util = window._TY_Tool;
export default {
  name: "open-question",
  props: {
    componentData: {
      type: Object,
      default: {
        title: '',
        type: '',
        dataArray: [],
      }
    },
    componentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 2,
      total: 0,
      answersData: this.componentData ? this.componentData.dataArray : [],
    }
  },
  mounted(){
    this.getAnswersData();
  },
  methods: {
    handleCurrentChange(page){
      this.currentPage = page;
      this.getAnswersData();
    },
    handleSizeChange(page){
    },
    getAnswersData(){
      let t = this;
      if(t.answersData.length != 0){
        t.answersData.map((value, index)=>{
          Util.get(window._TY_ContentPath+'/cms-page-question-answer', {
            page: t.currentPage,
            pageSize: t.pageSize,
            questionnaire_id: value.questionnaire_id,
            question_id: value.question_id,
            option_id: value.option_id,
          }).then((response)=>{
            if(response.data.code == 200){
              let data = response.data.data;
              if(data.page_data.currentRecords.length != 0){
                let list = t.answersData;
                list[index]['answers'] = data.page_data.currentRecords;
                t.$set(t, 'answersData', list);
              }
              t.total = t.total>data.page_data.totalRecords ? t.total : data.page_data.totalRecords;
            }
          });
        })
      }
    }
  }
};
</script>
<style lang="less" scoped>
.openQuestion{
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
    border: 1px solid #e4e4e4;
    margin: 20px;
    .answerTemplate{
      .questionTitle{
        width: 100%;
        padding: 10px 15px;
        background: #FFFFFF;
        border-bottom: 1px solid #E4E4E4;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #444444;
      }
      .text{
        line-height: 36px;
        padding-left: 15px;
        background: #F5F5F5;
        border-bottom: 1px solid #E4E4E4;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #444444;
      }
      .answerText{
        width: 100%;
        padding: 10px 14px;
        background: #FFFFFF;
        border-bottom: 1px solid #E4E4E4;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
      }
      .interLayer{
        width: 100%;
        height: 10px;
        background: #F5F5F5;
        border-bottom: 1px solid #E4E4E4;
      }
    }
    &>.answerTemplate:first-child{
      .interLayer{
        display: none;
      }
    }
    .personsNumber{
      height: 50px;
      width: 100%;
      padding-left: 14px;
      padding-top: 10px;
      display: inline-block;
      position: relative;
      .number{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #444444;
      }
      .pagination{
        display: inline-block;
        height: 30px;
        position: absolute;
        right: 10px;
      }
    }
  }
}
</style>