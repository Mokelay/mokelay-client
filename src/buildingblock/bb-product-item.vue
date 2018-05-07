<template>
    <div class="bb-product-item-group">
        <div class="bb-product-item">
            <img src="">
            <span></span>
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
                type:[Object,Array],
                default:function(){
                    return {
                        img:"http://2d.zol-img.com.cn/product_small/12_60x45/721/ces22UfMOwfIw.jpg",
                        title:"Alienware 17（ALW17ED-4738",
                        href:"http://detail.zol.com.cn/notebook/index1138251.shtml"
                    }
                }
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
                valueBase:this.value
            }
        },
        watch: {
        },
        created: function () {
            t.getData();
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
                    if(val.type == 'custom' && val.arguments){
                        t.valueBase.push(val.arguments);
                    }
                })
            },
            //删除项 group开启有效
            removeItem:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        t.valueBase.splice(val.arguments,1);
                    }
                })
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-product-item{
    }
</style>