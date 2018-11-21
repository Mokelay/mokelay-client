<template>
    <div class="login-box">
        <el-row type="flex" justify="center">
            <el-col class="title">
                <h1 class="login-title">{{title}}</h1>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col class="bb-username">
                <el-input v-model="formData.username" placeholder="请输入帐号">
                    <template slot="prepend">帐号</template>
                </el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col class="bb-password">
                <el-input v-model="formData.password" type="password" placeholder="请输入密码">
                    <template slot="prepend">密码</template>
                </el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col class="bb-login">
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

    import Vue from 'vue';
    import {
            Row,
            Col,
            Input,
            Button
    } from 'element-ui'
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);
    Vue.use(Button);

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
                _TY_Tool.post(_TY_ContentPath+"/ty-login", {
                    userName:t.formData.username,
                    password:t.formData.password
                }).then(function (response) {
                    let dataMap = response['data'];
                    if (dataMap['ok']) {
                        const redirect = t.$route.query.redirect;
                        if(redirect){
                            location.href=redirect;
                        }else{
                            t.$router.push(window._TY_Home);    
                        }
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
    
    .bb-username{
        width: 33.3333%;
        min-width: 200px;
    }
    .bb-password{
        width: 33.3333%;
        min-width: 200px;
    }
    .bb-login{
        width: 33.3333%;
        min-width: 200px;
    }

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