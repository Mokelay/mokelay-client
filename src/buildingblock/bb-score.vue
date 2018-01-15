<template>
    <span class="bb-score">
        <span v-html="styleConfig.title"></span>
        <i :style="{color:styleConfig.color,'font-size':styleConfig.size}" v-for="(icon,key) in iconArr" :key="key" :class="icon" v-tap="tap.bind(this,key)"></i>
    </span>
</template>

<script>
    export default {
        name: 'bb-score',
        props: {
            /*
                value 默认值 支持v-model
            */
            value:{
                type:Number,
                default:0
            },
            /*
                defaultValTpl 支持模板的默认值
            */
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*
                styleConfig 样式设置
                {
                    title:'设置标题'，
                    type: 图标类型
                    color:  图标颜色
                    size:图标大小
                }
            */
            styleConfig:{
                type:Object,
                default:function(){
                    return {
                        title:"设置标题",
                        color:"#FFD700",
                        type:'ty-star-off ty-font,ty-star-on ty-font',
                        size:"24px"
                    }
                }
            },
            commitDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase: this.value,
                normalIcon:null,
                selectIcon:null,
                iconArr:null
            }
        },
        computed:{
        },
        watch: {
            value(val){
                this.valueBase=val;
            }
        },
        mounted:function(){
            let t=this;
            //初始化默认值模板
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            //默认值回填
            t.setStatue();
        },
        methods: {
            //根据当前值改图标状态
            setStatue:function(){
                const t = this;
                const status = t.styleConfig.type.split(',');
                //获取正常状态下的图标
                t.normalIcon = status[0];
                //获取选中状态下的图标
                t.selectIcon = status[1];
                const iconArr = ['normal','normal','normal','normal','normal'];
                iconArr.forEach((val,key)=>{
                    if(key < t.valueBase){
                        iconArr[key] = t.selectIcon;
                    }else{
                        iconArr[key] = t.normalIcon;
                    }
                })
                t.iconArr = iconArr;
            },
            //回填值
            tap:function(score){
                const t = this;
                t.valueBase = score + 1
                //v-model回传给表单
                t.$emit('input',t.valueBase);
                t.$emit('change',t.valueBase);
                t.setStatue();
                //通过DS提交数据
                t.commitData();
            },
            //提交数据
            commitData:function(){
                const t = this;
                if (t.commitDs) {
                    _TY_Tool.getDSData(t.commitDs, {"bb": t, "router": t.$route.params}, function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t[dataKey] = val.value.list;
                        })
                    }, function (code, msg) {
                    });
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-score{
        i{
            font-style: normal;
        }
    }
</style>