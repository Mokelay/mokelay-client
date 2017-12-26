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
            :file-list="realFileList"
            :on-exceed="onExceed"
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
            //默认值
            value:{
                type:[Array,String]
            },
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
                uploadUrl:'',
                realFileList:[]
            }
        },
        watch: {
            value(val){
                const t = this;
                t.setFileList(val,t);
            }
        },
        created: function () {
            const t = this;
            if(t.uploadDs){
                t.uploadUrl = t.uploadDs.api
            }
            if(t.value){
                t.setFileList(t.value,t) 
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
                this.$message.success('文件上传成功');
                t.handleFileList('success',fileList)
            },
            //上传失败
            onError:function(err,file,fileList){
                const t = this;
                this.$message.success('文件上传失败');
                t.handleFileList('err',fileList)
            },
            handleFileList:function(emit,fileList){
                const t = this;
                //无handle情况下正常输出
                if(t.handle){
                    _TY_Tool.loadBuzz(t.handle, function(code) {
                        fileList = eval(code);
                        t.$emit(emit,fileList);
                        t.$emit('input',fileList);
                    });
                }else{
                    t.$emit(emit,fileList);
                    t.$emit('input',fileList);
                }
            },
            //回填图片
            setFileList:function(val,t){
                let list = val;
                if(typeof list == 'string'){
                    list = list.split(',');
                    list.forEach((ele,key)=>{
                        const item = {
                            url:ele
                        }
                        t.realFileList.push(item);
                    })
                }else{
                    t.realFileList = list
                }
            },
            //文件超出个数限制时的钩子
            onExceed:function(files, fileList){
                this.$message.error('文件超出个数限制');
            }
        }
    }
</script>