
<template>
    <div :class="['indep_portal',theme]" >
        <div v-if="theme=='l-img-r-text'||theme=='t-img-b-text'||theme=='img-c-text'" :class="['flex','flex_center',(theme=='t-img-b-text')?'flex_col ':'']">
            <div class="img_box" :style="p_imgStyle">
                <img :src="imgUrl"/>
            </div>
            <div class="text_box flex1" :style="p_textStyle" v-html="text">
            </div>
        </div>
        <div v-if="theme=='l-text-r-img'||theme=='t-text-b-img'" :class="['flex','flex_center',(theme=='t-text-b-img')?'flex_col':'']">
            <div class="text_box flex1" :style="p_textStyle" v-html="text">
            </div>
            <div class="img_box" :style="p_imgStyle">
                <img :src="imgUrl"/>
            </div>
        </div>
        <div v-if="theme=='img'">
            <div class="img_box" :style="p_imgStyle">
                <img :src="imgUrl"/>
            </div>
        </div>
        <div v-if="theme=='text'">
            <div class="text_box flex1" :style="p_textStyle" v-html="text">
            </div>
        </div>
    </div>
</template>

<script>

    /**
        图文组件，主题：左图右文，左文右图，上图下文，上文下图，纯图，纯文，图中有文      
    */
    export default {
        name: 'bb-indep-portal',
        props: {
            /**主题 
                左图右文:l-img-r-text;
                左文右图:l-text-r-img;
                上图下文:t-img-b-text;
                上文下图:t-text-b-img;
                纯图:img;
                纯文:text;
                图中有文:img-c-text
            */
            theme:{
                type:String,
                default:'l-img-r-text'
            },
            //图片地址
            imgUrl:{
                type:String
            },
            //文本
            text:{
                type:String
            },
            //图片样式
            imgStyle:{
                type:String
            },
            //文字样式
            textStyle:{
                type:String
            }
        },
        data() {
            return {
            }
        },
        computed:{
            p_imgStyle(){
                return _TY_Tool.setSimpleStyle(this.imgStyle);
            },
            p_textStyle(){
                return _TY_Tool.setSimpleStyle(this.textStyle);
            }
        },
        watch: {
           
        },
        created: function () {
            let t=this;
        },
        mounted:function(){
            let t=this;
        },
        methods: {
            
            
        }
    }
</script>

<style lang='less' scoped>
    .indep_portal{
        font-size:0.5rem;
        .img_box{
            width:60%;
            img{
                width:100%;                
            }
        }
        .text_box{
            font-size: 0.8rem;
            padding-left:1rem;
        }

    }
    .indep_portal.img,.indep_portal.img-c-text{
        .img_box{
            width:auto;
        }
        .text_box{
            position:absolute;
            left:40%;
            color:#ccc;
        }
    }

    
</style>