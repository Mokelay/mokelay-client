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
            :disabled="p_disable"
            >
            <i v-if="!p_disable" class="el-icon-plus"></i>
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
            },
            //是否禁用
            disable:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                p_disable:this.disable,
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
                const api = t.uploadDs['api'];
                const type = t.uploadDs['category'];
                let apiUrl = api;
                if (type == 'config') {
                    //如果不是自定义接口
                    apiUrl = window._TY_ContentPath + "/" + api;
                }
                t.uploadUrl = apiUrl;
            }
            if(t.value){
                t.setFileList(t.value,t) 
            }
        },
        mounted:function(){
            const t=this;
            if(t.p_disable){
                let uploadDom = this.$el.getElementsByClassName("el-upload el-upload--picture-card");
                if(uploadDom&&uploadDom.length>0){
                    this.$el.getElementsByClassName("el-upload el-upload--picture-card")[0].style.display="none";
                }
            }
            this.$emit('mounted',this.value);
        },
        methods: {
            //移除图片
            handleRemove:function(file, fileList) {
                const t = this;
                t.handleFileList('remove',fileList);
            },
            //预览图片
            picturePreview:function(file) {
                //当上传文件格式为图片时可以预览
                if(this.fileType.indexOf('image') != -1){
                    this.dialogImageUrl = file.url;
                    this.dialogVisible = true;
                }else{
                    const a = document.createElement('a');  
                    a.href = file.url;  
                    a.target='_blank';
                    a.download = file.fullName;  
                    a.click();
                }
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
                this.$message.error('文件上传失败');
                t.handleFileList('err',fileList)
            },
            handleFileList:function(emit,fileList){
                const t = this;
                //无handle情况下正常输出
                if(t.handle){
                    _TY_Tool.loadBuzz(t.handle, function(code) {
                        fileList = eval(code);
                        if(fileList instanceof Array && fileList.length<=0){
                            fileList='';
                        }
                        t.$emit(emit,fileList);
                        t.$emit('input',fileList);
                    });
                }else{
                    if(fileList instanceof Array && fileList.length<=0){
                        fileList='';
                    }
                    t.$emit(emit,fileList);
                    t.$emit('input',fileList);
                }
            },
            //回填图片
            setFileList:function(val,t){
                let list = val;
                if(typeof list == 'string'){
                    if(!list){
                        t.realFileList=[];
                    }else{
                        list = list.split(',');
                        list.forEach((ele,key)=>{
                            const nameList = ele.split('/');
                            const fullName = nameList[nameList.length - 1];
                            const name = fullName.slice(0,50);
                            const item = {
                                url:ele,
                                name:name,
                                fullName:fullName
                            }
                            t.realFileList.push(item);
                        })
                    }
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