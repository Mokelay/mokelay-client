<template>
    <div class="lhp100">
        <div :index="randomId" :key='randomId' type="text/plain" ref="weditor"></div>
    </div>
</template>

<script>

    export default {
        name: 'bb-editor-weditor',
        components: {
//            WangEditor:resolve => {require(['wangeditor'], resolve)}//懒加载
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            //上传ds
            uploadDs:{
                type:Object
            }
        },
        data() {
            return {
                dataInterface: {
                    uploadImgServer: this.getUploadApi()  // 编辑器插入的图片上传地址
                },
                editor: '',  // 存放实例化的wangEditor对象，在多个方法中使用
                // 为了避免麻烦，每个编辑器实例都用不同的 id
                randomId: 'editor_' + (Math.random() * 100000000000000000)
            };
        },
        watch: {
           value(){
               if(this.editor){
                   this.editor.txt.html(this.value);
               }
           }
        },
        computed: {},
        beforeCreate: function () {
        },
        created: function () {
            //this.editor.txt.html(this.value);
        },
        mounted: function () {
            let t=this;
            require.ensure([ 'wangeditor','jquery'], function (require) {
                let WangEditor = require("wangeditor");
                var JQUERY = require("jquery");
                t.editor = new WangEditor(t.$refs['weditor']);
                t.createEditor(JQUERY);
            },'wangeditor_jquery');
        },
        beforeDestroy() {
            this.destroyEditor();
        },
        methods: {
            getUploadApi:function(){
                const t=this;
                let apiUrl = "";
                if(t.uploadDs){
                    const api = t.uploadDs['api'];
                    const type = t.uploadDs['category'];
                    apiUrl = api;
                    if (type == 'config') {
                        //如果不是自定义接口
                        apiUrl = window._TY_ContentPath + "/" + api;
                    }
                    apiUrl = _TY_APIHost + apiUrl;
                }
                return apiUrl;
            },
            createEditor(JQUERY){  // 创建编辑器
                let t=this;
                this.initEditorConfig();  // 初始化编辑器配置，在create之前
                this.editor.create();  // 生成编辑器
                this.editor.txt.html(this.value);  // 初始化内容
                t.$refs['weditor'].style.height='auto';  // 使编辑器内容区自动撑开，在css中定义min-height
                t.$refs['weditor'].style.width='auto';
                JQUERY('.w-e-toolbar').css('flex-wrap',"wrap");
            },
            destroyEditor(){  // 销毁编辑器，官方没有给出完美方案。此方案是作者给出的临时方案
                //this.editor.destroy();  // 这个没有完全销毁实例，只是作了隐藏
                //var t =this;
                //t.JQUERY('#weditor').remove();  // 不报错的话，这一步可以省略
                this.editor = null;


                //WangEditor.numberOfLocation--;  // 手动清除地图的重复引用，作者的临时解决方案。否则单页面来回切换时，地图报错重复引用
            },
            initEditorConfig(){  // 初始化编辑器配置
                let t=this;
                //所有配置参数请参考：https://www.kancloud.cn/wangfupeng/wangeditor3/335782
                // this.editor.customConfig.uploadImgServer = this.dataInterface.uploadImgServer;  // 图片上传地址
                //自定义上传文件
                this.editor.customConfig.customUploadImg = t.uploadFiles;

                // 将图片大小限制为 3M
                this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
                // 限制一次最多上传 5 张图片
                this.editor.customConfig.uploadImgMaxLength = 5;
                //自定义 fileName
                this.editor.customConfig.uploadFileName = 'file';
                this.editor.customConfig.uploadImgParams = {  // 自定义上传参数配置
//                    usersecret: usersecret
                };
                this.editor.customConfig.onchangeTimeout = 1000; // 单位 ms
                this.editor.customConfig.onchange = function (html) {
                    t.$emit("input",html);
                    t.$emit("change",html);
                };
                this.editor.customConfig.onblur = function (html) {
                    t.$emit("input",html);
                };
                this.editor.customConfig.zIndex=1;
            },
            getEditorContent(){  // 获取编辑器 内容区内容
                this.editorContent = this.editor.txt.html();  // 获取 html 格式
                // this.editor.txt.text();  // 获取纯文本
                // this.editor.txt.formatText();  // 获取格式化后的纯文本
            },
            //上传文件
            uploadFiles(files,insert){
                const t=this;
                if(files&&files.length>0){
                    files.forEach((item)=>{
                        t.uploadeFile(item);
                    });
                }
            },
            //文件上传
            uploadeFile(file,insert){
                const t = this;
                let formdata = new FormData();
                formdata.append('file',file);
                console.log('正在上传。。。');
                //添加请求头 
                let uploadUrl = t.getUploadApi()?t.getUploadApi():"/config/ty_oss_upload";//统一文件上传地址
                const xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
                xhr.open("post", uploadUrl, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                xhr.onload = (res) => { 
                        const response = JSON.parse(res.target.response);
                        const url = response.data.file_url;
                        insert(url);//插入到文本中
                        _TY_Toast.closeAll();
                        _TY_Toast({content:"上传成功！"});
                    }; //请求完成
                xhr.onerror =  (res) => { _TY_Toast({content:"上传失败！"})}; //请求失败
                xhr.send(formdata); //开始上传，发送form数据
                _TY_Toast({content:"上传中！",$type:"loading",duration:900000});
            }
        }
    }
</script>

<style scoped>
    .lhp100 {
        line-height: 100%;
    }
    #weditor {
        width: 100%;
        min-height: 330px;
        height: auto;
    }
</style>