<template>
    <div :class="group?'bb-product-item-group':''" id="bb-product-item-group" ref="bb-product-item-group">
        <div class="bb-product-item" v-for="(ele,key) in valueBase" v-if="ele" :key="key" @click="goUrl.bind(null,ele)()">
            <el-button icon="ty-icon_tuichu" class="delete" type="text" @click="removeItem.bind(null,{type:'custom',arguments:key})()"></el-button>
            <img :src="ele.img" :class="styleType == 'horizontal'?'horizontal':'vertical'">
            <span class="title">{{ele.title}}</span>
        </div> 
    </div>
</template>
<script>
    export default {
        name: 'bb-product-item',
        props: {
            /*支持 v-model
                group开启时 
                [{
                    img:null,
                    title:null,
                    href:null
                }]
                group 关闭
                {
                    img:null,
                    title:null,
                    href:null
                }
            */
            value:{
                type:[Object,Array]
            },
            /*ds 获取动态数据*/
            ds:{
                type:Object
            },
            /*group 是否支持分组*/
            group:{
                type:Boolean,
                default:false
            },
            /*styleType 样式类型 目前支持 水平 horizontal 和 垂直vertical 两种*/
            styleType:{
                type:String,
                default:"horizontal"
            }
        },
        data() {
            return {
                valueBase:[].concat(this.value)
            }
        },
        watch: {
        },
        created: function () {
            this.getData();
        },
        mounted:function(){
        },
        methods: {
            //动态获取数据
            getData: function () {
                const t = this;
                if (t.dataDs) {
                    _TY_Tool.getDSData(t.dataDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            t.valueBase = val.value;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            //外部刷新
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            },
            //新增项 group开启有效
            addItem:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom'){
                        t.valueBase.push(val.arguments);
                        //默认滚动到最底部
                        const container = t.$refs["bb-product-item-group"];
                        container.scrollTop = container.scrollHeight;
                        t.$emit('add',t.valueBase);
                        t.$emit('change',t.valueBase);
                    }
                })
            },
            //删除项 group开启有效
            removeItem:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom'){
                        t.valueBase.splice(val.arguments,1);
                        t.$emit('remove',t.valueBase);
                        t.$emit('change',t.valueBase);
                    }
                })
            },
            //点击跳转
            goUrl:function(ele){
                const t = this;
                const href = ele.href;
                if(!href){
                    return;
                }
                if (href.indexOf("http") == 0) {
                    document.location.href = href;
                } else {
                    t.$router.push(href);
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-product-item-group{
        max-height: 500px;
        overflow-y: auto;
        .bb-product-item:hover{
            margin-top:-1px;
            border:1px dashed #0091ea;
            transition: border margin .5s;
            .delete{
                opacity:1;
                transition: opacity .3s;
            }
        }
    }
    .bb-product-item{
        width: 100%;
        padding: 20px 15px;
        border: 1px solid #ededed;
        border-top: 0 none;
        position: relative;

        .title{
            display: block;
            height: 45px;
            text-align: left;
            overflow: hidden;
            line-height: 22px;
            overflow: hidden;
            word-break: break-all;
            font-size: 0.8em;
        }
        .delete{
            padding: 0px;
            position: absolute;
            right: 2px;
            top: 2px;
            color:#0091ea;
            opacity:0;
        }
        .horizontal{
            float: left;
            margin-right: 5px;
        }
    }

</style>