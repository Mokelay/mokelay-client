<template>
    <div>
        <el-button-group v-if="groupConfig.type == 'group'">
            <bb-button v-for="(button,index) in realButtons" @button-finish="buttonFinsih" :key="index" :button="button" @click="click"></bb-button>
        </el-button-group>
        <div v-if="groupConfig.type == 'normal' || !groupConfig.type">
            <span v-for="(button,index) in realButtons" :key="index" class="button" :style="groupConfig.customStyle">
                <bb-button :key="index" :button="button" @button-finish="buttonFinsih" @click="click"></bb-button>
                <i v-if="button.iconName" :class="button.iconName" @click='remove(button,index)'></i>
                <bb-badge v-if="button.badgeDs" :textDs="button.badgeDs" class="icon"  @click='iconClick(button,index)'></bb-badge>
            </span>
        </div>
    </div>
</template>

<script>
    import Util from '../../libs/util';
    export default {
        name: 'bb-button-group',
        props: {
            /* groupConfig按钮组设置
            {
                type:'group 并联 || normal 有间隔'  //按钮组样式
                customStyle:'' 用户自定义按钮组样式
            }
            */
            groupConfig:{
                type:Object,
                default:function(){
                    return {
                        type:'normal',
                        customStyle:''
                    };
                }
            },
            /* 按钮组配置
                [{
                    action:'url 地址跳转|| execute-ds执行接口 || dialog-page弹窗 || code自定义代码 || buzz 巴斯代码',
                    url:''跳转地址 action:'url’时有效
                    urlType:'openWindow 在新标签中打开 
                    ds:{} //按钮请求的接口配置 action:'execute-ds’时有效
                    confirmTitle:'', //请求接口前的提示语标题   action:'execute-ds’时有效
                    confirmText:'', //请求接口前的提示语内容   action:'execute-ds’时有效
                    callBackStaticWords:'' //请求接口成功提示语
                    dialogPage:'pageAlias',//弹窗中的页面名称   action:'dialog-page’时有效
                    method:fn , //需要执行的方法 action:'code’时有效
                    buzz:'buzzName'  //巴斯方法名称  action:'buzz’时有效
                    iconName:''  //按钮角标
                    badgeDs:{//按钮小红点数据源
                        api:"/list-data",
                        category:'config',//ds选择器 不是type字段而是category字段
                        method:"post",
                        inputs:[],
                        outputs:[]
                    }
                }]
            */
            buttons:{
                type: Array,
                default:function(){
                    return null
                }
            },
            //button item数据获取，有多少个item
            buttonDs:{
                type:Object,
                default:function(){
                    return null;
                }
            }
        },
        data() {
            return {
                realButtons:this.buttons,
                realButtonDs:this.buttonDs,
                external:{}
            }
        },
        watch: {
            buttons(val){
                this.realButtons = val;
            },
            buttonDs(val){
                this.realButtonDs = val;
                this.loadData();
            }
        },
        created: function () {
            this.loadData();
        },
        mounted:function(){
        },
        methods: {
            loadData:function(){
                let t=this;
                if(t.realButtonDs){
                     _TY_Tool.getDSData(t.realButtonDs, _TY_Tool.buildTplParams(t), function (map) {
                        t.realButtons = map[0].value;
                    }, function (code, msg) {
                    });
                }
            },
             //外部传参调用
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.loadData();
                }
            },
            click:function(button){
                this.$emit('click',button);
            },
            //图标点击
            iconClick:function(button,index){
                let t=this;
                 t.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    t.$emit('iconClick',button,index);
                    t.realButtons.splice(index,1);
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //移除按钮
            remove:function(button,index){
                const t = this;
                t.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    t.$emit('remove',button,index);
                    t.realButtons.splice(index, 1);
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            buttonFinsih:function(...params){
                this.$emit("button-finish",params);
            }
        }
    }
</script>
<style lang='less'>
    .button{
        display: inline-block;
        margin-right: 5px;
        padding-top:10px;
        i{
            position: relative;
            top: -10px;
            right:5px;
            float: right;
            cursor:pointer;
            opacity:0.5;
            &:hover{
                opacity:0.8;
                animation:jello 1s;
            }
        }
        .icon{
            top: -10px;
            right:5px;
            cursor:pointer;
        }
    }
    
</style>