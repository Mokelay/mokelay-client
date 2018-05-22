<template>
  <div class="nameLocationQuestion">
    <div class="questionTitle"><span>Q{{componentIndex+1}}</span>经销商名称与地址</div>
    <div class="questionAnswer">
      <div class="text">回复情况</div>
      <div class="answerTemplate" v-for="(value, index) in locationList" :key="index">
        <span class="name">{{nameList[index] ? nameList[index]['option_content'] : ''}}</span>
        <span class="location">{{value ? value.option_content : ''}}</span>
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
  name: "name-location-question",
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
      currentPage: 1,
      pageSize: 2,
      total: 0,
      nameList: [],
      locationList: [],
    }
  },
  mounted(){
    this.getPaginationData('name');
    this.getPaginationData('location');
  },
  methods: {
    handleCurrentChange(page){
      this.currentPage = page;
      this.getPaginationData('name');
      this.getPaginationData('location');
    },
    handleSizeChange(){},
    getPaginationData(type){
      let t = this;
      if(t.componentData){
        if(type === 'name'){
          Util.get(window._TY_ContentPath+'/cms-page-question-answer', {
            page: t.currentPage,
            pageSize: t.pageSize,
            questionnaire_id: t.componentData ? t.componentData.name.questionnaire_id : 0,
            question_id: t.componentData ? t.componentData.name.question_id : 0,
            option_id: t.componentData ? t.componentData.name.option_id : 0,
          }).then((response)=>{
            if(response.data.code == 200){
              let data = response.data.data;
              t.nameList = data.page_data.currentRecords;
              t.total = t.total>data.page_data.totalRecords ? t.total : data.page_data.totalRecords;
            }
          });
        }
        else if(type === 'location'){
          Util.get(window._TY_ContentPath+'/cms-page-question-answer', {
            page: t.currentPage,
            pageSize: t.pageSize,
            questionnaire_id: t.componentData ? t.componentData.location.questionnaire_id : 0,
            question_id: t.componentData ? t.componentData.location.question_id : 0,
            option_id: t.componentData ?  t.componentData.location.option_id : 0,
          }).then((response)=>{
            if(response.data.code == 200){
              let data = response.data.data;
              t.locationList = data.page_data.currentRecords;
              t.total = t.total>data.page_data.totalRecords ? t.total : data.page_data.totalRecords;
            }
          })
        }
      };
    }
  }
};
</script>
<style lang="less" scoped>
.nameLocationQuestion{
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
      padding: 10px 14px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      .name{
        display: block;
      }
      .location{
        margin-top: 6px;
        display: block;
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