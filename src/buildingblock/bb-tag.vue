<template>
    <div>
        <el-tag :style="{marginRight:'5px'}"
          v-for="(tag,key) in tags"
          :key="key"
          :closable="closable"
          :close-transition="false"
          @close="handleClose(key)"
        >
        {{tag}}
        </el-tag>
        <div v-if="showButton" class="addButton">
          <el-input :style="{width:'100px'}"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" type="default" size="small" @click="showInput">+</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'bb-tag',
        props: {
            /*实现v-model*/
            value:{
                type: Array,
                default:function(){
                    return null;
                }
            },
            /*实现v-model*/
            column:{
                type: Object,
                default:function(){
                    return null;
                }
            },
            showButton:{
              type:Boolean,
              default:true
            },
            prop:{
              type:String,
            },


        },
        data() {
            return {
                inputVisible: false,
                inputValue: '',
                closable:this.column ? false:true
            }
        },
        computed: {
            /*标签数组
              [{
                alias:'',
                name:''
              }]
            */
            tags: function() {
                const t = this;
                let tagsArr = [];
                if(t.column){
                  t.column.templateProp.forEach((val,key)=>{
                    const tag = val.alias == t.prop?val.name:null;
                    if(tag){
                      tagsArr.push(tag);
                    }
                  });
                }
                return tagsArr;
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
                this.tags.push(inputValue);
                this.$emit('input', this.tags);
              }
              this.inputVisible = false;
              this.inputValue = '';
            },

        }
    }
</script>
<style scoped>
.addButton{
  display: inline-block;
}
</style>