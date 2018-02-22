<template>
    <div class="lh100">
        <div :index="randomId" :key='randomId' type="text/plain" id="weditor"></div>
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
            }
        },
        data() {
            return {
                dataInterface: {
                    uploadImgServer: _TY_APIHost+'/wy/upload/file'  // 编辑器插入的图片上传地址
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
                t.editor = new WangEditor('#weditor');
                t.createEditor(JQUERY);
            },'wangeditor_jquery');
        },
        beforeDestroy() {
            this.destroyEditor();
        },
        methods: {
            createEditor(JQUERY){  // 创建编辑器
                this.initEditorConfig();  // 初始化编辑器配置，在create之前
                this.editor.create();  // 生成编辑器
                this.editor.txt.html(this.value);  // 初始化内容
                document.getElementById('weditor').style.height='auto';  // 使编辑器内容区自动撑开，在css中定义min-height
                document.getElementById('weditor').style.width='auto';
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
                this.editor.customConfig.uploadImgServer = this.dataInterface.uploadImgServer;  // 图片上传地址
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
            }

        }
    }
</script>

<style scoped>
    .lh100 {
        line-height: 100%;
    }
    #weditor {
        width: 100%;
        min-height: 330px;
        height: auto;
    }
</style>