<template>
    <el-badge :is-dot="isDot" :value="showValue" class="item" :hidden="hidden">
        <span v-if="text" @click="click">{{text}}</span>
        <bb-button v-if="button" @click="btnClick" :button="button" :style="{'display':showBtn}"></bb-button>
    </el-badge>
</template>
<script>
    export default {
        name: 'bb-badge',
        props: {
            //红点内容
            value: {
                type: [Number, String, Boolean],
                default: null
            },
            //标题
            text: {
                type: String,
            },
            //标题动态数据源
            textDs: {
                type: Object,
            },
            //自动刷新时间间隔
            intervalTime: {
                type: Number
            },
            //是否可以点击消失
            clickable: {
                type: Boolean,
                default:false
            },
            button:{
                type:Object,
                default:null
            }
        },
        data() {
            return {
                baseValue: this.value,
                hidden: !Boolean(this.value),
                external:{},//外部参数
                showBtn:'inline-block'
            };
        },
        computed: {
            //标记显示控制
            isDot: function () {
                var p_value = (typeof eval(this.baseValue) === 'boolean') ? eval(this.baseValue) : false;
                return p_value;
            },
            //标记显示内容
            showValue: function () {
                var p_value = (typeof eval(this.baseValue) === 'boolean') ? '' : this.baseValue;
                return p_value;
            }
        },
        created: function () {
            this.autoRefresh();
        },
        beforeDestroy:function(){
            //摧毁前 停止定时器
            this.stopRefresh();
        },
        methods: {
            //外部参数，在button中存储
            linkage(...data){
              let t=this;
              if(data){
                this.external['linkage'] = data;
                t.getData();//先执行一次，再走定时器
              }
            },
            //隐藏还是显示
            showOrHide:function(..._data){
                let t=this;
                _data.forEach((val,key)=>{
                  if(val.type == 'custom'){
                    let flag = val.arguments;
                    if(flag){
                        t.hidden = false;
                        t.showBtn="inline-block";
                        //开始刷新
                        t.autoRefresh();
                    }else{
                        t.hidden = true;
                        t.showBtn = "none";
                        if(t.setTime){
                            t.stopRefresh();
                        }
                    }
                  }
                });
            },
            //隐藏标记
            hide: function () {
                this.baseValue = null;
                this.hidden = true;
                if(this.setTime){
                    this.stopRefresh();
                }
            },
            //初始化标记
            buildValue(val){
                const t=this;
                this.baseValue = val;
                if(val){
                    this.hidden = false;
                }
            },
            //接收点击事件
            click:function(){
                const t = this;
                t.$emit('click',t);
                if(t.clickable){
                    t.hide();
                }
            },
            btnClick:function(){
                const t = this;
                t.$emit('click',t);
            },
            //获取动态数据
            getData:function () {
                const t = this;
                if (t.textDs) {
                    _TY_Tool.getDSData(t.textDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            t.baseValue = val.value;
                            if(t.baseValue>0){
                                t.hidden = false;
                            }
                        })
                    }, function (code, msg) {
                    });
                }
            },
            //开始刷新
            autoRefresh:function(){
                const t = this;
                if(t.intervalTime == undefined){
                    t.getData();
                }else{
                    if(!t.setTime){
                        t.setTime = setInterval(t.getData,t.intervalTime);
                    }
                }
            },
            //停止自动刷新
            stopRefresh:function(){
                const t = this;
                clearInterval(t.setTime);
                t.setTime = null;
            }

        }
    }
</script>
<style>
    .item .el-badge__content {
        right: 0px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
    }
</style>