<template>
    <div class="textarea_box" v-if="isShow">
          <el-input
            type="textarea"
            :rows="rows"
            placeholder="请输入内容"
            v-model="valueBase"
            @change="change"
            :disabled="realOption.disabled"
            :size="realOption.size"
            :style="p_style"
            :resize="p_resize"
            :autosize="p_autosize"
            >
          </el-input>
          <span v-if="maxLen" class="textarea_buttom" :class="lengthCheck">{{len}}/{{maxLen}}</span>
      </div>
</template>

<script>
    import Util from '../../libs/util';

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
            },
            //自适应内容高度
            autosize:{
                type:[Boolean,Object],
                default:false
            },
            //默认都可以伸缩 可选参数  none, both, horizontal, vertical
            resize:{
                type:String
            },
            //可输入的最大长度
            maxLen:{
                type:Number
            },
            //基础配置
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        size:""
                    };
                }
            }
        },
        data() {
            return {
                valueBase: (this.isJson&&this.value)?_TY_Tool.jsonFormat(this.value):this.value,
                p_style:typeof(this.bbStyle)==='string'?eval(this.bbStyle):this.bbStyle,
                p_autosize:this.autosize,
                p_resize:this.resize,
                external:{},//外部参数
                isShow:true,
                realOption:this.option
            }
        },
        watch: {
            value(val){
                this.valueBase=(this.isJson&&val)?_TY_Tool.jsonFormat(val):val;
            },
            option(val){
                this.realOption = val;
            }
        },
        computed:{
            //当前数据的长度
            len:function(){
                return this.valueBase?this.valueBase.length:0
            },
            lengthCheck:function(){
                if(this.maxLen&&this.valueBase.length>this.maxLen){
                    //超过最大长度
                    return "color_red";
                }else{
                    return "";
                }
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
            },
            //隐藏积木
            hideFn(){
                this.isShow = false;
            },
            //展示积木
            showFn(){
                this.isShow = true;
            },
            //禁用积木
            disabledFn(){
                this.realOption.disabled = true;
            },
            //启用积木
            enabledFn(){
                this.realOption.disabled = false;
            },
            //外部取值
            getValue:function(){
                return this.valueBase;
            },
            //外部设值
            setValue:function(val){
                this.valueBase = val;
                this.$emit('input',val);
                this.$emit('change',val);
            }
        }
    }
</script>

<style scoped>
    .textarea_buttom{
        position: absolute;
        right: 10px;
        bottom: 0px;
        font-size: small;
        color: #ccc;
    }
    .textarea_box{
        position: relative;
    }
    .color_red{
        color: red;
    }
</style>