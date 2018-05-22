<template>
  <div class='edit-attribute'>
      <bb-form :value="bbprops" :fields="formFields" :settingButtonText="settingButtonText" @commit="commit" :refresh="bbAlias"></bb-form>
  </div>
</template>
<script>
const Util = window._TY_Tool;
export default {
  name: "question-edit-attribute",
  props: {
    editBB:{
      type:Object
    },
    editBBDs:{
      type:Object
    },
    readBBDs:{
      type:Object
    },
    aliasKey:{
      type:String
    },
    configKey:{
      type:String
    },
    settingButtonText:{
      type: String,
      default:'保存'
    },
  },
  data() {
    return {
      formFields:[],
      bbprops:typeof this.editBB[this.configKey] == 'string'?JSON.parse(this.editBB[this.configKey]):this.editBB[this.configKey],
      formDataJSON:null,
      bbId:this.editBB['id'],
      bbAlias:this.editBB[this.aliasKey]
    };
  },
  mounted(){},
  created(){
    this.getData();
  },
  beforeDestroy() {},
  watch: {
    editBB(val){
      this.bbAlias = val[this.aliasKey];
      this.bbprops = typeof this.editBB[this.configKey] == 'string'?JSON.parse(this.editBB[this.configKey]):this.editBB[this.configKey],
      this.getData();
    }
  },
  methods: {
    getData:function(formData){
      const t = this;
      if (t.readBBDs) {
          t.formFields = [];
          Util.getDSData(t.readBBDs, _TY_Tool.buildTplParams(t), function (map) {
            t.formFields = map[0].value
          }, function (code, msg) {
        });
      }
    },
    commit:function(formData){
      const t = this;
      t.formDataJSON = JSON.stringify(formData);
      if (t.editBBDs) {
          Util.getDSData(t.editBBDs, _TY_Tool.buildTplParams(t), function (map) {
            t.$emit('submit');
          }, function (code, msg) {
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .edit-attribute{
    //background: #eef1f6;
    //border: 1px solid #E4E4E4;
    padding: 11px;
    padding-bottom: 0;
  }
</style>