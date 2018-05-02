<template>
    <div :style="p_bbStyle" class="ty_comment">
        <div class="ty_comment_box" v-for="(item,index) in p_options">
            <div class="ty_comment_line" v-if="index!=p_options.length-1"></div>
            <div class="ty_comment_circle">{{index+1}}</div>
            <div class="ty_comment_title clearfix">
                <span class="title_left">
                    {{item.title}}
                    <span><i class="ty-icon_renwu"></i>{{item.userName}}</span>
                </span>
                <span class="title_right">{{item.commentTime}}</span>
            </div>
            <div class="ty_comment_content">
                <h4>{{item.opinion}}</h4>
                <span>{{item.comment}}</span>
                <ul>
                    <li v-for="(file,key) in item.files">
                        <a target="_blank" :href="file.fileUrl">{{file.fileName}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'bb-comment-chain',
        props: {
            /** 静态数据源
                [{
                    title:'委管部意见',
                    userPic:'',
                    userName:'王五',
                    comment:'请做好评估工作',
                    opinion:'同意',
                    commentTime:'2016年03月20日 10:45',
                    files:[{
                        fileName:'社保、公积金异地缴纳申请.docx',
                        fileUrl:'/'
                    }]
                },{
                    title:'委管部意见2',
                    userPic:'',
                    userName:'王五2',
                    comment:'请做好评估工作2',
                    opinion:'同意',
                    commentTime:'2016年03月20日 10:45',
                    files:[{
                        fileName:'社保、公积金异地缴纳申请2.docx',
                        fileUrl:'/'
                    }]
                }];
            */
            options:{
                type:[Array,String]
            },
            //组件外层样式
            bbStyle:{
                type:[String,Object]
            },
            //数据源
            ds:{
                type:Object
            }
        },
        data() {
            return {
                p_options:typeof(this.options)==='string'?JSON.parse(this.options):this.options,
                p_bbStyle:(typeof(this.bbStyle)==='string'?JSON.parse(this.bbStyle):this.bbStyle)
            }
        },
        watch: {
            
        },
        created: function () {
            let t=this;
            t.loadData();
        },
        mounted:function(){
            
        },
        methods: {
            //外部联动 接收交互参数
            linkage:function(...data){
                const t = this;
            },
            loadData:function(){
                let t=this;
                if(t.ds){
                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        if(map&&map.length>0&&map[0]&&map[0].value){
                            t.p_options = map[0].value;
                            if(t.p_options.hasOwnProperty("list")){
                                t.p_options = t.p_options.list;
                            }
                        }
                    }, function (code, msg) {
                        t.$message({
                            type: 'error',
                            message: '数据获取失败，'+msg
                        });
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .ty_comment{
    }
    .ty_comment_box{
        margin-left: 21px;
        margin-top: 16px;
        position: relative;
    }
    .ty_comment_title{
        margin: 5px 0;
        margin-left: 34px;
    }
    .title_left{
         color:#999;
         font-size: 14px;
         float: left;
    }
    .title_left span{
        padding: 0 8px;
        color:#666;
    }
    .title_left span i{
        vertical-align:initial;
    }
    .title_right{
        color:#999;
        font-size: 14px;
        float:right;
    }
    .ty_comment_content{
        background: #F5F5F5;
        border-radius: 100px;
        padding: 17px;
        margin-left: 34px;
        border-top-left-radius: 5px;
    }
    .ty_comment_circle{
        background: #e4e4e4;
        border-radius: 22px;
        width: 44px;
        height: 44px;
        position: absolute;
        color:#9b9b9b;
        left: -22px;
        top:11px;
        text-align: center;
        padding-top: 11px;
    }
    .ty_comment_line{
        position: absolute;
        width: 1px;
        height: 100%;
        background: #e4e4e4;
        margin-top: 40px;
    }
    .ty_comment_content{
        color: #444;
        font-size: 14px;
        line-height: 1.5em;
    }
    .ty_comment_content a{
        color: #0091EA;
    }
    .ty_comment_content span{
        color: #666;
    }
    
    .flex {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    }
    .flex-v {
        -webkit-box-orient: vertical;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
    }

    .flex-1 {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
    }

    .flex-align-center {
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .flex-pack-center {
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
    }

    .flex-pack-justify {
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }


</style>