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
                fieldsBanner:{
                    title:'',
                    url:"http://" + document.location.host + "/#" + window._TY_Home,
                    // icon:'ty-icon_M_b ty-font',
                    img:"",
                    class:'wy-banner-left wy-banner-lg'
                },
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
                this.updateMenu();
            },
            //更新菜单
            updateMenu:function(_init){
                let t=this;
                const newArr = t.fieldsReady;
                if(!newArr){
                    return;
                }
                // newArr[0].icon = newArr[0].icon == "ty-icon_M ty-font"?"ty-icon_M_b ty-font":"ty-icon_M ty-font";
                // newArr[0].img = newArr[0].img == "ty-icon_M ty-font"?"ty-icon_M_b ty-font":"ty-icon_M ty-font";
                if(_init){
                    //初始化
                    newArr[0].icon = '';
                    newArr[0].img = t.userInfo&&t.userInfo['logo'];
                }else{
                    if(newArr[0].icon&&newArr[0].icon=="ty-icon_M ty-font"){
                        newArr[0].icon = '';
                        newArr[0].img = t.userInfo&&t.userInfo['logo'];
                    }else{
                        newArr[0].icon = "ty-icon_M ty-font";
                        newArr[0].img = '';
                    }   
                }
                newArr[0].class = newArr[0].class == "wy-banner-left wy-banner-xs"?"wy-banner-left wy-banner-lg":"wy-banner-left wy-banner-xs";
                t.$set(t.fieldsReady,newArr);
                t.setMinHeight();
            },
            getValue:function(){
            },
            getUserInfo:function(){
                const t = this;
                let userInfo = sessionStorage.getItem("userInfo");
                if(userInfo){
                    let data =JSON.parse(userInfo);
                    t.userInfo = data;
                    t.userName = data.user_name;
                    setTimeout(()=>{
                        t.updateMenu(true);
                    },1000);
                }else{
                    var sessionAPI = _TY_ENV.name=='local'?"/read-session-user-info":"/ty-read-session-user-info";
                    if(t.$route.fullPath.indexOf('b_index')>=0){
                        //b端登录进来的 获取b端登录session
                        sessionAPI = "/ty-read-session-b-user-info"
                    }
                    _TY_Tool.get(_TY_ContentPath+sessionAPI).then(function (response) {
                        let data = response['data']['data'];
                        t.userInfo={};
                        t.userInfo['user_id']=data.id;
                        t.userInfo['user_name']=data.name||data.xingMing||'';
                        t.userInfo['market_id']=data.marketId||'';
                        t.userInfo['market_name']=data.marketDesc||'';
                        t.userInfo['logo']=data.logo||'';
                        t.userInfo['tenantSerialNumber']=data.tenantSerialNumber||'';
                        t.userInfo['supplierCommpanySerialNumber'] = data.supplierCommpanySerialNumber||'';
                        t.userName = data.name
                        sessionStorage.setItem('userInfo', JSON.stringify(t.userInfo));
                        t.updateMenu(true);
                    }).catch(function (error) {
                    });
                }
            },
            getResources(){
                const t=this;
                // var url = _TY_ENV.name=='local'?
                //     ("/ty/resources/"+t.$route.params.appAlias)
                //     :(_TY_ContentPath+"/load_app_resources?appAlias="+t.$route.params.appAlias);
                var url = _TY_ContentPath+"/load_app_resources?appAlias="+t.$route.params.appAlias;
                //b端登录
                if(t.$route.fullPath.indexOf('b_index')>=0 && _TY_ENV.name!='local'){
                    url = _TY_ContentPath+"/load_bapp_resources?appAlias="+t.$route.params.appAlias
                }

                _TY_Tool.get(url).then(function (response) {
                    // console.log(response);
                    // return;
                    let data = response['data'];
                    if (data['ok']) {
                        let pages = data.data.pages || data.data.pages2;
                        pages = pages || {};
                        if(pages['list']){
                            pages = pages['list'];
                        }

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
                _TY_Tool.post("/config/logout").then(function (response) {
                    //清除cookie
                    sessionStorage.removeItem('userInfo');
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
                t.wyPageContainer = 'wy-content-height';
            },
            menuClick:function(){
                this.setStyle();
            },
            setMinHeight:function(){
                this.contentHeight = window.screen.availHeight - 50 - 65 + 'px';
                this.menuBackgroundHeight = window.screen.availHeight - 65 + 'px';
                this.menuBackgroundWidth = this.collapse?'64px':'160px';
            }
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
        background-color:#006ebd;
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
    .wy-menu-container{
        height: 100vh;
        overflow-y: auto;
    }
</style>












