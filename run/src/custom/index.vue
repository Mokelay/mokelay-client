<template>
    <div class="wy">
        <el-row type='flex' class="content-box wy-container" justify="center">
                    <el-col class="wy-container-left">
                        <div class="wy-bannerBg" id="wy-dialog"></div>
                        <div class="wy-menu-container" :style="{width:menuBackgroundWidth}">
                            <bb-menu ref="leftMenu" :fields="fieldsReady" :collapse="collapse" :horizontal="horizontal" class="el-menu-vertical wy-menu" @click="menuClick" :defaultOpeneds="defaultOpeneds"></bb-menu>
                        </div>
                    </el-col>
                    <el-col id="wy-container-right" class="wy-container-right wy-container-height">
                        <div>
                            <div class='wy-banner'>
                                <el-button type="text" :icon="toggleMenuIcon" @click="toggleMenu" class="wy-toggleMenu" v-show="bannerButtonShow"></el-button>
                                <el-dropdown @command="handleCommand" class="wy-logout" trigger="click">
                                    <span class="dropdown-link">
                                        {{userName}}<i class="el-icon-caret-bottom el-icon-right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <transition name="fade">
                                <div id="ty-content" class="wy-content">
                                    <router-view :key="key" :class="wyPageContainer"></router-view>
                                    <div class="wy-bottom">
                                        <p>如果您在使用系统过程中有任何帮助需要，请联系IT服务台  热线电话: 400-9200-555  服务邮箱: helpdesk@chinaredstar.com</p>
                                        <p>© Copyright 2017 by China Redstar Co, Ltd . All right reserved</p>
                                    </div>
                                </div>
                                
                            </transition>
                        </div>
                    </el-col>
        </el-row>
    </div>
</template>



<script>
    export default {
        name: 'ty_index',
        components: {},
        props: {},
        data() {
            return {
                fields:[],
                fieldsBanner:{title:'',url:"http://" + document.location.host + "/#/home",icon:'ty-icon_M_b ty-font',class:'wy-banner-left wy-banner-lg'},

//                fieldsIndex:{title:'首页',url:'/wy/wy-index',icon:'icon_home wy-font'},
//                fieldsInspectionTPList:{title:'巡检表单管理',url:'/wy/wy-inspectionTPList',icon:'icon_biaodan1 wy-font'},
//                fieldsInspectionList:{title:'巡检管理',url:'inspectionListHome',icon:'icon_xunjian wy-font',children:[
//                        {title:'点位管理',url:'/wy/wy-inspectionList',icon:''},
//                        {title:'任务分配',url:'/wy/wy-taskManage',icon:'',value:false},
//                        {title:'人员排期',url:'/wy/wy-schedule',icon:''},
//                        {title:'转单/报修',url:'/wy/wy-transferOrRepair',icon:'',value:false},
//                        {title:'岗位交接',url:'/wy/wy-jobHandover',icon:''}
//                    ]},
//                fieldsPermissionManage:{title:'基础配置',url:'permissionManageHome',icon:'icon_shezhi1 wy-font',children:[
//                        {title:'员工授权',url:'/wy/wy-employeeEmpowerment',icon:''},
//                        {title:'设置一责',url:'/wy/wy-addAdmin',icon:''}
//                    ]},
//                fieldsFeedback:{title:'帮助中心',url:'feedbackHome',icon:'icon_bangzhu1 wy-font',children:[
//                        {title:'帮助手册',url:'/wy/wy-help',icon:''},
//                        {title:'意见反馈',url:'/wy/wy-feedback',icon:''}
//                    ]},
                horizontal:'vertical',
                collapse:false,
                userName:null,
                userInfo:null,
                buttonClass:'ty-icon_tuichu ty-font',
                colLeft:4,
                colRight:20,
                fieldsReady:null,
                toggleMenuIcon:"ty-icon_libiao ty-font",
                wyPageContainer:null,
                contentHeight:null,
                menuBackgroundHeight:null,
                menuBackgroundWidth:'160px',
                bannerButtonShow:true,
                defaultOpeneds:[],
                parentPath:'',
                buzz:'',
                buzzExcuteOnlyOne:false
            }
        },
        watch: {},
        computed: {
            key() {
                return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
            }
        },
        beforeCreate: function () {
        },
        created: function () {
            this.getUserInfo();
//            this.setPermission();
            this.getResources();
            this.setStyle();
            this.setMinHeight();
        },
        updated:function(){
            const t=this;
            if(!t.buzzExcuteOnlyOne){
                //执行过了
                t.buzzExcuteOnlyOne=true;
                //菜单方法  menu.buildBadge(key,val,clickHide)   需要 parentPath
                let menu = t.$refs['leftMenu'];
                try{
                    eval(t.buzz);
                }catch(err){
                    console.log(err);
                }
            }

        },
        methods: {
            handleOpen(key, keyPath) {
            },
            handleClose(key, keyPath) {
            },
            goto(url){
                this.$router.push(url);
            },
            toggleMenu:function(){
                this.collapse = !this.collapse;
                this.buttonClass = this.collapse?'ty-icon_shezhi ty-font':'ty-icon_tuichu ty-font';
                this.colLeft = this.colLeft == 4?2:4;
                this.colRight = this.colRight == 20?22:20;
                const newArr = this.fieldsReady;
                newArr[0].icon = newArr[0].icon == "ty-icon_M ty-font"?"ty-icon_M_b ty-font":"ty-icon_M ty-font";
                newArr[0].class = newArr[0].class == "wy-banner-left wy-banner-xs"?"wy-banner-left wy-banner-lg":"wy-banner-left wy-banner-xs";
                this.$set(this.fieldsReady,newArr);
                this.setMinHeight();
            },
            getValue:function(){
            },
            getUserInfo:function(){
                const t = this;
                let userInfo = localStorage.getItem("userInfo");
                if(userInfo){
                    let data =JSON.parse(userInfo);
                    t.userInfo = data;
                    t.userName = data.user_name;
                }
            },
            getResources(){
                const t=this;
                _TY_Tool.get("/ty/resources/"+t.$route.params.appAlias).then(function (response) {
                    let data = response['data'];
                    if (data['ok']) {
                        let pages = data.data.pages;
                        t.fieldsReady=[];

                        t.fieldsReady.splice(0,0,t.fieldsBanner);
//                        pages.forEach(function(item,index){
//                            let menu={};
//                            menu.title = item.name;
//                            menu.url = parentPath+"/"+item.alias;
//                            menu.icon="icon_home wy-font";
//                            t.fieldsReady.splice(index+1,0,menu);
//                        });
                        let menus = t.buildTreeMenu(t,pages,0);
                        menus.forEach(function(item,index){
                            t.fieldsReady.splice(index+1,0,item);
                        });

                        //填充菜单结束，设置badge
                        if(data.data.buzz){
                            t.buzz = data.data.buzz;

                        }
                    } else {
                        t.$message.error(data.message);
                    }
                },function(err){
                })
            },
            buildTreeMenu(self,pages,parentId){
                const t=self||this;
                let result =[];
                t.parentPath = t.$route.matched[0].path.replace(":appAlias",t.$route.params.appAlias);
                for(let i=0;i<pages.length;i++){
                    let page = pages[i];
                    if(page.type=='sub'){
                        continue;
                    }
                    let item = {};
                    item.title = page.name;
                    if(page.type=='category'){
                        item.url=page.alias;//key要唯一
                        if(!t.defaultOpeneds.includes(page.alias)){
                            t.defaultOpeneds.push(page.alias);
                        }
                    }else{
                        item.url = t.parentPath+"/"+page.alias;
                    }
                    if(page.icon){
                        item.icon=page.icon+" ty-font";
                    }
                    if(page.parentId==parentId){
                        let childs = t.buildTreeMenu(t,pages,page.id);
                        if(childs&&childs.length>0){
                            item.children=childs;
                        }
                        result.push(item);
                    }
                }
                return result;
            },
            logout:function() {
                _TY_Tool.get("/wy/user/logout").then(function (response) {
                    //清除cookie
                    localStorage.removeItem('userInfo');
                    window.location.reload()
                },function(err){
                    window.location.reload()
                }) 
            },
            handleCommand:function(command){
                const t = this;
                if(command == 'logout'){
                    t.logout();
                }
            },
            setStyle:function(){
                const t = this;
                if(window.location.href.indexOf('wy-index') == -1){
                    t.wyPageContainer = 'wy-content-height'
                }else{
                    t.wyPageContainer = 'wyIndexBackground wy-content-height'
                }
            },
            menuClick:function(){
                this.setStyle();
            },
            setMinHeight:function(){
                this.contentHeight = window.screen.availHeight - 50 - 65 + 'px';
                this.menuBackgroundHeight = window.screen.availHeight - 65 + 'px';
                this.menuBackgroundWidth = this.collapse?'64px':'160px';
            },
//            setPermission:function(newArr,key){//权限配置
//                const t = this;
//                let userInfo = sessionStorage.getItem('userInfo');
//                userInfo = JSON.parse(userInfo);
//                userInfo.user_type = '3'
//                const user_type = userInfo.user_type;
//                t.fieldsReady = [];
//                let newfieldsPermissionManage = t.fieldsPermissionManage;
//                switch(user_type){
//                    case '1':
//                        t.$msgbox({
//                            title: '提示',
//                            type:'warning',
//                            message: '您没有权限访问物业管理信息系统',
//                            confirmButtonText: '确定',
//                        })
//                        t.fieldsReady.push(t.fieldsBanner,t.fieldsIndex);
//                        break;
//                    case '2':
//                        t.defaultOpeneds.push('inspectionListHome');
//                        t.fieldsReady.push(t.fieldsBanner,t.fieldsIndex,t.fieldsInspectionList);
//                        break;
//                    case '3':
//                        t.defaultOpeneds.push('inspectionListHome','permissionManageHome');
//                        newfieldsPermissionManage.children.splice(1,1);
//                        t.fieldsReady.push(t.fieldsBanner,t.fieldsIndex,t.fieldsInspectionTPList,t.fieldsInspectionList,newfieldsPermissionManage);
//                        break;
//                    case '4':
//                        t.defaultOpeneds.push('permissionManageHome','feedbackHome');
//                        newfieldsPermissionManage.children.splice(0,1);
//                        t.fieldsReady.push(t.fieldsBanner,t.fieldsIndex,newfieldsPermissionManage,t.fieldsFeedback);
//                        break;
//                    case '5':
//                        t.defaultOpeneds.push('feedbackHome');
//                        t.fieldsReady.push(t.fieldsBanner,t.fieldsIndex,t.fieldsInspectionTPList,t.fieldsFeedback);
//                        break;
//                }
//            }
        }
    }
</script>

<style lang="less">
    .wy{
        font-family: 'PingFangSC-Regular','微软雅黑',Helvetica,arial !important;
        overflow-x: hidden;
        width: 100%;
    }
    .ty-font {
       font-family: "iconfont" !important;
    }
    .iconfont {
       font-family: "iconfont" !important;
    }
    .content-box {
        margin-right: 0 !important;
    }
    .wy .wy-bannerBg{
        background-color: #0091EA;
        height: 50px;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .wy .wy-container-left{
        display: flex;
        width: auto;
        max-width: 100%;
        height: 100vh;
    }
    .wy .wy-container-right{
        position: relative;
        min-width: 1px;
    }
    .wy .wy-container-height{
        height: 100vh;
    }
    .wy .wy-toggleMenu{
        font-size: 25px;
        line-height: 30px;
        color: #fff;
        margin-left: 20px;
        &:hover{
            color:#fff;
        }
        &:focus{
            color:#fff;
        }
    }
    .wy .top {
        width: 100%;
        height: 80px;
        background: rgba(242, 242, 242, 1);
    }
    .wy .el-menu-vertical:not(.el-menu--collapse) {
        width: 100%;
      }
    .wy .el-submenu .el-menu-item{
        min-width:auto;
    }
    .wy .wy-banner{
        background-color: #0091EA;
        height: 50px;
    }
    .wy .wy-banner-left {
        background-repeat: no-repeat;
        background-size: 60%;
        background-color: #0181D0;
        background-position: center;
        width: 100%;
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        &:hover{
            background-color: #0181D0 !important;
        }
        i{
            color: #fff !important;
            font-size: 30px !important;
        }
        .ty-icon_M{
            font-size: 24px !important;
        }
    }
    .wy .wy-logout{
        float: right;
        margin-right: 20px;
    }
    .wy .wy-banner-xs{
        font-size: 22px;
        line-height: 42px;
    }
    .wy .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .wy .wy-menu{
        height: 100%;
        border: none;
        .el-menu-item-group__title{
          display: none
        }
    }
    .wy .wy-container{
        display: flex;
    }
    .wy .userInfo{
        height: 50px;
        width: 100%;
        background-color: #0091EA;
        color: #fff;
    }
    .wy .dropdown-link{
        color:#ffffff;
        line-height: 50px;
    }
    .wy .wy-content{
        height: ~'calc(100vh - 50px)';
        overflow-y: auto;
        overflow-x: hidden;
    }
    .wy #ty-content{
        padding:10px;
    }
    .wy .wy-bottom{
        font-size: 12px;
        color: #999999;
        border-top: 1px solid #E4E4E4;
        height: 65px;
        text-align: right;
        padding:20px; 
        line-height: 14px;
        margin-left: -10px;
        margin-right: -10px;
    }
    .wy .wy-content-height{
        min-height: ~'calc(100vh - 135px)';
    }
    .wy .wyIndexBackground{
        background-image: url('./img/indexBackground.png');
        background-repeat: no-repeat;
        background-size: auto;
        background-position: 100% 100%;
        width: 100%;
        margin-bottom: -19px;
        
    }
</style>












