<template>
    <div class="login-box">
        <el-row type="flex" justify="center">
            <el-col>
                <h1 class="login-title">{{title}}</h1>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="8">
                <el-input v-model="formData.username" placeholder="请输入帐号">
                    <template slot="prepend">帐号</template>
                </el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="8">
                <el-input v-model="formData.password" type="password" placeholder="请输入密码">
                    <template slot="prepend">密码</template>
                </el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="8">
                <el-button id="login" @click="login" style="width:100%" type="primary">登录</el-button>
            </el-col>
        </el-row>
        <!-- <el-row type="flex" justify="center">
            <el-col :span="8">
               <a class="changePwd" @click="changePwd">修改密码</a>
            </el-col>
        </el-row> -->
    </div>
</template>

<script>
    export default {
        name: 'ty-login',
        components: {},
        props: {
            //标题
           title:{
               type:String,
               default:'TY 登 录'
           }
        },
        data() {
            return {
                formData: {
                    username: '',
                    password: ''
                },
                dialogVisible:false
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
            changePwd(){
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