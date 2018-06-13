<template>
    <div :class="['bb-billboard',theme]">
        <div v-if="theme=='pc_block'" class="bb-billboard-item" v-for = "ele in realData" :style="{backgroundColor:ele.bgColor || defaultBgColor}">
            <span class="bb-billboard-digit"><i :class="ele.icon"></i><span>{{ele.digit}}</span></span>
            <p class="bb-billboard-text">{{ele.text}}</p>
        </div>
        <div v-if="theme=='h5_block'" class="flex flex_center" @click="boardClick">
            <div class="flex1" style="padding: 0.4rem 0;">
                <div class="bill_item" @click="boardItemClick" v-for = "ele in realData" :style="{backgroundColor:ele.bgColor || ''}">
                    <span class="bill_digit"><i :class="ele.icon"></i><span>{{ele.digit}}</span></span>
                    <p class="bill_text">{{ele.text}}</p>
                </div>
            </div>
            <div class="bill_right_arrow">
                <i class="iconfont ty-icon_jiantou_right_l"></i>
            </div>
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
            },
            /**
                主题：目前分PC块和 H5块两种，后面有需要再扩展
                ['pc_block','h5_block']
            */
            theme:{
                type:String,
                default:'pc_block'
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
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            },
            //报表点击事件，方便做跳转
            boardClick:function(){
                let t=this;
                t.$emit('boardClick',t);
            },
            //报表Item点击事件
            boardItemClick:function(){
                let t=this;
                t.$emit('boardItemClick',t);
            }
        }
    }
</script>
<style lang="less" scoped>
    .flex{
        display:flex;
        display:-webkit-flex;
        display:-ms-flex;
        display:-moz-flex;
        display:-o-flex;
    }
    .flex_center{
        align-items:center;
    }
    .flex1{
        -moz-box-flex:1.0; /* Firefox */
        -webkit-box-flex:1.0; /* Safari 和 Chrome */
        box-flex:1.0;
        flex:1.0;
    }

    .bb-billboard.pc_block{
        display: flex;
        margin: auto;
        flex-wrap: wrap;
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

    .bb-billboard.h5_block{
        .bill_right_arrow{
            width:1rem;
        }
        .bill_item{
            width:50%;
            padding:0.2rem;
            float:left;
            font-size: 0.5rem;
            text-align: center;

            .bill_digit{
                line-height:1rem;
                color:#444;
            }
            .bill_text{
                line-height:1rem;
                color:#999;
            }
        }
    }

</style>