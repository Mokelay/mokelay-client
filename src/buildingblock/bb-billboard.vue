<template>
    <div class="bb-billboard">
        <div class="bb-billboard-item" v-for = "ele in realData" :style="{backgroundColor:ele.bgColor || defaultBgColor}">
            <span class="bb-billboard-digit"><i :class="ele.icon"></i><span>{{ele.digit}}</span></span>
            <p class="bb-billboard-text">{{ele.text}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'bb-billboard',
        props: {
            dataDs:{
                type:Object
            },
            dataStatic:{
                type:[Object,String]
            },
            lazy:{//初始不加载数据
                type:Boolean,
                default: false
            }
        },
        data() {
            return {
                realData:null,
                defaultBgColor:'#63B8FF',
                external:{}
            }
        },
        watch: {
        },
        created: function () {
            const t = this;
            if(t.dataDs){
                //加载动态数据
                if(!t.lazy){
                    t.getData();
                }
            }else{
                //加载静态数据
                t.realData = typeof t.dataStatic == 'string' && t.dataStatic.length?eval("("+t.dataStatic+")"):t.dataStatic; 
            }
        },
        mounted:function(){
        },
        methods: {
            getData: function () {
                const t = this;
                if (t.dataDs) {
                    _TY_Tool.getDSData(t.dataDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t[dataKey] = val.value.list;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            linkage:function(data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-billboard{
        display: flex;
        margin: auto;
        .bb-billboard-item{
            flex:1;
            text-align: center;
            max-width: 200px;
            color: #ffffff;
            margin: auto;
            padding:25px;
            .bb-billboard-digit{
                font-size: 20px;
                font-weight: bold;
                span{
                   font-size: 30px; 
                }
            }
            .bb-billboard-text{
                font-size:16px;
            }
        }
    }
</style>