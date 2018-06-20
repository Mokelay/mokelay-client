<template>
    <div class="bb_media">
        <!-- tabs -->
        <el-tabs v-model="activeName" class="media_tabs" @tab-click="handleClick">
            <el-tab-pane label="上传文件" name="upload">
                <!-- 上传文件 -->
                <el-upload
                  class="media_upload"
                  drag
                  @on-success="uploadSuccess"
                  :action="uploadUrl"
                  :multiple="false">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <!-- <div class="el-upload__tip" slot="tip">上传文件不能超过2MB</div> -->
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="媒体库" name="store">
                <!-- 媒体库 -->
                <div class="flex">
                    <section ref="box_left" class="flex1 box_left">
                        <div class="media_search">
                            <!-- 搜索条 -->
                        </div>
                        <div>
                            <el-upload
                              v-if="fileList.length==0"
                              class="media_upload"
                              drag
                              @on-success="uploadSuccess"
                              :action="uploadUrl"
                              :multiple="false">
                              <i class="el-icon-upload"></i>
                              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                              <!-- <div class="el-upload__tip" slot="tip">上传文件不能超过2MB</div> -->
                            </el-upload>
                            <ul ref="media_box" class="clearfix media_box">
                                <li v-for="(item,index) in fileList" :class="{
                                    'media_file_lis':true,
                                    'details':checkSelectedHasItem(index),
                                    'selected':checkSelectedHasItem(index)
                                }" @click="fileItemClick(item,index)">
                                    <div class="media_file_preview">
                                        <div class="media_thumbnail">
                                            <div class="media_centered">
                                                <img :src="item.src" draggable="false"/>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="media_check">
                                        <i class="iconfont ty-wj_multiple_choice_q" style="vertical-align:top;"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <section class="media_store_right box_right" style="max-height:389px;">
                        <div v-if="selecteds.length>0"> 
                            <h2 style="font-size:12px;color: #666;margin: 24px 0 8px;">附件详情</h2>
                            <div class="media_thumbnail_right">
                                <div class="media_thumbnail_img">
                                    <img :src="selecteds[0].src" :title="selecteds[0].title" style="cursor:pointer;"/>
                                </div>
                                <div class="media_thumbnail_detail">
                                    <div>{{selecteds[0].fileName||''}}</div>
                                    <div>{{selecteds[0].uploadDate||''}}</div>
                                    <div>{{selecteds[0].length||''}}</div>
                                    <div>{{selecteds[0].size||''}}</div>
                                </div>
                            </div>
                            <el-form v-model="selecteds[0]" label-width="30%">
                                <el-form-item size="small" label="URL">
                                    <el-input disabled v-model="selecteds[0].src"></el-input>
                                </el-form-item>
                                <el-form-item size="small" label="标题">
                                    <el-input  v-model="selecteds[0].title"></el-input>
                                </el-form-item>
                                <el-form-item size="small" label="说明">
                                    <el-input type="textarea" v-model="selecteds[0].desc"></el-input>
                                </el-form-item>
                                <el-form-item size="small" label="替代文本">
                                    <el-input v-model="selecteds[0].replaceText"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </section>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- 底部选中展示  和确认按钮 -->
        <div class="media_bottom flex">
            <div class="flex1">
                <p class="media_bottom_left">
                    <span>已选择{{selecteds.length}}个</span>
                    <a class="media_bottom_clear" @click="clearSelected">清空</a>
                </p>
                <ul style="display: inline-block;">
                    <li v-for="(item,index) in selecteds" class="media_bottom_view">
                        <div class="media_file_preview">
                            <div class="media_thumbnail">
                                <div class="media_centered">
                                    <img :src="item.src" draggable="false"/>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <button type="button" @click="mediaCommit" class="media_commit_btn">确认</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'bb-media',
        props: {
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
            }
        },
        data() {
            return {
                activeName:"upload",
                page:1,//第几页
                totalPages:0,//总页数
                /**
                    [{
                        index:0,
                        src:'xxx',
                        title:'xxx',
                        desc:'说明',
                        replaceText:'替换文本',
                        fileName:'xxxxxx.jpg',
                        uploadDate:'2018-06-12 10:22:00',
                        length:'143KB',
                        size:'1920 x 1109'
                    }]
                */
                selecteds:[],
                uploadUrl:'',//上传接口地址
                fileList:[]
            }
        },
        watch: {
            
        },
        computed:{
            
        },
        created: function () {
            let t=this;
            if(t.uploadDs){
                const api = t.uploadDs['api'];
                const type = t.uploadDs['category'];
                let apiUrl = api;
                if (type == 'config') {
                    //如果不是自定义接口
                    apiUrl = window._TY_ContentPath + "/" + api;
                    if(location.host.startsWith('local')){
                        apiUrl = location.protocol+"//longyan.dev.rs.com"+apiUrl;
                    }
                }
                t.uploadUrl = apiUrl;
            }
            t.page=1;
            //加载媒体数据
            t.loadMeidaList();
        },
        mounted:function(){
            let t=this;
            //监听滚动事件
            t.listenScroll();
        },
        methods: {
            //监听滚动事件
            listenScroll:function(){
                let t=this;
                t.$refs['box_left'].addEventListener('scroll',()=>{
                    const _scrollTop = t.$refs['box_left'].scrollTop;
                    const ulHeight = t.$refs['media_box'].offsetHeight;
                    const contentHeight = t.$refs['box_left'].offsetHeight;
                    let flag = true;//标记，避免重复请求
                    if(_scrollTop>=(ulHeight-contentHeight) && t.totalPages>0 && t.page<t.totalPages &&flag){
                        //到底了,如果不是最后一页，继续加载
                        t.page = t.page+1;
                        if(flag){
                            flag = false;
                            t.loadMeidaList();
                        }
                        window.setTimeout(()=>{
                            //加载后，两秒不能再请求，避免重复请求
                            flag=true;
                        },2000);
                    }
                },true);
            },
            //加载媒体数据
            loadMeidaList:function(){
                let t=this;
                if(t.mediaDs){
                    _TY_Tool.getDSData(t.mediaDs, _TY_Tool.buildTplParams(t,{}), function (map) {
                        map.forEach(function (item) {
                            var list = item['value']['currentRecords'];
                            if(t.page==1){
                                t.fileList = [];
                            }
                            for (var i in list) {
                                //这里可能需要中间件处理一下接口返回的数据fileList 的item结果如下：
                                /**
                                    {
                                        title:'测试1',
                                        src:"http://ty.greatbee.com/wp-content/uploads/2018/05/test-300x202.png",
                                        desc:'说明',
                                        replaceText:'替换文本',
                                        fileName:'xxxxxx.jpg',
                                        uploadDate:'2018-06-12 10:22:00',
                                        length:'143KB',
                                        size:'1920 x 1109'
                                    }
                                */
                                t.fileList.push(list[i]);
                            }
                            t.totalPages = item['value']['totalPages'];
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //检查item 是否勾选上了
            checkSelectedHasItem:function(_index){
                let t=this;
                for(let i=0;i<t.selecteds.length;i++){
                    let item = t.selecteds[i];
                    if(item.index==_index){
                        return true;
                    }
                }
                return false;
            },
            //tab点击事件
            handleClick:function(tab,event){
                let t=this;
                if(tab.name==='store'){
                    //如果是媒体库，重新加载数据
                    t.page=1;
                    t.loadMeidaList();
                }
            },
            //清空选中
            clearSelected:function(){
                let t=this;
                t.selecteds = [];
            },
            //上传成功  时触发
            uploadSuccess:function(response,file,fileList){
                let t=this;
                console.log("resposne",response);
                console.log("file=",file);
                t.activeName = "store";
            },
            //文件点击事件
            fileItemClick:function(file,index){
                let t=this;
                let clearFlag = false;
                t.selecteds.forEach((item)=>{
                    if(item.index == index){
                        //选中文件 已经存在，则取消选中
                        clearFlag = true;
                        return false;
                    }
                });
                t.selecteds = [];
                if(!clearFlag){
                    t.selecteds.push(Object.assign({},file,{
                        index:index
                    }));
                }
            },
            //媒体库提交事件
            mediaCommit:function(){
                let t=this;
                //提交媒体库
                t.$emit("commit",t.selecteds,t);
            }
        }
    }
</script>

<style scoped>
    .flex{
        display:flex;
        display:-webkit-flex;
        display:-ms-flex;
        display:-moz-flex;
        display:-o-flex;
    }
    .flex1{
        -moz-box-flex:1.0; /* Firefox */
        -webkit-box-flex:1.0; /* Safari 和 Chrome */
        box-flex:1.0;
        flex:1.0;
    }
    .media_bottom{
        border-top: 1px solid #ddd;
        padding: 0 16px;

    }
    .media_bottom_left{
        padding:10px;
        font-size: 14px;
        font-weight: 600;
        display: inline-block;
        vertical-align: top;
    }
    .media_bottom_clear{
        cursor: pointer;
        font-size: 12px;
        color: red;
        display: block;
    }
    .media_tabs{
        min-height: 400px;
        overflow: hidden;
    }
    .box_right,.box_left{
        max-height: 400px;
        overflow: auto;
    }
    .box_right::-webkit-scrollbar,.box_left::-webkit-scrollbar {
         display: none;
    }
    .media_upload{

    }
    .media_store_right{
        background-color: #f3f3f3;
        min-height: 300px;
        border-left: 1px solid #ddd;
        width: 25%;
        padding: 0 16px 24px;
        overflow: auto;
        box-sizing: content-box;
    }
    .media_file_lis{
        width:25%;
        position: relative;
        float: left;
        padding: 8px;
        margin: 0;
        color: #444;
        cursor: pointer;
        list-style: none;
        text-align: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        box-sizing: border-box;
    }
    .media_file_preview{
        position: relative;
        box-shadow: inset 0 0 15px rgba(0,0,0,.1),inset 0 0 0 1px rgba(0,0,0,.05);
        background: #eee;
        cursor: pointer;
    }
    .media_file_preview:before{
        content: "";
        display: block;
        padding-top: 100%;
    }
    .media_thumbnail{
        overflow: hidden;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 1;
        transition: opacity .1s;
    }
    .media_centered{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        -webkit-transform: translate(50%,50%);
        transform: translate(50%,50%);
    }
    .media_centered img{
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
        max-height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
    .media_check{
        display: none;
        height: 24px;
        width: 24px;
        padding: 0;
        border: 0;
        position: absolute;
        z-index: 10;
        top: 0;
        right: 0;
        outline: 0;
        /*background: #eee;*/
        cursor: pointer;
        /*box-shadow: 0 0 0 1px #fff,0 0 0 2px rgba(0,0,0,.15);*/
    }
    .media_check .iconfont{
        width: 24px;
        height: 24px;
        font-size: 24px;
        color: #0073aa;
        font-weight: 900;
    }

    .media_file_lis.details{
        box-shadow: inset 0 0 0 3px #fff,inset 0 0 0 7px #0073aa;
    }
    .media_file_lis.selected .media_check{
        display: block;
        /*background-color: #0073aa;
        box-shadow: 0 0 0 1px #fff,0 0 0 2px #0073aa;*/
    }
    .media_bottom_view{
        width: 53px;
        padding: 0;
        margin: 4px;
        position: relative;
        cursor: pointer;
        list-style: none;
        text-align: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        box-sizing: border-box;
    }
    .media_thumbnail_right{
        overflow: hidden;
        min-height: 60px;
        margin-bottom: 16px;
        line-height: 18px;
        color: #666;
        border-bottom: 1px solid #ddd;
        padding-bottom: 11px;
    }
    .media_thumbnail_img{
        position: relative;
        max-width: 120px;
        max-height: 120px;
        margin-top: 5px;
        margin-right: 10px;
        margin-bottom: 5px;
    }
    .media_thumbnail_img img{
        display: block;
        max-width: 120px;
        max-height: 120px;
        margin: 0 auto;
    }
    .media_thumbnail_detail{
        font-size: 12px;
    }
    .media_commit_btn{
        height: 30px;
        line-height: 28px;
        padding: 0 12px 2px;
        margin-left: 10px;
        margin-top: 15px;
        box-shadow: 0 1px 0 #006799;
        text-decoration: none;
        text-shadow: 0 -1px 1px #006799,1px 0 1px #006799,0 1px 1px #006799,-1px 0 1px #006799;
        vertical-align: top;
        font-size: 13px;
        display: inline-block;
        cursor: pointer;
        -webkit-appearance: none;
        border-radius: 3px;
        white-space: nowrap;
        box-sizing: border-box;
        background: #0085ba;
        border-color: #0073aa #006799 #006799;
        color: #fff;
    }
    .media_commit_btn:hover{
        background: #008ec2;
        border-color: #006799;
        color: #fff;
    }

</style>
<style>
    .clearfix:after{
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
        height: 0;
    }
    .clearfix{
        zoom:1;
    }

    .media_upload .el-upload-dragger{
        width: 100%;
        min-height:345px;
    }
    .media_upload .el-upload--text{
        display: block;
    }
    .media_upload i.el-icon-upload{
        margin-top: 100px;
    }
</style>