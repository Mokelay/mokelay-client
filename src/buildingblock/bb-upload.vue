<template>
    <div>
        <el-upload
            :action="uploadUrl"
            :on-success="onSuccess"
            :on-error="onError"
            :on-preview="picturePreview"
            :on-remove="handleRemove"
            :list-type="listType"
            :limit="limit"
            :accept="fileType"
            >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'bb-upload',
        props: {
            //上传接口配置
            uploadDs:{
                type:Object
            },
            //上传组件展示类型  text：只显示文件名称   picture：简单图片   picture-card：卡片
            listType:{
                type:String,
                default:'picture-card'
            },
            //限制上传数量
            limit:{
                type:Number
            },
            //文件类型
            fileType:{
                type:String,
                default:'image/png,image/gif,image/jpeg'
            },
            //处理图片地址数组
            handle:{
                type:String
            }
        },
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                uploadUrl:''
            }
        },
        watch: {
        },
        created: function () {
            if(this.uploadDs){
                this.uploadUrl = this.uploadDs.api
            }
            
        },
        mounted:function(){
        },
        methods: {
            //移除图片
            handleRemove:function(file, fileList) {
                const t = this;
                t.handleFileList('remove',fileList);
            },
            //预览图片
            picturePreview:function(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //上传成功
            onSuccess:function(response,file,fileList){
                const t = this;
                t.handleFileList('success',fileList)
            },
            //上传失败
            onError:function(err,file,fileList){
                const t = this;
                t.handleFileList('err',fileList)
            },
            handleFileList:function(emit,fileList){
                const t = this;
                _TY_Tool.loadBuzz(t.handle, function(code) {
                    fileList = eval(code);
                    t.$emit(emit,fileList);
                    t.$emit('input',fileList);
                });
            }
        }
    }
</script>