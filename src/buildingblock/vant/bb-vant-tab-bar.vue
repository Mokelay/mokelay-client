<template>
    <van-tabbar @change="onChange" v-model="active">
        <van-tabbar-item v-for="(field,key) in realFields"
            :icon="'ty ' + field.icon"
            :dot="field.dot"
            :info="field.info"
            :url="field.url"
            :to="field.to"
            :replace="field.replace"
            >{{field.text}}</van-tabbar-item>
    </van-tabbar>
</template>
<script>
    import Tabbar from 'vant/lib/tabbar';
    import 'vant/lib/tabbar/style';
    import TabbarItem from 'vant/lib/tabbar-item';
    import 'vant/lib/tabbar-item/style';

    export default {
        name: 'bb-vant-tab-bar',
        components: {
            "van-tabbar":Tabbar,
            "van-tabbar-item":TabbarItem
        },
        props: {
            //v-model 当前索引
            value:{
                type:Number
            },
            /*静态标签数据
                [{
                    text:"标签名称"  标签名称
                    icon:"chat", 图标
                    dot:false, 显示小红点
                    info:"String || Number" 图标右上角提示信息
                    url:"String" 跳转链接
                    to:"String || Object"   路由跳转对象，同 vue-router 的 to
                    replace:false  跳转时是否替换当前history
                }]
            */
            fields:{
                type:Array,
                default:function() {
                    return [{
                        text:'标签1',
                        icon:'ty-yy_ty',
                    },{
                        text:'标签2',
                        icon:'ty-yy_ty',
                    },{
                        text:'标签3',
                        icon:'ty-yy_ty',
                    }];
                }
            },
            //动态标签数据
            fieldsDs:{
                type:Object
            }
        },
        data() {
            return {
                active:this.value || 0,
                realFields:this.fields
            };
        },
        mounted(){ 
            this.getData();
        },
        //事件click
        methods: {
            //切换标签w
            onChange(key) {
                this.$emit("change",key);
            },
            //获取数据
            getData() {
                const t = this;
                if (t.fieldsDs) {
                    Util.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t.realFields = value;
                        });
                    }, function (code, msg) {
                    });
                }
            },
        }
    }
</script>

<style scoped>
</style>