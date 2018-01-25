<template>
    <el-dropdown class="bb-dropdown" @command="handleCommand" @visible-change="visibleChange" :size="realBasicConfig.size" >
        <div class="content" :style="{color:realBasicConfig.color,height:realBasicConfig.height}">
            <span v-if="realBasicConfig.title">{{realBasicConfig.title}}</span>
            <i v-else-if="realBasicConfig.icon" :class="realBasicConfig.icon"></i>
            <img class="photo" v-else-if="realBasicConfig.imgSrc" :src="realBasicConfig.imgSrc" alt="">
            <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(field,key) in realFields" 
                    :command="field.button" 
                    :disabled="field.disabled" 
                    :divided="field.divided" >
                <bb-button :button="field.button"></bb-button>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    export default {
        name: 'bb-dropdown',
        props: {
            /*
                basicConfig 下拉菜单基础配置
                {
                    title:'',  //菜单标题  标题 图片 图标 互斥只能显示一个
                    imgSrc:'',  //菜单图片
                    icon:'',    // 菜单图标
                    color:'#ffffff', //标题颜色  
                    size:'small  //下拉菜单整体大小设置
                    height:50px   //下拉菜单高度  显示图片时必填
                }
            */
            basicConfig:{
                type:Object,
                default:function(){
                    return {
                        title:'',
                        color:'#ffffff',
                        size:'small',
                        height:'50px'
                    }
                }
            },
            //动态数据源 基础配置 获取头像图标 用户名称等
            basicConfigDs:{
                type:Object
            },
            /*
                fields 静态数据源 下拉选项数据
                [{
                    disabled:false,  //禁用
                    divided:false, //分割线
                    button:{   //选择按钮配置
                        action: url || execute-ds || dialog-page || code || buzz
                        url:''  //action: url 
                        urlType:'default' || 'openWindow'
                        ds:{}  //action: execute-ds
                        dialogPage:'' //action: dialog-page
                        method:fn //action: code
                        buzz:'' //action: buzz
                    }
                }]
            */
            fields:{
                type:Array
            },
            //动态数据源 下拉选项数据
            fieldsDs:{
                type:Object
            }
        },
        data() {
            return {
                realBasicConfig:this.basicConfig,
                realFields:this.fields
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
            const t = this;
            t.getBasicConfig();
            t.getFields();
        },
        methods: {
            //事件  visibleChange 下拉菜单显示隐藏事件   item-click  选项点击    
            handleCommand:function(command) {
                const t = this;
                t.$emit('item-click',command)
            },
            visibleChange:function(params){
                const t = this;
                t.$emit('visible-change',params)
            },
            getBasicConfig: function () {
                const t = this;
                if (t.basicConfigDs) {
                    _TY_Tool.getDSData(t.basicConfigDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realBasicConfig = val.value;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            getFields: function () {
                const t = this;
                if (t.fieldsDs) {
                    _TY_Tool.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realFields = val.value;
                        })
                    }, function (code, msg) {
                    });
                }
            },
        }
    }
</script>
<style lang='less' scoped>
    .bb-dropdown{
        border:none;
        .content{
            cursor: pointer;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            position: relative;
            height: 100%;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between
        }
        .photo{
            width: 36px;
            height: auto;
            max-height: 36px;
            display: inline-block;
            border-radius: 50%;

        }
    }
</style>