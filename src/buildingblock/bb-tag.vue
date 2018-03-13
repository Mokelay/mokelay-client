<template>
    <div>
        <el-tooltip :disabled="!(tag.tipContent&&tag.tipContent.length>0)" v-for="(tag,key) in tags" placement="top">
          <span slot="content" v-html="tag.tipContent"></span>
          <el-tag :style="{marginRight:'5px'}"
            :key="key"
            :closable="closable"
            :size="size"
            :color="color||tag.color||''"
            :close-transition="false"
            @close="handleClose(key)"
          >
          {{tag.name}}
          </el-tag>
        </el-tooltip>
        <div v-if="showButton" class="addButton">
          <el-input :style="{width:'100px'}"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            :size="btnSize"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" type="default" :size="btnSize" @click="showInput">+</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'bb-tag',
        props: {
            /*实现v-model*/
            /*标签数组
              [{
                alias:'',//key
                name:'',//标签显示文案
                tipContent:'',//tip展示的文案 或者html代码
                color:''//背景色，类似主题
              }]
            */
            value:{
                type: [Array,String],
                default:function(){
                    return null;
                }
            },
            showButton:{
              type:Boolean,
              default:false
            },
            //是否可以删除标签
            closable:{
              type:Boolean,
              default:false
            },
            //标签大小  默认mini  
            size:{
              type:String,
              default:''
            },
            color:{
              type:String,
              default:null
            }
        },
        data() {
            return {
                inputVisible: false,
                inputValue: '',
                tags:(this.value&&typeof(this.value)==='string')?JSON.parse(this.value):this.value
            }
        },
        computed: {
          btnSize(){
            if(!this.size){
              return "medium";
            }else if(this.size==='medium'){
              return "small";
            }else if(this.size==='small'){
              return "mini";
            }else{
              return "mini";
            }
          }
        },
        created: function () {
        },
        methods: {
            //关闭标签
            handleClose(key) {
                this.tags.splice(key,1);
                this.$emit('input', this.tags);
            },
            //点击添加标签显示输入框并focus
            showInput() {
              this.inputVisible = true;
              this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
              });
            },
            //输入框失去焦点输出内容
            handleInputConfirm() {
              let inputValue = this.inputValue;
              if (inputValue) {
                if(!this.tags){
                  this.tags=[];
                }
                this.tags.push({
                  alias:inputValue,
                  name:inputValue
                });
                this.$emit('input', this.tags);
              }
              this.inputVisible = false;
              this.inputValue = '';
            }


        }
    }
</script>
<style scoped>
.addButton{
  display: inline-block;
}
</style>