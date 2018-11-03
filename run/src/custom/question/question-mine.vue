<template>
  <div class="wj_question_mine">
    <div class="qm_title">
      <el-button type="primary" @click="dialogCreateQuestion=true">创建问卷</el-button>
    </div>
    <div class="qm_content">
      <questionTemplate v-for="(value, index) in questionList" :key="index" :data="value" @copyQuestion="copyQuestion" @deleteQuestion="deleteQuestion" @editQuestionDetail="editDetail" @releaseReturn="releaseReturn">
      </questionTemplate>
    </div>
    <el-dialog title="创建问卷"
     :visible.sync="dialogCreateQuestion"
     @close="createQuestion('cancel')">
      <div>
        <div :style="{display: 'inline-flex', display: '-webkit-inline-flex', width: '100%'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '80px', lineHeight: '36px'}">问卷标题</span>
          <el-input placeholder="请输入标题" v-model="title" @change="titleInputChange"></el-input>
        </div>
        <div class="questions-attr" :style="{display: 'inline-flex', display: '-webkit-inline-flex', width: '100%', lineHeight: '36px', marginTop: '20px'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '74px', lineHeight: '36px'}">问卷属性</span>
          <el-checkbox v-model="startEndFlag" @change="queStartChange">显示开始结束项</el-checkbox>
          <el-checkbox v-model="userInfoCollect" :style="{marginLeft: '35px'}">显示用户收集页面</el-checkbox>
          <el-checkbox v-model="appUseQuestion" :style="{marginLeft: '35px'}">App问卷</el-checkbox>
          <el-checkbox v-model="slidePage" :style="{marginLeft: '35px'}">滑动问卷</el-checkbox>
        </div>
        <div :style="{display: startEndFlag ? 'inline-flex' : 'none', display: startEndFlag ? '-webkit-inline-flex' : 'none', width: '100%', marginTop: '20px'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '80px'}">问卷开始语</span>
          <el-input 
           type="textarea"
           :autosize="{ minRows: 2, maxRows: 4}"
           placeholder="请输入问卷开始说明"
           v-model="questionStartContent">
          </el-input>
        </div>
        <div :style="{display: startEndFlag ? 'inline-flex' : 'none', display: startEndFlag ? '-webkit-inline-flex' : 'none', width: '100%', marginTop: '20px'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '80px'}">问卷结束语</span>
          <el-input 
           type="textarea"
           :autosize="{ minRows: 2, maxRows: 4}"
           placeholder="请输入问卷结束语"
           v-model="questionEndContent">
          </el-input>
        </div>
        <div :style="{display: 'inline-flex', display: '-webkit-inline-flex', width: '100%', marginTop: '20px'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '80px'}">问卷描述</span>
          <el-input 
           type="textarea"
           :autosize="{ minRows: 2, maxRows: 4}"
           placeholder="请输入问卷描述"
           v-model="description">
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createQuestion('cancel')">取 消</el-button>
        <el-button type="primary" @click="createQuestion('ok')" :disabled="btnFlag">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑详情"
     :visible.sync="dialogEditQuestion"
     @close="editQuestion('cancel')">
      <div>
        <div :style="{display: 'inline-flex', display: '-webkit-inline-flex', width: '100%'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '80px', lineHeight: '36px'}">问卷标题</span>
          <el-input placeholder="问卷标题" v-model="editTitle" @change="titleInputEdit"></el-input>
        </div>
        <div class="questions-attr" :style="{display: 'inline-flex', display: '-webkit-inline-flex', width: '100%', lineHeight: '36px', marginTop: '20px'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '74px', lineHeight: '36px'}">问卷属性</span>
          <el-checkbox v-model="editStartEndFlag" @change="editQueStartChange">显示开始结束项</el-checkbox>
          <el-checkbox v-model="editUserInfoCollect" :style="{marginLeft: '35px'}">显示用户收集页面</el-checkbox>
          <el-checkbox v-model="editAppUseQuestion" :style="{marginLeft: '35px'}">App问卷</el-checkbox>
          <el-checkbox v-model="editSlidePage" :style="{marginLeft: '35px'}">滑动问卷</el-checkbox>
        </div>
        <div :style="{display: editStartEndFlag ? 'inline-flex' : 'none', display: editStartEndFlag ? '-webkit-inline-flex' : 'none', width: '100%', marginTop: '20px'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '80px'}">问卷开始语</span>
          <el-input 
           type="textarea"
           :autosize="{ minRows: 2, maxRows: 4}"
           placeholder="请输入问卷开始说明"
           v-model="editQuestionStartContent">
          </el-input>
        </div>
        <div :style="{display: editStartEndFlag ? 'inline-flex' : 'none', display: editStartEndFlag ? '-webkit-inline-flex' : 'none', width: '100%', marginTop: '20px'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '80px'}">问卷结束语</span>
          <el-input 
           type="textarea"
           :autosize="{ minRows: 2, maxRows: 4}"
           placeholder="请输入问卷结束语"
           v-model="editQuestionEndContent">
          </el-input>
        </div>
        <div :style="{display: 'inline-flex', display: '-webkit-inline-flex', width: '100%', marginTop: '20px'}">
          <span :style="{fontSize: '14px', color: '#1f2d3d', display: 'inline-block', width: '80px'}">问卷描述</span>
          <el-input 
           type="textarea"
           :autosize="{ minRows: 2, maxRows: 4}"
           placeholder="请输入问卷描述"
           v-model="editDescription">
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editQuestion('cancel')">取 消</el-button>
        <el-button type="primary" @click="editQuestion('ok')" :disabled="editBtnFlag">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import questionTemplate from './module/questionTemplate';

export default {
  props: {},
  data() {
    return {
      questionList: [],
      dialogCreateQuestion: false,
      title: '',
      description: '',
      btnFlag: true,
      dialogEditQuestion: false,
      editTitle: '',
      editDescription: '',
      editId: '',
      editBtnFlag: false,
      startEndFlag: 0,
      userInfoCollect: 0,
      questionStartContent: '',
      questionEndContent: '',
      editStartEndFlag: '',
      editUserInfoCollect: '',
      editQuestionStartContent: '',
      editQuestionEndContent: '',
      appUseQuestion: false,
      editAppUseQuestion: false,
      slidePage: false,
      editSlidePage: false,
    }
  },
  created(){
    this.getMyquestionsList();
  },
  mounted() {},
  beforeDestroy() {},
  components: {
    questionTemplate
  },
  methods: {
    getMyquestionsList(){
      //位置校验
      let t = this;
      _TY_Tool.get(window._TY_ContentPath+'/cms-list-questionnaire').then((response)=>{
          if(response.data.code == 200){
            t.questionList = response.data.data.data_list.list;
          }
      })
    },
    copyQuestion(data){
      var t=this;
      _TY_Tool.post(window._TY_ContentPath+'/wy-add-copy-questionnaire', {
        id: data.id}).then((response)=>{
        if(response.data.ok){
          t.$message.success("复制问卷成功！");
          t.getMyquestionsList();
        }
        else{
          t.$message.error(response.data.message);
        }
      });
    },
    deleteQuestion(data){
      var t=this;
      _TY_Tool.post(window._TY_ContentPath+'/cms-delete-questionnaire', {
        id: data.id}).then((response)=>{
        if(response.data.ok){
          t.$message.success("删除问卷成功！");
          t.getMyquestionsList();
        }
        else{
          t.$message.error(response.data.message);
        }
      });
    },
    releaseReturn(data){
      var t=this;
      _TY_Tool.post(window._TY_ContentPath+'/cms-update-cancel-publication-questionnaire', {
        id: data.id}).then((response)=>{
        if(response.data.ok){
          t.$message.success("问卷发布撤回成功！");
          t.getMyquestionsList();
        }
        else{
          t.$message.error(response.data.message);
        }
      });
    },
    createQuestion(type){
      if(type === 'ok'){
        this.createQuestions();
      }
      this.btnFlag = true;
      this.title = '';
      this.discrible = '';
      this.startEndFlag = false;
      this.userInfoCollect = false;
      this.dialogCreateQuestion = false;
      this.slidePage = false;
    },
    titleInputChange(){
      if(this.title.length != 0){
        this.btnFlag = false;
      }
      else{
        this.btnFlag = true;
      }
    },
    createQuestions(){
      _TY_Tool.post(window._TY_ContentPath+'/cms-add-questionnaire', {
          title: this.title,
          description: this.description,
          startEndFlag: !!this.startEndFlag ? 1 : 0,
          userInfoCollect: !!this.userInfoCollect ? 1 : 0,
          questionStartContent: this.questionStartContent,
          questionEndContent: this.questionEndContent,
          edit_app_use_question: !!this.appUseQuestion ? 1 : 0,
          slide_page: this.slidePage ? 1 : 0,
        }
      ).then((response)=>{
        if(response.data.ok){
          this.$message.success('问卷创建成功！');
          this.$router.push(`/questionnaire/index/question-layout?param=${response.data.data.unique_value}`);
        }
        else{
          this.$message.error(response.data.message);
        }
      })
    },
    editDetail(data){
      this.editTitle = data.data.title;
      this.editDescription = data.data.description;
      this.editId = data.data.id;
      this.editStartEndFlag = data.data.start_end_flag;
      this.editUserInfoCollect = data.data.user_info_collect;
      this.editQuestionStartContent = data.data.question_start_content;
      this.editQuestionEndContent = data.data.question_end_content;
      this.editAppUseQuestion = data.data.edit_app_use_question;
      this.editSlidePage = data.data.slide_page == 1 ? true : false;
      this.dialogEditQuestion = true;
    },
    editQuestion(type){
      if(type === 'ok'){
        this.EditQuestionsDetail();
      }
      this.editBtnFlag = false;
      this.editTitle = '';
      this.editDescription = '';
      this.dialogEditQuestion = false;
    },
    EditQuestionsDetail(){
      _TY_Tool.post(window._TY_ContentPath+'/cms-update-questionnaire-by-id', {
          id: this.editId,
          title: this.editTitle,
          description: this.editDescription,
          start_end_flag: this.editStartEndFlag,
          user_info_collect: this.editUserInfoCollect,
          question_start_content: this.editQuestionStartContent,
          question_end_content: this.editQuestionEndContent,
          edit_app_use_question: this.editAppUseQuestion,
          slide_page: this.editSlidePage ? 1 : 0,
        }
      ).then((response)=>{
        if(response.data.ok){
          this.$message.success('问卷编辑成功！');
          this.getMyquestionsList();
        }
        else{
          this.$message.error(response.data.message);
        }
      })
    },
    titleInputEdit(){
      if(this.editTitle.length == 0){
        this.editBtnFlag = true;
      }
      else{
        this.editBtnFlag = false;
      }
    },
    queStartChange(){
      if(!this.startEndFlag)
      {
        this.questionStartContent = '';
        this.questionEndContent = '';
      }
    },
    editQueStartChange(){
      if(!this.startEndFlag)
      {
        this.editQuestionStartContent = '';
        this.editQuestionEndContent = '';
      }
    }
  }
};
</script>
<style lang="less" scoped>
.wj_question_mine{
  margin:-10px;
  width: 100%;
  .qm_title{
    width: 100%;
    line-height: 50px;
    background-color: #F5F5F5;
    padding-left: 14px;
  }
  .qm_content{
    width: 100%;
    padding-top: 21px;
    padding-left: 21px;
    display: inline-flex;
    display: -webkit-inline-flex;
    flex-wrap: wrap;
    -ms-flex-wrap: wrap;
  }
}
</style>