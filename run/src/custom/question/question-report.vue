<template>
  <div class="questionReport">
    <div class="pageTitle">数据报表</div>
    <div class="pageInfo">
      <div class="nameAndTime">
        <div class="questionsTitle">{{pageTitle}}</div>
        <div class="timeAndStatus">
          <span class="releaseTime">最后更新时间：{{updateTime}}</span>
          <span class="status">当前状态：{{online_status==1 ? '发布中' : ''}}</span>
        </div>
      </div>
      <div class="pageOperate">
        <span class="questionsNumber">
          <span>当前已收集问卷</span>
          <span class="number">{{release_number}}份</span>
        </span>
        <span class="operateBtn">
          <el-button type="primary" :loading="loading" @click="onClickExportExcel">按题目导出</el-button>
          <a :href="fileUrl">
              <el-button type="primary" >按用户导出</el-button>
          </a>
        </span>
      </div>
    </div>
    <div class="pageContent">
      <pageTemplate :pageData="pageData"></pageTemplate>
    </div>
  </div>
</template>
<script>
const Util = window._TY_Tool;
import pageTemplate from './module/page_Template';
import { downLoadExcel } from './util/common';
export default {
  name: "question-report",
  data() {
    return {
      pageTitle: '',
      updateTime: '',
      online_status: '',
      release_number: 0,
      questionnaire_id: this.$route.query.param,
      loading: false,

      data_list_option: {},
      data_list_t: {},
      data_answer_count: {},
      data_list_question: [],
      pageData: [],
      exportTableData: [],
      fileUrl: "",
    };
  },
  components: {
    pageTemplate,
  },
  mounted(){
    this.getQuestionPageData();
    this.fileUrl = window.location.origin + '/wj/report/export?id=' + this.questionnaire_id;
  },
  methods: {
    // onUserExport(){
    //   let t = this;
    //   Util.get(`http://hxwy.dev.rs.com/wy/report/export?id=${t.questionnaire_id}`).then((response)=>{
    //       if(response.status != 200){
    //         t.$message.error(response.data.message);
    //       }
    //       console.log("1111111111", response);
    //   })
    // },
    onClickExportExcel(){
      this.loading = true;
      downLoadExcel(this.pageData, this.pageTitle, this.setLoading);
    },
    setLoading(){
      this.loading = false;
    },
    getQuestionPageData(){
      let t = this;
      Util.get(window._TY_ContentPath+'/cms-groupBy-question-answer', {id: t.questionnaire_id}).then((response)=>{
          if(response.data.code == 200){
            t.pageDataSolve(response.data.data);
          }
      })
    },
    pageDataSolve(data){
      var t=this;
      t.pageTitle = data.data_questionnaire.title;
      t.updateTime = data.data_questionnaire.update_time;
      t.online_status = data.data_questionnaire.online_status;
      t.release_number = data.data_questionnaire.will_num;
      t.data_list_question = data.data_list_question.list;

      data.data_list_option.list.map((value)=>{
        t.data_list_option[value.option_id] = value;
      });
      data.data_list_t.list.map((value)=>{
        t.data_list_t[value.option_id] = value;
      });
      data.data_answer_count.list.map((value)=>{
        t.data_answer_count[value.question_id] = value;
      });
      t.createQuestionData();
    },
    createQuestionData(){
      var t=this;
      let temProject = {};
      t.data_list_question.map((value)=>{
        let questionConfig = JSON.parse(value.config);
        if(!!questionConfig)
        {
          switch(value.question_type){
            case "bb-multiple-choice-question":
            case "bb-radio-examination": 
              let tableData = [], scalX = [], scalY = [], total = 0;
              temProject = {}; temProject.type = "multiple_examination_question";
              temProject.title = questionConfig.title;
              temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              questionConfig.options && questionConfig.options.map((tem)=>{
                scalY.push(tem.timu);
                if(t.data_list_option[tem.uuid]){
                  scalX.push(t.data_list_option[tem.uuid]['idCount']);
                  total += parseInt(t.data_list_option[tem.uuid]['idCount']);
                  tableData.push({
                    'timu': tem.timu,
                    'count': t.data_list_option[tem.uuid]['idCount'],
                    'percent': ''
                  });
                }
                else{
                  scalX.push("0");
                  tableData.push({
                    'timu': tem.timu,
                    'count': '0',
                    'percent': ''
                  });
                }
              });
              tableData.forEach((item, index, thisArray)=>{
                thisArray[index]['percent'] = total!=0 ? ((item.count)*100/total).toFixed(2) + '%' : '0';
              });
              temProject.scalY = scalY;
              temProject.scalX = scalX;
              temProject.tableData = tableData;
              t.pageData.push(temProject);
              break;
            case 'bb-multiple-radio-questions':
              let tableList = [];
              temProject = {};
              temProject.type = "multiple_radio_question";
              temProject.title = questionConfig.title ? questionConfig.title : '';
              temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              questionConfig.options && questionConfig.options.map((tem)=>{
                let tColumn = [], tColumnItem = {}, tData = [], tDataItem = {};
                tColumnItem = {prop: 'title', label: '选项'};
                tColumn.push(tColumnItem);
                tDataItem.title = tem.timu;
                tem.list.map((item, index)=>{
                  tColumnItem = {prop: 'option'+index, label: item.timu};
                  tColumn.push(tColumnItem);
                  tDataItem['option'+index] = t.data_list_option[item.uuid] ? t.data_list_option[item.uuid]['idCount'] : 0;
                });
                tData.push(tDataItem);
                tableList.push({
                  tColumn: tColumn,
                  tData: tData,
                })
              })
              temProject.tableData = tableList;
              t.pageData.push(temProject);
              break;
            case "bb-name-address":
              temProject = {};
              temProject.type = "name_location_question";
              temProject.title = "名称与地址";
              temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              temProject.name = {
                questionnaire_id: t.questionnaire_id,
                question_id: value.id,
                option_id: questionConfig.name.uuid,
              };
              temProject.location = {
                questionnaire_id: t.questionnaire_id,
                question_id: value.id,
                option_id: questionConfig.location.uuid,
              };
              t.pageData.push(temProject);
              break;
            case "bb-open-questions":
              let quesArray = [];
              temProject = {};
              temProject.type = "open_question";
              temProject.title = questionConfig.title ? questionConfig.title : '';
              temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              questionConfig.options && questionConfig.options.map((itemValue)=>{
                quesArray.push({
                  questionnaire_id: t.questionnaire_id,
                  question_id: value.id,
                  option_id: itemValue.uuid,
                  timu: itemValue.timu,
                  answers: []
                });
              });
              temProject.dataArray = quesArray;
              t.pageData.push(temProject);
              break;
            case "bb-compound-radio-questions":
              let tableList1 = [];
              temProject = {};
              temProject.type = "compound_radio_question";
              temProject.title = questionConfig.title ? questionConfig.title : '';
              temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              questionConfig.options && questionConfig.options.map((value)=>{
                let element = {}, tlist = [];
                element.title = value.timu;
                value.list.map((value1)=>{
                  let tColumn = [], tColumnItem = {}, tData = [], tDataItem = {};
                  tColumnItem = {prop: 'title', label: '选项'};
                  tColumn.push(tColumnItem);
                  tDataItem.title = value1.timu;
                  value1.list.map((value2, index2)=>{
                    tColumnItem = {prop: 'option'+index2, label: value2.timu};
                    tColumn.push(tColumnItem);
                    tDataItem['option'+index2] = t.data_list_option[value2.uuid] ? t.data_list_option[value2.uuid]['idCount'] : 0;
                  });
                  tData.push(tDataItem);
                  tlist.push({
                    tColumn: tColumn,
                    tData: tData,
                  });
                });
                element.tlist = tlist;
                tableList1.push(element);
              });
              temProject.tableList = tableList1;
              t.pageData.push(temProject);
              break;
            case "bb-single-column-cloze":
              temProject = {};
              temProject.type = "add_item_question";
              temProject.title = questionConfig.title ? questionConfig.title : '';
              temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              temProject.questionnaire_id = t.questionnaire_id;
              temProject.question_id = value.id;
              temProject.option_id = questionConfig.uuid;
              t.pageData.push(temProject);
              break;
            case "bb-mall-address-question":
              temProject = {};
              temProject.type = "add_item_question";
              temProject.title = questionConfig.title ? questionConfig.title : '';
              temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              temProject.questionnaire_id = t.questionnaire_id;
              temProject.question_id = value.id;
              temProject.option_id = questionConfig.options.uuid;
              t.pageData.push(temProject);
              break;
            case 'bb-add-item-questions':
              temProject = {};
              temProject.type = "add_item_question";
              temProject.style = 'add';
              temProject.title = questionConfig.title ? questionConfig.title.timu : '';
              temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              temProject.questionnaire_id_title = t.questionnaire_id;
              temProject.question_id_title = value.id;
              temProject.option_id_title = questionConfig.title.uuid;
              temProject.questionnaire_id = t.questionnaire_id;
              temProject.question_id = value.id;
              temProject.option_id = questionConfig.options.uuid;
              t.pageData.push(temProject);
              break;
            case "bb-mark-star-questions":
              let starArray = [];
              temProject = {};
              temProject.type = "mark_star_question";
              temProject.title = questionConfig.title ? questionConfig.title : '';
              questionConfig.options.map((starValue, index)=>{
                starArray.push({
                  'timu': starValue.timu,
                  'totalStar': starValue.totalScore,
                  'option_id': starValue.uuid,
                });
              });
              // temProject.totalStar = questionConfig.totalScore;
              // temProject.questionCount = t.data_answer_count[value.id] ? t.data_answer_count[value.id]['idCount'] : 0;
              temProject.questionnaire_id = t.questionnaire_id;
              temProject.question_id = value.id;
              temProject.options = starArray;
              t.pageData.push(temProject);
              break;
            default: break;
          };
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.questionReport{
  width: 100%;
  .pageTitle{
    width: 100%;
    line-height: 50px;
    background-color: #F5F5F5;
    padding-left: 20px;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #444444;
  }
  .pageInfo{
    width: 100%;
    height: 96px;
    position: relative;
    padding: 31px 20px 0px 20px;
    .nameAndTime{
      width: 400px;
      height: 100%;
      display: inline-block;
      .questionsTitle{
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #444444;
        line-height: 18px;
      }
      .timeAndStatus{
        margin-top: 10px;
        line-height: 14px;
        .releaseTime{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #999999;
        }
        .status{
          margin-left: 10px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #32BE78;
        }
      }
    }
    .pageOperate{
      height: 100%;
      //width: 400px;
      position: absolute;
      right: 20px;
      top: 39px;
      height: 36px;
      .questionsNumber{
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        .number{
          margin-left: 10px;
          font-size: 18px;
          color: #0091EA;
        }
      }
      .operateBtn{
        margin-left: 23px;
        height: 36px;
      }
    }
  }
  .pageContent{
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>