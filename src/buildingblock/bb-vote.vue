<template>
    <div class="bb-vote">
        <div class="bb-vote-title">{{vote.title || '请投票'}}{{vote.maxSelection == 1?"（单选）":"（多选）"}}</div>
        <div class="bb-vote-content">
            <!-- 文字投票 -->
            <div v-if="vote.voteType == 'words'" v-for="(val,key) in realFields" :key="key" v-tap="tapOption.bind(this,key)">
                <transition-group
                    name="custom-classes-transition"
                    enter-active-class="fadeIn"
                    leave-active-class="fadeOut"
                    :duration="100"
                > 
                    <i key='1' v-if="!val.select" class="el-icon-circle-check-outline selectIcon"></i>
                    <i key='2' v-if="val.select" class="el-icon-circle-check selectIcon selected"></i>
                </transition-group>
                <p class="bb-vote-option" :style="val.style">{{val.subtitle}}</p> 
            </div>
            <!-- 图集投票 -->
            <div v-if="vote.voteType == 'picture'" class="picture">
                <!-- 图集 -->
                <bb-photos :fields="realFields" :transformConfig="transformConfig" @swipe="swipe"></bb-photos>
                <div class="picture-info" v-if="vote.voteType == 'picture'">
                    <div v-for="(val,key) in realFields" :key="key" v-if="val.show">
                        <!-- 选择按钮 -->
                        <span v-tap="tapOption.bind(this,key)">
                            <i key='1' v-if="!val.select" class="el-icon-circle-check-outline selectIcon"></i>
                            <i key='2' v-if="val.select" class="el-icon-circle-check selectIcon selected"></i> 
                        </span>
                        <!-- 选项标题 -->
                        <p key='3' class="subtitle">{{val.subtitle}}</p>
                        <!-- 进度 -->
                        <span class="process" v-for="(element,index) in realFields" :key="index + '_process'">
                            <span v-if="val.show" :class="nowItem == index?'item active':'item'" ></span>
                        </span>
                    </div>
                    
                </div>
            </div>
        </div>
        <!-- 投票按钮 -->
        <div class="bb-vote-submit" v-tap="submit">投票</div>
    </div>
</template>
<script>
    export default {
        name: 'bb-vote',
        props: {
            /*
                fields 投票选项
                [{
                    subtitle:'',  选项标题
                    value:'', 选项值
                    url:''  选项图片地址 //投票类型为图片时有效
                }]
            */
            fields:{
                type:Array
            },
            /*
                vote 默认值 支持v-model
                {
                    title:'投票标题',
                    voteType:'words || picture',
                    maxSelection:1, 最多可以选几个
                    endTime:'' 结束时间
                    buttonColor: 提交按钮颜色
                }
            */
            vote:{
                type:Object,
                default:function(){
                    return {
                        title:'请投票',
                        voteType:'picture',
                        maxSelection:1,
                        endTime:'',
                        buttonColor:'#333'
                    }
                }
            },
            /*
                fieldsDs  动态读取投票选项
            */
            fieldsDs:{
                type:Object
            },
            /*
                commitDs 投票记过提交接口
            */
            commitDs:{
                type:Object
            }
        },
        data() {
            return {
                selectIconClass:'el-icon-circle-check-outline',
                color:'#999999',
                realFields:this.fields,
                selected:null,
                valueBase:'',
                lastKey:null,
                transformConfig:{
                    transformMode:'manual', 
                    transformAnimate:'fadeInRight,fadeOutLeft,fadeInLeft,fadeOutRight'
                },
                nowItem:0,

            }
        },
        computed:{
        },
        watch: {
        },
        mounted:function(){
            const t = this;
            if(t.realFields){
                t.setRealFields();
            }
        },
        methods: {
            //滑动图片
            swipe:function(param){
                this.nowItem = param.key;
            },
            //点击选项
            tapOption:function(key){
                const t = this
                //获取当前选中的项数
                const length = t.valueBase.split(',').length - 1;
                const ele = t.realFields[key];
                //对比设置的最大可选数量
                if(length >= t.vote.maxSelection){
                    t.realFields[t.lastKey].select = false;
                }
                ele.select = !ele.select;
                t.$set(t.realFields,key,ele);
                t.getValue();
                //输出当前选项
                t.$emit('select',ele.value);
                t.lastKey = key;
            },
            //初始化选项状态
            setRealFields:function(){
                const t = this;
                t.realFields.forEach((val,key)=>{
                    val.select = false;
                });
                t.$set(t.realFields,0,t.realFields[0]);
            },
            //获取选中值
            getValue:function(){
                const t = this;
                t.valueBase = '';
                t.realFields.forEach((val,key)=>{
                    if(val.select == true){
                        t.valueBase = t.valueBase + ',' + val.value;
                    }
                });
            },
            //提交数据
            submit:function(){
                const t = this;
                t.$emit('commit',t.valueBase);
                const length = t.valueBase.split(',').length - 1;
                if(length){
                    console.log('t.valueBase:',t.valueBase);
                    t.commitData();
                }
            },
            //提交统计
            getData: function () {
                const t = this;
                if (t.fieldsDs) {
                    _TY_Tool.getDSData(t.fieldsDs, {"bb": t, "router": t.$route.params}, 
                        function (map) {
                            map.forEach((val,key)=>{
                                const dataKey = val.dataKey
                                t.realFields = val.value.list;
                                //触发积木更新
                                if(t.realFields){
                                    t.setShow();
                                }
                            })
                        }, function (code, msg) {
                    });
                }
            },
            //接口提交数据
            commitData: function () {
                const t = this;
                if (t.commitDs) {
                    _TY_Tool.getDSData(t.commitDs, {"bb": t, "router": t.$route.params}, 
                        function (map) {
                        }, function (code, msg) {
                    });
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-vote{
        .bb-vote-title{
            color: #76838f;
            line-height: 28px;
            border: 1px solid #ccd5db;
            height: 50px;
            background-color: #f0f3f4;
            text-indent: 10px;
            font-size: 14px;
            text-align: left;
            padding: 10px;
            min-height: 36px;
        }
        .bb-vote-content{
            border-right: 1px solid #ccd5db;
            border-left: 1px solid #ccd5db;
            position: relative;
            background-color: #f0f3f4;
            i{
                position: absolute;
                right: 2%;
                line-height: 40px;
            }
            .selectIcon{
                font-size: 20px;
                color:#cccccc;
            }
            .selected{
                color: #0091ea
            }
            .picture{
                text-align: center;
                .picture-info{
                    background-color: #ffffff;
                }
                .subtitle{
                    height: 36px;
                    line-height: 36px;
                    font-size: 12px;
                    color: #879195;
                    text-align: center;
                }
                .process{
                    .item{
                        width: 6px;
                        height: 6px;
                        display: inline-block;
                        margin-right: 4px;
                        background-color: #ccd5db;
                        border-radius: 50%;
                        overflow: hidden;
                        margin-bottom: 8px;
                    }
                    .active{
                        background-color: #7cb0ff;
                    }
                }
                .selectIcon{
                    position: absolute;
                    top: 0;
                }
            }
        }
        .bb-vote-option{
            border-bottom: 1px solid #ccd5db;
            margin: 0;
            height: 40px;
            text-indent: 20px;
            font-size: 12px;
            text-align: left;
            padding: 10px 10px 10px 0;
            color: #000;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .bb-vote-submit{
            background-color: #59c7f9;
            height: 40px;
            text-align: center;
            color: #fff;
            line-height: 40px;
            font-size: 14px;
        }
    }
</style>