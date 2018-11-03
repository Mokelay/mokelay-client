<template>
  <div class="bb-preview">
    <p class="title">{{title}}</p>
    <div class='bb-preview-item' v-for="(bbItem,index) in bbList">
        <div class="buttonInfo">
          <p>{{'Q'+ (index+1)}}</p>
          <el-button type="text" icon="el-icon-edit" @click="editItem(bbItem)" class="button-item"></el-button>
          <el-button type="text" icon="el-icon-delete" @click="removeItem(bbItem)" class="button-item"></el-button>
        </div>
        <bb :alias="bbItem[aliasKey]" :config="bbItem[configKey]"></bb>
    </div>
  </div>
</template>
<script>
const Util = window._TY_Tool;
export default {
  name: "question-preview",
  props: {
    readPageDs:{
      type: Object
    },
    aliasKey:{
      type:String
    },
    configKey:{
      type:String
    },
    addBBDs:{
      type: Object
    },
    deleteBBDs:{
      type: Object
    },
    indexKey:{
      type: String
    }, 
    refresh:{
      type: [String,Number,Boolean]
    },
    newBB:{
      type: Object,
      default:function(){
        return {
          bb:null,
          key:null
        }
      }
    }
  },
  data() {
    return {
      bbList:[],
      title:null,
      maxNumber:null,
      newBBNumber:null,
      newBBName: null,
      deleteBBId:null
    };
  },
  created:function(){
    this.getData()
  },
  watch:{
    newBB(val){
      const t = this;
      t.newBBNumber = t.maxNumber + 1;
      t.maxNumber = t.newBBNumber;
      t.newBBName = t.newBB.bb.alias;
      this.addBB();
    },
    refresh(val){
      this.getData();
    }
  },
  methods: {
    //获取页面内容
    getData:function(){
      const t = this;
      if (t.readPageDs) {
          Util.getDSData(t.readPageDs, _TY_Tool.buildTplParams(t), function (map) {
            map.forEach((val,key)=>{
              t[val.dataKey] = val.value;
            })
            t.maxNumber = t.bbList[t.bbList.length-1][t.indexKey];//拿到当前最大值
          }, function (code, msg) {
        });
      }
    },
    //向页面中添加新积木
    addBB:function(){
      const t = this;
      if (t.addBBDs) {
          Util.getDSData(t.addBBDs, _TY_Tool.buildTplParams(t), function (map) {
            t.getData();
          }, function (code, msg) {
        });
      }
    },
    //移除并刷新
    removeItem:function(params){
      const t = this;
      t.deleteBBId = params.id;
      t.$confirm('确认删除此项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (t.deleteBBDs) {
            Util.getDSData(t.deleteBBDs, _TY_Tool.buildTplParams(t), function (map) {
              t.$emit('delete',params);
              t.getData();
            }, function (code, msg) {
          });
        }
      }).catch((err)=>{})
    },
    editItem:function(params){
      this.$emit('edit',params);
    }
  }
};
</script>
<style lang="less" scoped>
  .bb-preview{
    max-height: ~'calc(100vh - 180px)';
    overflow-y: auto;
    padding: 11px;
    border-left: 1px solid #E4E4E4;
    border-right: 1px solid #E4E4E4;
    .title{
      text-align: center;
      font-family: '.PingFangSC-Regular';
      font-size: 22px;
      color: #444444;
    }
  }
  .bb-preview-item{
    display: flex;
    flex:1;
  }
  .buttonInfo{
    background: #eef1f6;
    border: 1px solid #E4E4E4;
    border-right: none;
    margin-top: 10px;
    padding: 10px;
    .button-item{
      display: block;
      margin: auto;
    }
  }
</style>