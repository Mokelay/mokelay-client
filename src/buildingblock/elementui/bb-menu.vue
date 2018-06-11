<script>
    import Util from '../../libs/util.js';

    export default {
        name: 'bb-menu',
        render: function (createElement) {
            var t = this;
            if (t.shouldUpdate && t.items) {
                t.menuList = t.createMenu(createElement, t.items);
            }
            let menuExternalStyle = {};
            if(t.horizontal==='horizontal'){
                menuExternalStyle ={height:t.height};
            }
            if(t.p_collapse){
                menuExternalStyle['width']='';
            }else{
                delete menuExternalStyle['width'];
            }
            return createElement(
                    'el-menu',
                    {
                        props: {
                            mode: t.horizontal,
                            router: t.router,
                            'default-active': t.defaultActive,
                            'unique-opened': false,
                            collapse: t.p_collapse,
                            'default-openeds': t.p_defaultOpeneds,
                            'active-text-color':t.activeTextColor,
                            'text-color':t.textColor,
                            'background-color':t.backgroundColor
                        },
                        style:Object.assign({},t.bbStyle,menuExternalStyle)
                    },
                    t.menuList
            );
        },
        props: {
            fields: {
                type: Array,
                default: function () {
                    return []
                }
            },
            //vertical horizontal
            horizontal: {
                type: String,
                default: "horizontal"
            },
            childName: {
                type: String,
                default: 'children'
            },
            ds: {
                type: Object,
                default: function () {
                    return null
                }
            },
            titleField: {
                type: String,
                default: 'title'
            },
            urlField: {
                type: String,
                default: 'url'
            },
            collapse: {
                type: Boolean,
                default: false
            },
            defaultOpeneds: {
                type: Array,
                default: function () {
                    return null
                }
            },
            router: {
                type: Boolean,
                default: true
            },
            //菜单样式
            bbStyle:{
                type:[String,Object],
                default:function(){
                    return {};
                }
            },
            //菜单高度
            height:{
                type:String
            },
            //选中后的下拉颜色
            activeTextColor:{
                type:String
            },
            //文字颜色
            textColor:{
                type:String
            },
            //是否关闭item 的hover 背景色效果
            itemHoverBg:{
                type:String
            },
            //背景色
            backgroundColor:{
                type:String
            },
            //用于根据路由 判断 active
            urlLevel:{
                type:[Number,String]
            }
        },
        data() {
            return {
                p_collapse:this.collapse,//是否折叠
                p_defaultOpeneds:this.defaultOpeneds,
                items: this.fields,
                newMenu: true,
                menuList: [],
                shouldUpdate: true,
                defaultActive: null
            };
        },
        watch: {
            fields: {
                handler: function (val, oldVal) {
                    this.shouldUpdate = true;
                    this.items = val;
                },
                deep: true
            },
            collapse(val){
                this.p_collapse = val;
            }
        },
        computed: {
            p_urlLevel(){
                let _urlLevel = (typeof(this.urlLevel)==='string'?new Number(this.urlLevel):this.urlLevel);
                _urlLevel = typeof(_urlLevel)==='undefined'?-1:_urlLevel;
                return _urlLevel
            }
        },
        components: {},
        created: function () {
            const t=this;
            this.getData();
            const fullPath = this.$route.fullPath;
            
            let paths = fullPath.split("&");
            if(t.p_urlLevel>=0){
                this.defaultActive = paths.slice(0,t.p_urlLevel+1).join('&');
            }else{
                this.defaultActive = fullPath;
            }
        },
        mounted:function(){
            
        },
        methods: {
            closeOrOpenMenu:function(...args){
                let t=this;
                if(args&&args.length>0){
                    if(args[0]){
                        t.p_collapse = true;
                    }else{
                        t.p_collapse = false;
                    }
                }
            },
            getData: function () {
                var t = this;
                if (this.ds && this.ds.api) {
                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        var newArr = [];
                        map.forEach(function (item) {
                            var list = item['value']['list'];
                            for (var i in list) {
                                var ele = list[i];
                                let button = {
                                    title: ele[t.titleField],
                                    url: ele[t.urlField],
                                    icon:ele['icon'],
                                    children:ele['children']
                                }
                                newArr.push(button);
                            }
                        });
                        t.shouldUpdate = true;
                        t.items = newArr;
                        //展开父级菜单
                        t.openDefaultParentMenu();
                    }, function (code, msg) {
                    });
                }
            },
            //打开默认的菜单父级
            openDefaultParentMenu:function(){
                let t=this;
                if(t.defaultActive&&t.items){
                    let result = {};
                    t._openParentMenu(t,t.items,null,result);
                    if(result[t.defaultActive]){
                        t.p_defaultOpeneds = result[t.defaultActive];
                    }
                }
            },
            _openParentMenu:function(t,items,parentIndex,result){
                items.forEach((item,index)=>{
                    var menuIndex = item.url;
                    if(menuIndex.indexOf("&")>=0&&t.p_urlLevel>=0){
                        menuIndex = menuIndex.split("&").slice(0,t.p_urlLevel+1).join('&')
                    }
                    if(parentIndex){
                        result[menuIndex] = _TY_Tool.deepClone(result[parentIndex]);
                        result[menuIndex].push(menuIndex);
                    }else{
                        result[menuIndex] = [menuIndex];
                    }

                    if(menuIndex == t.defaultActive){
                        //找到了子页面 ,把菜单路径返回
                         return false;                       
                    }else{
                       if(item.children&&item.children.length>0){
                            t._openParentMenu(t,item.children,menuIndex,result);
                       } 
                    }
                });
            },
            createMenu: function (createElement, items) {
                var t = this;
                var newEle = '';
                var newArr = []
                items.forEach((item, key)=> {
                    if (item[t.childName] && item[t.childName].length > 0) {
                        newArr.push(t.createSubmenu(createElement, item));
                    } else {
                        newArr.push(t.createMenuItem(createElement, item));
                    }
                });
                t.shouldUpdate = false;
                return newArr
            },
            createMenuItem: function (createElement, item) {
                var t = this;
                var titleEle = createElement('span', {slot: "title"}, [item.title, createElement('bb-badge', {
                    props: {value: item.value},
                    ref: item['url'],
                    class: 'bb-menu-badge'
                }, [])]);
                var iconClass = item.icon;
                var templateChild = item.icon ? createElement('i', {class: iconClass}, []) : '';
                var img = item.img? createElement('img',{
                    style:{

                    },
                    attrs:{
                        src:item.img
                    }
                },[]):'';

                var menuIndex = item.url;
                if(menuIndex.indexOf("&")>=0&&t.p_urlLevel>=0){
                    menuIndex = menuIndex.split("&").slice(0,t.p_urlLevel+1).join('&')
                }
                return createElement('el-menu-item',
                        {
                            props: {index: menuIndex, key: item.url, route: {path: item.url}},
                            title: item.title,
                            class: item.class,
                            on: {
                                click: function () {
                                    t.$emit('click',item)
                                    if (item.value && item.clickHide) {
                                        t.$refs[item['url']].hide();
                                    }
                                    t.forwardThirdUrl(item.url);
                                },
                                mouseenter:function(){
                                    t.$emit('mouseenter',item)

                                }
                            },
                            style:{
                                height:t.height,
                                "line-height":t.height,
                                backgroud:(t.itemHoverBg?t.itemHoverBg:'')
                            }
                        },
                        [templateChild,img, titleEle]);
            },
            createSubmenu: function (createElement, item) {
                var t = this;
                var child = [];
                var iconClass = item.icon;
                var icon = item.icon ? createElement('i', {class: iconClass}, []) : '';
                var img = item.img? createElement('img',{
                    style:{
                    },
                    attrs:{
                        src:item.img
                    }
                },[]):'';
                var title = createElement('span', {slot: "title"}, [item.title]);
                var groupSpan = createElement('span', {slot: "title"}, [item.title, createElement('bb-badge', {
                    props: {value: item.value},
                    ref: item['url'],
                    class: 'bb-menu-badge'
                }, [])]);
                var menuIndex = item.url;
                if(menuIndex.indexOf("&")>=0&&t.p_urlLevel>=0){
                    menuIndex = menuIndex.split("&").slice(0,t.p_urlLevel+1).join('&')
                }
                return createElement(
                        'el-submenu',
                        {
                            props: {index: menuIndex, key: item.url, route: {path: item.url}}, on: {
                            click: function () {
                                t.$emit('click')
                                if (item.value && item.clickHide) {
                                    t.$refs[item['url']].hide();
                                }
                                t.forwardThirdUrl(item.url);
                            }
                        }
                        },
                        [createElement('template', {slot: "title"}, [icon,img, title, createElement('bb-badge', {
                            props: {value: item.value},
                            ref: item['url'],
                            class: 'bb-menu-badge'
                        }, [])]), createElement('el-menu-item-group', {}, [t.createMenu(createElement, item[t.childName])])]
                );
            },
            forwardThirdUrl:function(url){
                if(url.indexOf("http://")>=0){
                    location.href=url;
                }
            },
            //外部调用，app打开后菜单  执行巴斯代码，调用buildBadge
            buildBadge(key, val, clickHide){
                const t = this;
                //构建正确的items数据
                if (t.items && t.items.length > 0) {
                    t._buildBadge(t, t.items, key, val, clickHide);
                }
                //调用badge组件方法设置
                t.$refs[key].buildValue(val);
            },
            _buildBadge(t, items, key, val, clickHide){
                if (items && items.length > 0) {
                    items.forEach(function (item, index) {
                        if (item.url && item.url == key) {
                            item.value = val;
                            if (clickHide) {
                                item.clickHide = clickHide;
                            }
                        }
                        if (item && item[t.childName] && item[t.childName].length > 0) {
                            t._buildBadge(t,item[t.childName], key, val, clickHide);
                        }
                    });
                }
            }
        },
    }
</script>
<style scoped>
    .bb-menu-badge .el-badge__content {
        right: -5px !important;
    }
    .el-menu-item>i{
        color: inherit;
    }
    .el-menu-item.is-active{
        background:#fff;
        margin-right: -1px;
    }
    .el-menu .el-menu-item:first-child{
        /*border-top:1px solid #e4e4e4;*/
    }

    /*影藏滚动条*/
    .el-menu{
        overflow-x: inherit;
    }
    .el-menu::-webkit-scrollbar {
         display: none;
    }
    .el-submenu .el-menu-item{
        min-width: 180px;
    }
    
</style>

<style lang='less'>
    .el-menu .el-menu-item-group>.el-menu-item-group__title{
        padding:0;
    }
</style>

