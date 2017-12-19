<template>
    <div>
        <el-upload
            action="http://hxwy.dev.rs.com/wy/uploadMany"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
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
            uploadDs:{
                type:Object
            },
            deleteDs:{
                type:Object
            }
        },
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            uploadFile:function(val){
                const t = this;
                if (t.uploadDs) {
                    _TY_Tool.getDSData(t.uploadDs, {"bb": t, "router": t.$route.params}, function (map) {
                        map.forEach((val,key)=>{
                           const dataKey = val.dataKey
                            t[dataKey] = val.value.list;
                        })
                        t.loadCahrts()
                    }, function (code, msg) {
                    });
                }
            },
            deleteFile:function(){
                const t = this;
                if (t.deleteDs) {
                    _TY_Tool.getDSData(t.deleteDs, {"bb": t, "router": t.$route.params}, function (map) {
                        map.forEach((val,key)=>{
                           const dataKey = val.dataKey
                            t[dataKey] = val.value.list;
                        })
                        t.loadCahrts()
                    }, function (code, msg) {
                    });
                }
            },
            handleRemove:function(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview:function(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            }
        }
    }
</script>