<template>
    <div class="bb_button_media">
        <bb-dialog title="积木设置" size="middle" :isShow.sync="showDialog">
            <bb-media :multiple="multiple" :uploadDs="uploadDs" :mediaDs="mediaDs" :pageSize="pageSize"
                @commit="commit" :defaultSelected="p_value" :mediaProps="mediaProps"
            ></bb-media>
        </bb-dialog>
        
        <el-input v-if="!p_value" class="wa" placeholder="请选择" disabled v-model="p_value"></el-input>
        <div v-if="p_value&&isImg(p_value)" v-for="img in selectArray" class="bb-media-img-box"><img style="width:100%;" :src="img"/></div>

        <el-button @click="openDialog"><i class="el-icon-search"></i></el-button>
        <el-button class="ml0" @click="clear"><i class="el-icon-delete"></i></el-button>
    </div>
</template>

<script>
    
    import BBMedia from './bb-media';

    import bbdialog from './bb-dialog.vue';

    import Vue from 'vue';
    import {
            Input,
            Button
    } from 'element-ui'
    Vue.use(Input);
    Vue.use(Button);

    export default {
        name: 'bb-button-media',
        components: {
          "bb-media":BBMedia,
            "bb-dialog":bbdialog
        },
        props: {
            //文件地址
            value:{
                type:String
            },
            //是否多选
            multiple:{
                type:Boolean,
                default:false
            },
             //上传接口配置
            uploadDs:{
                type:Object
            },
            //媒体库列表接口
            mediaDs:{
                type:Object
            },
            //每页多少条
            pageSize:{
                type:[Number,String],
                default:15
            },
             //列表属性映射
            mediaProps:{
                type:Object,
                default:function(){
                    return {
                        index:"index",
                        src:'src',
                        title:'title',
                        desc:'desc',
                        replaceText:'replaceText',
                        fileName:'fileName',
                        uploadDate:'uploadDate',
                        length:'length',
                        size:'size'
                    };
                }
            },
        },
        data() {
            return {
                showDialog:false,
                p_value:this.value
            }
        },
        watch: {
            value:function(val){
                this.p_value = val;
            }
        },
        computed:{
            selectArray(){
                if(this.p_value){
                    return this.p_value.split(",");
                }else{
                    return [];
                }
            }
        },
        created: function () {
            let t=this;
            
        },
        mounted:function(){
            let t=this;
        },
        methods: {
            //是文件
            isImg:function(fileStr){
                let t=this;
                const fileType = fileStr.split(".")[fileStr.split(".").length-1].toLocaleLowerCase();
                const filePrefix = ['jpg','jpeg','png','gif','bmp'];
                return filePrefix.indexOf(fileType)>=0;
            },
            //清空媒体库选择的文件
            clear:function(){
                let t=this;
                t.p_value = "";
                t.$emit("input","");
            },
            //打开弹窗
            openDialog:function(){
                let t=this;
                t.showDialog = true;
            },
            //选中图片
            commit:function(selecteds,media){
                let t=this;
                t.showDialog = false;
                if(selecteds){
                    let result =[];
                    selecteds.forEach((item)=>{
                        result.push(item.src);
                    });
                    t.p_value =result.join(",");
                }else{
                    t.p_value = "";
                }
                t.$emit('input',t.p_value);
                t.$emit('change',t.p_value);
                t.$emit("commit",selecteds,t); 
            }
        }
    }
</script>

<style scoped>
    .bb-media-img-box{
        width:60px;
        height: 60px;
        line-height: 60px;
        overflow: hidden;
        display: inline-block;
        vertical-align: bottom;
        margin: 0 3px;
    }
    .el-input.wa{
        width: auto;   
    }
</style>
