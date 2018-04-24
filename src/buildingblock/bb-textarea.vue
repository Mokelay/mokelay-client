<template>
      <el-input
        type="textarea"
        :rows="rows"
        placeholder="请输入内容"
        v-model="valueBase"
        @change="change"
        :disabled="disabled"
        :style="p_style"
        >
      </el-input>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-textarea',
        props: {
            disabled:{
                type:Boolean
            },
            value:{
                type:[String,Number]
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            bbStyle:{
                type:[String,Object],
                default:''
            },
            //是不是json，如果是json先格式化再显示
            isJson:{
              type:Boolean,
              default:false
            },
            //文本域的高
            rows:{
                type:Number,
                default:2
            }
        },
        data() {
            return {
                valueBase: (this.isJson&&this.value)?_TY_Tool.jsonFormat(this.value):this.value,
                p_style:typeof(this.bbStyle)==='string'?eval(this.bbStyle):this.bbStyle,
                external:{}//外部参数
            }
        },
        watch: {
            value(val){
                this.valueBase=(this.isJson&&val)?_TY_Tool.jsonFormat(val):val;
            }
        },
        created: function () {
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            t.$emit('mounted',t.valueBase,t);
        },
        methods: {
            linkage(...data){
              let t=this;
              if(data){
                this.external['linkage'] = data;
                //刷新选项
                _TY_Tool.buildDefaultValTpl(t,"valueBase");
              }
            },
            change:function(val){
                this.$emit('input',val,this)
                this.$emit('change',val,this)//把当前对象传过去，因为会需要linkage参数
            }
        }
    }
</script>