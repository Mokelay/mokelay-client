<template>
    <div class="_box" :style="p_style">
        <div class="_line clearfix">
            <span v-if="bbType=='title'" class="_title">
                <span v-if="!removeIcon" class="_title_icon"></span>
                <h3 :style="p_titleStyle">{{title}}</h3>
            </span>
            <span v-if="p_require && bbType=='title'" class="c_3f3f3f f_right"><span class="c_red">*</span> 为必填项</span>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'bb-space',
        props: {
            /**
                空格类型，分为title  、线条line 后面扩展其他类型  默认title
            */
            bbType:{
                type:String,
                default:'title'
            },
            //如果是title类型   需要输入title名称
            title:{
                type:String,
                default:'Title'
            },
            require:{
                type:[Boolean,String],
                default:false
            },
            //组件样式
            bbStyle:{
                type:[String,Object],
                default:function(){
                    return {};
                }
            },
            //标题文字的样式设置
            titleStyle:{
                type:[Object],
                default:function(){
                    return {};
                }
            },
            //是否移除标题前面的icon
            removeIcon:{
                type:[Boolean,String,Number],
                default:false
            }

        },
        data() {
            return {
                
            }
        },
        computed:{
            p_require:function(){
                return typeof(this.require)==='string'?eval(this.require):this.require;
            },
            //标题样式
            p_titleStyle(){
                const _css = {
                    layout:this.titleStyle
                };
               return _TY_Tool.setStyle(_css,this);
            },
            //组件样式
            p_style(){
                const _css = {
                    layout:this.bbStyle
                };
               return _TY_Tool.setStyle(_css,this);
            }
        },
        watch: {
           
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
           
        }
    }
</script>

<style scoped>
    .c_red{
        color: red;
    }
    .c_3f3f3f{
        color: #3F3F3F;
    }
    .f_right{
        float: right;
        line-height: 1.85em;
        font-size: 0.85em;
    }
    ._title{
        font-size: 1.17em;
        color:#444;
        float: left;
    }
    ._title>h3{
        font-size: inherit;
        display: inline-block;
    }
    ._title_icon{
        height: 0.80em;
        width: 0.25em;
        float: left;
        background: #0091EA;
        border-radius: 6px;
        margin: 5px 8px 0 0;
    }
    ._box{
        width: 100%;
    }
    ._line{
        border-bottom: 1px solid #E4E4E4;
        padding-bottom: 5px;
    }
</style>