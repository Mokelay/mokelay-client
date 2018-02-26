<template>
    <div class="bb-container">
        <!-- 上下布局 -->
        <el-container v-if="realLayout == 'layout1'">
            <el-header>
                <bb-read-bb :fields="realHeader"></bb-read-bb>
            </el-header>
            <el-main>
                <bb-read-bb :fields="realMain"></bb-read-bb>
            </el-main>
        </el-container>
        <!-- 上中下布局 -->
        <el-container v-if="realLayout == 'layout2'">
            <el-header>Header</el-header>
            <el-main>Main</el-main>
            <el-footer>Footer</el-footer>
        </el-container>
        <!-- 左右布局 -->
        <el-container v-if="realLayout == 'layout3'">
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
        </el-container>
        <!-- 上下左右布局 -->
        <el-container v-if="realLayout == 'layout4'">
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
        <!-- 上下左右上下布局 -->
        <el-container v-if="realLayout == 'layout5'">
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-container>
                    <el-main>Main</el-main>
                    <el-footer>Footer</el-footer>
                </el-container>
            </el-container>
        </el-container>
        <!-- 左右上下布局 -->
        <el-container v-if="realLayout == 'layout6'">
            <el-aside width="200px">Aside</el-aside>
            <el-container>
                <el-header>Header</el-header>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
        <!-- 左右上中下布局 -->
        <el-container v-if="realLayout == 'layout7'">
            <el-aside width="200px">Aside</el-aside>
            <el-container>
                <el-header>Header</el-header>
                <el-main>Main</el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
        <!-- 上下左中右布局 -->
        <el-container v-if="realLayout == 'layout8'">
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="200px">leftAside</el-aside>
                <el-main>
                    <bb-read-bb :fields="realMain.content"></bb-read-bb>
                </el-main>
                <el-aside width="200px">rightAside</el-aside>
            </el-container>
        </el-container>
    </div> 
</template>
<script>
    export default {
        name: 'bb-container',
        props: {
            /*
                layout 布局样式配置
                //通过bb-portal-item-list 图文入口 展示选项
                layout1:'上下布局',
                layout2:'上中下布局',
                layout3:'左右布局',
                layout4:'上下左右布局',
                layout5:'上下左右上下布局',
                layout6:'左右上下布局',
                layout7:'左右上中下布局'                
                layout8:'上下左中右布局'                
            */
            layout:{
                type:String,
                default:'layout8'
            },
            /*
                header leftAside rightAside main footer 头部积木静态数据配置
                {
                    content:[{uuid:'',alias:'',aliasName:'',attributes:{},layout:""}],
                    interactives:[{uuid:'',fromContentUUID:'',fromContentEvent:'',executeContentUUID:'',executeContentMethodName:''}]
                }
            */
            header:{
                type:Object
            },
            /*
                leftAside 侧边栏积木配置
            */
            leftAside:{
                type:Object
            },
            /*
                rightAside 侧边栏积木配置
            */
            rightAside:{
                type:Object
            },
            /*
                main 头部积木配置
            */
            main:{
                type:Object,
                default:function(){
                    return {
                        content:[{uuid:'1234',alias:'bb-input',aliasName:'',attributes:{},layout:""}],
                        interactives:[{uuid:'',fromContentUUID:'',fromContentEvent:'',executeContentUUID:'',executeContentMethodName:''}]
                    }
                }
            },
            /*
                footer 底部积木配置
            */
            footer:{
                type:Object
            },
            /*
                containerDs 动态数据源配置 
                返回数据包含 header leftAside rightAside      
            */
            containerDs:{
                type:Object
            }
        },
        data() {
            return {
                realLayout:this.layout,
                realHeader:this.header,
                realLeftAside:this.leftAside,
                realRightAside:this.rightAside,
                realMain:this.main,
                realFooter:this.footer
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
            const t = this;
            t.getData();
        },
        methods: {
            //在支持静态和动态数据混合渲染
            //获取动态数据
            getData:function(){
                const t = this;
                if (t.containerDs) {
                    _TY_Tool.getDSData(t.containerDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realFields = t.realFields.concat(val.value);
                            t.setRealFields();
                        })
                    }, function (code, msg) {
                    });
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    .bb-container > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>