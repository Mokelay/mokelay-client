<template>
    <div v-if="showButtom != 'false'" :class="bb_uploader_class">
        <el-upload
            :action="uploadUrl"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :on-preview="picturePreview"
            :on-remove="handleRemove"
            :list-type="listType"
            :limit="limit"
            :accept="fileType"
            :file-list="realFileList"
            :on-exceed="onExceed"
            :disabled="option.disabled"
            >
            <!-- <i v-if="!option.disabled" class="el-icon-plus"></i> -->
            <bb-button v-if="!option.disabled" :button="option.uploadButton"></bb-button>
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
            },
            /*基础配置
                {
                    disabled:false, //禁用
                    uploadButton:{ //上传按钮配置
                        type:'primary', 按钮主题
                        text:'上传', 按钮文字
                        size:'mini' 按钮大小
                    },
                    cover:true  //超出覆盖第一张
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        uploadButton:{
                            type:'primary',
                            text:'上传',
                            size:'mini'
                        },
                        cover:true
                    };
                }
            },
            //上传前的逻辑处理，return false表示不自动上传
            beforeUpload:{
                type:Function
            }
        },
        data() {
            return {
                p_disable:this.disable,
                dialogImageUrl: '',
                dialogVisible: false,
                uploadUrl:'',
                realFileList:[],
                showButtom:_TY_Tool.tpl(this.option.uploadButton.showValue, _TY_Tool.buildTplParams(this)),
                bb_uploader_class:"bb-uploader"
            }
        },
        watch: {
            value(val){
                const t = this;
                t.realFileList=[];
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
                if(fileList.length >= t.limit && !t.option.cover){
                    t.bb_uploader_class = "bb-uploader-uncover";
                }else{
                    t.bb_uploader_class = "bb-uploader";
                }
                t.handleFileList('remove',fileList,file);
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
                t.handleFileList('success',fileList,file);
            },
            //上传失败
            onError:function(err,file,fileList){
                const t = this;
                this.$message.error('文件上传失败');
                t.handleFileList('err',fileList,file);
            },
            handleFileList:function(emit,fileList,file){
                const t = this;
                let resultFileList='';
                //无handle情况下正常输出
                if(t.handle){
                    _TY_Tool.loadBuzz(t.handle, function(code) {
                        resultFileList = eval(code);
                        if(resultFileList instanceof Array && resultFileList.length<=0){
                            resultFileList='';
                        }
                        t.$emit(emit,resultFileList);
                        t.$emit('input',resultFileList);
                    });
                }else{
                    resultFileList = t.defaultBuzzHandle(fileList);
                    if(fileList instanceof Array && fileList.length<=0){
                        resultFileList='';
                    }

                    // resultFileList = [{name: 'food.jpeg', url: "http://xlx.saiyachina.com/config/ty_oss_download?bucketName=ty-storage&fileName=6ad896008755c91c0a4aea3818bbbc35.jpg"}];
                    // t.realFileList
                    t.$emit(emit,resultFileList);
                    t.$emit('input',resultFileList);
                }
            },
            //默认处理文件回调
            defaultBuzzHandle:function(fileList){
                let t=this;
                var newArr = '';
                const fileKey = (t.uploadDs.outputs[0]&&t.uploadDs.outputs[0]['valueKey'])||'file_url';
                fileList.forEach((val, key) => {
                    if (val.fullName && !val.response && val.url) {
                        if (newArr.length > 0) {
                            newArr = newArr + ',' + val.url
                        } else {
                            newArr = val.url
                        }
                    } else if (val.response && val.response.data && val.response.data[fileKey]) {
                      if (newArr.length > 0) {
                                newArr = newArr + ',' + val.response.data[fileKey];
                            } else {
                                newArr = val.response.data[fileKey];
                            }
                    }
                });
                newArr = newArr.length == 0 ? "" : newArr
                return newArr;
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
                            //这个文件已经存在，就直接返回
                            for(let i=0;i<t.realFileList.length;i++){
                                if(t.realFileList[i].fullName == fullName){
                                    return true;
                                }
                            }
                            t.realFileList.push(item);
                        })
                    }
                }else{
                    t.realFileList = list
                }
                if(t.realFileList.length >= t.limit && !t.option.cover){
                    t.bb_uploader_class = "bb-uploader-uncover";
                }else{
                    t.bb_uploader_class = "bb-uploader";
                }
            },
            //文件超出个数限制时的钩子
            onExceed:function(files, fileList){
                debugger
                const t = this;
                if(t.option.cover){
                    t.realFileList.splice(0,1,files[0]);
                }else{
                    t.$message.error('文件超出个数限制');
                    t.bb_uploader_class = "bb-uploader-uncover";
                }
            }
        }
    }
</script>
<style lang="less">
    .bb-uploader-uncover{
        .el-upload--picture-card{
            display:none;
        }
    }
</style>