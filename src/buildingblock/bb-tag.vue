<template>
    <div>
        <el-tag :style="{marginRight:'5px'}"
          :key="tag"
          v-for="tag in tags"
          :closable="closable"
          :close-transition="false"
          @close="handleClose(tag)"
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
            value:{
                type: Array,
                default:function(){
                    return null;
                }
            },
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
            }
        },
        data() {
            return {
                inputVisible: false,
                inputValue: '',
                closable:this.column ? false:true
            }
        },
        computed: {
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
            handleClose(tag) {
                this.tags.splice(this.tags.indexOf(tag), 1);
                this.$emit('input', this.tags);
            },
            showInput() {
              this.inputVisible = true;
              this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
              });
            },
            handleInputConfirm() {
              let inputValue = this.inputValue;
              if (inputValue) {
                this.tags.push(inputValue);
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