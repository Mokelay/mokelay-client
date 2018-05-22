<template>
  <div class="question-layout">
    <div class='question-topbar'>
      <span>编辑问卷</span>
      <bb-button class='question-topbar-button' type='primary' :button="releaseButton"></bb-button>
      <bb-button class='question-topbar-button' :button="previewButton"></bb-button>
    </div>
    <el-row class='question-layout-content'>
      <el-col :span="3"><question-tool :toolListDs="toolListDs" @add="addBB" ></question-tool></el-col>
      <el-col :span="previewWidth"><question-preview :pageAlias="pageAlias" :indexKey="indexKey" :aliasKey="aliasKey" :configKey="configKey" :newBB="newBB" :readPageDs="readPageDs" :addBBDs="addBBDs" :deleteBBDs="deleteBBDs" @edit="editClick" @delete="hideEditor" :refresh="refresh"></question-preview></el-col>
      <el-col :span="editWidth" v-if="showEdit"><question-edit-attribute :aliasKey="aliasKey" :configKey="configKey" :editBBDs="editBBDs" :readBBDs="readBBDs" :editBB="editBB" @submit="afterSubmit"></question-edit-attribute></el-col>
    </el-row>
  </div>
</template>
<script>
const Util = window._TY_Tool;
import questioneditattribute from '../../bb/question-edit-attribute.vue';
import questiontool from '../../bb/question-tool';
import questionpreview from '../../bb/question-preview.vue';
export default {
  name: "question-layout",
  props: {
    dsRead: {
      type: Object
    },
  },
  data() {
    return {
      pageAlias:this.$route.query.param,
      showEdit:false,
      previewWidth:21,
      editWidth:0,
      newBB:null,
      editBB:null,
      refresh:null,
      releaseButton:{
        type:'primary',
        text:'发布问卷',
        action:'execute-ds',
        ds:{
          api: "cms-update-release-questionnaire",
          category:'config',
          method: "post",
          inputs: [{
              paramName: "id",
              valueType: "constant",
              constant: this.$route.query.param
          }]
        },
        confirmTitle:'提示',
        confirmText:'确认发布这篇问卷？',
        callBackStaticWords:'问卷发布成功'
      },
      previewButton:{
        text:'预览问卷',
        action:'url',
        url:_TY_ENV.questionnaireHost+'/#/survey?surveystate=no&id='+this.$route.query.param,
        urlType:'openWindow'
      },
      //bb-tool 配置
      toolListDs:{
        api: "list-bb",
        category:'config',
        method: "post",
        inputs: [{
            paramName: "type",
            valueType: "constant",
            constant: 'Questionnaire'
        }],
        outputs: [{
            dataKey: "type",
            valueKey: "data_list"
        }]
      },
      //bb-preview-bb 配置
      indexKey:'question_no',
      aliasKey:'question_type',
      configKey:'config',
      readPageDs:{
        api: "cms-read-questionnaire",
        category:'config',
        method: "post",
        inputs: [{
            paramName: "id",
            valueType: "constant",
            constant: this.$route.query.param
        }],
        outputs: [{
            dataKey: "bbList",
            valueKey: "data_list.list"
        },{
            dataKey: "title",
            valueKey: "data.title"
        }]
      },
      addBBDs:{
        api: "cms-add-question",
        category:'config',
        method: "post",
        inputs: [{
            paramName: "questionnaire_id",
            valueType: "constant",
            constant: this.$route.query.param
        },{
            paramName: "question_type",
            valueType: "inputValueObj",
            valueKey: 'bb',
            variable:'newBBName'
        },{
            paramName: "question_no",
            valueType: "inputValueObj",
            valueKey: 'bb',
            variable:'newBBNumber'
        }],
        outputs: [{
            dataKey: "type",
            valueKey: "unique_value"
        }]
      },
      deleteBBDs:{
        api: "cms-delete-question",
        category:'config',
        method: "post",
        inputs: [{
            paramName: "id",
            valueType: "inputValueObj",
            valueKey: 'bb',
            variable:'deleteBBId'
        }]
      },
      //bb-edit-attribute 配置
      readBBDs:{
        api: "cms-list-bb-by-alias",
        method: "get",
        category:"config",
        inputs: [{
            paramName: "alias",
            valueType: "inputValueObj",
            valueKey: 'bb',
            variable:'bbAlias'
        }],
        outputs: [{dataKey: "tableData", valueKey: "data_list.list"}]
      },
      editBBDs:{
        api: "cms-update-questionnaire",
        method: "post",
        category:"config",
        inputs: [{
            paramName: "id",
            valueType: "inputValueObj",
            valueKey: 'bb',
            variable:'bbId'
        },{
            paramName: "config",
            valueType: "inputValueObj",
            valueKey: 'bb',
            variable:'formDataJSON'
        }]
      },
    }
  },
  methods: {
    editClick:function(params){
      this.showEditor();
      this.editBB = params
    },
    addBB:function(params){
      this.hideEditor();
      this.newBB = params
    },
    afterSubmit:function(){
      this.hideEditor();
      this.refresh = Date.parse(new Date())
    },
    showEditor:function(){
      const t = this;
      t.previewWidth = 12;
      t.editWidth = 9;
      t.showEdit = true;
    },
    hideEditor:function(){
      const t = this;
      t.previewWidth = 21;
      t.editWidth = 0;
      t.showEdit = false;
    }
  },
  components:{
      'question-tool':questiontool,
      'question-preview':questionpreview,
      'question-edit-attribute':questioneditattribute
  }
};
</script>
<style lang="less" scoped>
  .question-layout{
    min-height:~'calc(100vh - 135px)';
  }
  .question-topbar{
    padding: 7px 20px;
    background: #eef1f6;
    height: 50px;
    line-height: 34px;
  }
  .question-topbar-button{
    float: right;
    margin: 0 10px !important;
  }
  .question-layout-content{
    //padding-top: 11px;
  }
</style>