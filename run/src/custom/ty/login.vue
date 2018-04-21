<template>
    <div>
        <div class="login-box">
            <el-row type="flex" justify="center">
                <el-col>
                    <h1 class="login-title">TY 登 录</h1>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col :span="8">
                    <el-input id="name" v-model="formData.username" placeholder="请输入帐号">
                        <template slot="prepend">帐号</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col :span="8">
                    <el-input id="password" v-model="formData.password" type="password" placeholder="请输入密码">
                        <template slot="prepend">密码</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col :span="8">
                    <el-button id="login" @click="login" style="width:100%" type="primary">登录</el-button>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col :span="8">
                   <a class="changePwd" @click="gotoChangePwd">修改密码</a>
                </el-col>
            </el-row>
        </div>

        <bb-dialog title="修改密码" :isShow.sync="dialogVisible" size="small">
            <bb-form @commit="changePwd"
                     settingButtonText="确定"
                    :fields="formFields"></bb-form>
        </bb-dialog>

    </div>
</template>

<script>
    export default {
        name: 'ty-login',
        components: {},
        props: {},
        data() {
            return {
                formData: {
                    username: '',
                    password: ''
                },
                dialogVisible:false,
                formFields:[{
                    attributeName: "userName",
                    name: "用户名",
                    dt: "string",
                    et: "bb-input",
                    rules:[{
                        required: true,
                        message:'用户名必填'
                    }]
                },{
                    attributeName: "oldPassword",
                    name: "原始密码",
                    dt: "string",
                    et: "el-input",
                    etProps:"{type:'password',placeholder:'请输入原始密码'}",
                    rules:[{
                        required: true,
                        message:'原始密码必填'
                    }]
                },{
                    attributeName: "newPassword",
                    name: "新密码",
                    dt: "string",
                    et: "el-input",
                    etProps:"{type:'password',placeholder:'请输入新密码'}",
                    rules:[{
                        required: true,
                        message:'新密码必填'
                    }]
                },{
                    attributeName: "newPassword2",
                    name: "新密码确认",
                    dt: "string",
                    et: "el-input",
                    etProps:"{type:'password',placeholder:'请确认新密码'}",
                    rules:[{
                        required: true,
                        message:'确认新密码必填'
                    }]
                }]
            };
        },
        methods: {
            login(){
                const t = this;
                //gb 表示demo项目
                _TY_Tool.post(_TY_ENV.name=='prd'?'/ty/login':_TY_ContentPath+"/ty-login", {
                    userName:t.formData.username,
                    password:t.formData.password
                }).then(function (response) {
                    let dataMap = response['data'];
                    if (dataMap['ok']) {
                        t.$router.push("/home");
                    }else{
                        t.$message.error(dataMap['message']);
                    }
                }).catch(function (error) {
                    t.$message.error(error.message);
                });
            },
            gotoChangePwd(){
                const t=this;
                t.dialogVisible = true;
            },
            changePwd(data){
                const t=this;
                if(data.oldPassword==data.newPassword){
                    t.$message.error("新密码不能和原始密码相同！");
                    return;
                }
                if(data.newPassword!=data.newPassword2){
                    t.$message.error("两次新密码不相同！");
                    return;
                }
                _TY_Tool.post(_TY_ContentPath+"/ty-change-pwd", {
                    userName:data.userName,
                    password:data.oldPassword,
                    newPassword:data.newPassword
                }).then(function (response) {
                    let dataMap = response['data'];
                    if (dataMap['ok']) {
                        t.$message.success("修改成功");
                        t.dialogVisible = true;
                    }else{
                        t.$message.error(dataMap['message']);
                    }
                }).catch(function (error) {
                    t.$message.error(error.message);
                });
            }
        }
    }
</script>

<style scoped>

    .el-row {
        margin-bottom: 20px;

    &
    :last-child {
        margin-bottom: 0;
    }

    }

    .login-box {
        position: relative;
        top: 200px;
    }

    .login-title{
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        color: #409EFF;
    }

    .changePwd{
        font-size: 14px;
        color: #409EFF;
        cursor: pointer;
    }
</style>