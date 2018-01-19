<template>
    <div class="wy">
        <div class="wy-bannerBg"></div>
        <el-row :gutter="15" type='flex' class="content-box" justify="center">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="wyIndexBackground"></div>
                <el-row class='wy-container '>
                    <el-col class='wy-page-body '>
                        <el-row class='wy-banner' type='right' justify="left">
                            <el-col :xs="6" :sm="4" :md="4" :lg="4" class="leftMenu">
                                <div class="wy-banner-left wy-banner-lg logo">
                                    <i v-if="gb" class="ty-icon_home ty-font"></i>
                                    <i v-else class="ty-icon_M_b ty-font"></i>
                                </div>
                            </el-col>
                            <el-col :xs="4" :sm="2" :md="2" :lg="2" class="rightMenu">
                                <el-dropdown @command="handleCommand">
                                    <span class="dropdown-link">
                                        {{userName}}<i class="el-icon-caret-bottom el-icon-right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-col>
                        </el-row>
                        <transition name="fade">
                            <div class="cardBox">
                                <section class="cardItem" v-for="(app, index) in apps" :key="index">
                                    <a target="_blank" :href="app.entrance?'#'+app.entrance:'#/'+app.alias+'/index'">
                                        <div>
                                            <img :src="app.icon">
                                        </div>
                                        <h5>
                                            <span>{{app.name}}</span>
                                        </h5>
                                    </a>
                                </section>
                            </div>
                        </transition>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div class="wy-bottom" v-if="gb">
            <p>如果您在使用系统过程中有任何帮助需要，请联系greatBee 热线电话: 400-1234-567 服务邮箱: help@greatbee.com</p>
            <p>© Copyright 2017 by China Greatbee Co, Ltd . All right reserved</p>
        </div>
        <div class="wy-bottom" v-else>
            <p>如果您在使用系统过程中有任何帮助需要，请联系IT服务台 热线电话: 400-9200-555 服务邮箱: helpdesk@chinaredstar.com</p>
            <p>© Copyright 2017 by China Redstar Co, Ltd . All right reserved</p>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'home',
        components: {},
        props: {},
        data() {
            return {
                collapse: false,
                userName: null,
                userInfo: null,
                apps:[],
                buttonClass: 'ty-icon_tuichu ty-font',
                colLeft: 4,
                colRight: 20,
            };
        },
        watch: {},
        computed: {
            gb(){
                // return true;
                return _TY_ENV.name=='gb';
            }
        },
        beforeCreate: function () {
        },
        created: function () {
            this.getUserInfo();
            this.getOpenApps();
        },
        mounted: function () {
        },
        beforeDestroy() {

        },
        methods: {
            goto(url){
                this.$router.push(url);
            },
            getUserInfo: function () {
                const t = this;
                _TY_Tool.get(t.gb?_TY_ContentPath+"/ty-read-session-user-info":_TY_ContentPath+"/read-session-user-info").then(function (response) {
                    let data = response['data']['data'];
                    t.userInfo={};
                    t.userInfo['user_id']=data.id;
                    t.userInfo['user_name']=data.name;
                    t.userInfo['market_id']=data.marketId;
                    t.userInfo['market_name']=data.marketDesc;
                    t.userName = data.name
                    localStorage.setItem('userInfo', JSON.stringify(t.userInfo));
                }).catch(function (error) {
                });
            },
            getOpenApps(){
                const t=this;
                _TY_Tool.get("/ty/openApps").then(function (response) {
                    let data = response['data']['data'];
                    t.apps = data.apps;
                    t.getIcon();
                }).catch(function (error) {
                });
            },
            logout: function () {
                const t=this;
                _TY_Tool.get(t.gb?"/ty/logout":"/wy/user/logout").then(function (response) {
                    //清除cookie
                    localStorage.removeItem('userInfo');
                    window.location.reload()
                }, function (err) {
                    window.location.reload()
                })
            },
            handleCommand: function (command) {
                const t = this;
                if (command == 'logout') {
                    t.logout();
                }
            },
            //通过页面的alias 获取图片的url
            getIcon:function(){
                const t = this;
                const defaultIcon = require("./img/app-icon/app_.png");
                t.apps.forEach((val,key)=>{
                    try{
                        val.icon = require("./img/app-icon/" + val.alias + ".png")
                    }
                    catch(e){
                        val.icon = defaultIcon;
                    }
                })
            }

        }
    }
</script>

<style  lang="less" scoped>
    .ty-font {
        font-family: "iconfont" !important;
    }

    .content-box {
        margin-right: 0 !important;
    }

    .wy .wy-bannerBg {
        background-color: #0091EA;
        height: 50px;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .wy .wy-banner {
        background-color: #0091EA;
    }

    .wy .wy-banner-left {
        background-repeat: no-repeat;
        background-size: 60%;
        background-color: #0181D0;
        background-position: center;
        width: 100%;
        height: 50px;
        color: #fff !important;
        overflow: hidden;
    }

    .wy .wy-banner-lg {
        font-size: 34px;
        line-height: 42px;
    }

    .wy .wy-container {
        min-height: 638px;
        display: flex;
        width: 70%;
        margin: 0 auto;
    }

    .wy .dropdown-link {
        color: #ffffff;
        line-height: 50px;
    }

    .wy .wy-bottom {
        font-family: '.PingFangSC-Regular';
        font-size: 12px;
        color: #999999;
        border-top: 1px solid #E4E4E4;
        width: 100%;
        height: 65px;
        text-align: center;
        bottom: 0;
        padding-top: 20.5px;
        line-height: 14px;
    }

    .wy .wy-page-body {
        position: relative;
    }

    .wy .wyIndexBackground {
        background-image: url('img/indexBackground.png');
        background-repeat: no-repeat;
        background-size: auto;
        background-position: 100% 100%;
        position: absolute;
        width: 100%;
        padding-right: 20px;
        min-height: 100%;
        z-index: -1;
    }

    .wy .leftMenu {
        float: left;
    }

    .wy .rightMenu {
        float: right;
    }

    .wy .logo {
        text-align: center;
        line-height: 50px;
    }

    .wy .cardBox {
        display: flex;
        flex-flow: wrap;
        margin: 20px;
    }

    .wy .cardItem {
        margin: 15px;
        /*width: 19%;*/
        /*overflow: hidden;*/
    }

    .wy .cardItem a {
        display: block;
        width: 205px;
        overflow: hidden;
        color: #666;
        text-align: center;
        text-decoration: none;
        font-size: 140px;
    }

    .wy .cardItem a img {
        margin-top: 30px;
        width: 100px;
    }

    .wy .cardItem a h5 {
        line-height: 1em;
        font-size: 16px;
        font-weight: normal;
        text-align: center;
    }


</style>