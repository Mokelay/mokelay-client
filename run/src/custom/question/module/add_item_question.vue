<template>
  <div class="addItemQuestion">
    <div class="questionTitle"><span>Q{{componentIndex+1}}</span>{{componentData ? componentData.title : ''}}</div>
    <div class="questionAnswer">
      <div class="text">回复情况</div>
      <div class="answerTemplate" v-for="(value, index) in answerList" :key="index">{{value.option_content}}</div>
      <div class="personsNumber">
        <!-- <span class="number">答题人数：{{componentData ? componentData.questionCount : ''}}人</span> -->
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
  name: "add-item-question",
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
      pageSize: 2,
      total: 0,
      answerList: [],
      answerTitleList: [],
    }
  },
  mounted(){
    this.getPaginationDataTitle();
  },
  methods: {
    handleCurrentChange(page){
      this.currentPage = page;
      this.getPaginationDataTitle();
    },
    handleSizeChange(){},
    getPaginationDataTitle(){
      let t = this;
      if(t.componentData){
        if(t.componentData.style === 'add'){
          Util.get(window._TY_ContentPath+'/cms-page-question-answer', {
            page: t.currentPage,
            pageSize: t.pageSize,
            questionnaire_id: t.componentData ? t.componentData.questionnaire_id_title : 0,
            question_id: t.componentData ? t.componentData.question_id_title : 0,
            option_id: t.componentData ? t.componentData.option_id_title : 0,
          }).then((response)=>{
            if(response.data.code == 200){
              let data = response.data.data;
              t.answerTitleList = data.page_data.currentRecords;
              t.total = data.page_data.totalRecords;
              t.getPaginationData();
            }
          });
        }
        else{
          t.answerTitleList = [];
          t.getPaginationData();
        }
      }
    },
    getPaginationData(){
      let t = this;
      if(t.componentData){
        Util.get(window._TY_ContentPath+'/cms-page-question-answer', {
          page: t.currentPage,
          pageSize: t.pageSize,
          questionnaire_id: t.componentData ? t.componentData.questionnaire_id : 0,
          question_id: t.componentData ? t.componentData.question_id : 0,
          option_id: t.componentData ? t.componentData.option_id : 0,
        }).then((response)=>{
          if(response.data.code == 200){
            let data = response.data.data;
            let list = data.page_data.currentRecords;
            list.map((item, index)=>{
              list[index]['option_content'] = (t.componentData.style === 'add' ? (t.answerTitleList[index]['option_content']+',') : '') + list[index]['option_content'];
            });
            t.answerList = list;
            t.total = data.page_data.totalRecords;
          }
        });
      }
    },
  }
};
</script>
<style lang="less" scoped>
.addItemQuestion{
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
    .text{
      width: 100%;
      padding-left: 13px;
      line-height: 36px;
      background: #F5F5F5;
      border-bottom: 1px solid #E4E4E4;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #444444;
    }
    .answerTemplate{
      width: 100%;
      border-bottom: 1px solid #E4E4E4;
      padding: 8px 14px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
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