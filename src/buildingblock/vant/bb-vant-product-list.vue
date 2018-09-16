<template>
    <div class="bb-vant-product-list">
        <div class="checkbox-group-list" v-for="(field,index) in realFields">
            <van-checkbox
                v-model="field.titleData.checked"
                class="title-contril"
                name="field.titleData.value"
                @change="selectAll(index)"
                >
                <span class="title">{{field.titleData.text}}</span>
                <span class="subTitle">{{field.titleData.subtitle}}</span>
            </van-checkbox>
            <van-checkbox-group 
                v-model="result" 
                @change="change(index)"
                :disabled="option.disabled">
                <van-checkbox
                v-for="(item, key) in field.fields"
                :key="item.text"
                :name="item.value"
                >
                    <span v-if="!contentTemplate">{{item.text}}</span>
                    <bb-layout-seriation :content="item.content"></bb-layout-seriation>
                </van-checkbox>
            </van-checkbox-group>
        </div>
        <div class="submit-bar">
            <van-submit-bar
            :price="totalPrice"
            button-text="提交订单"
            @submit="onSubmit"
            >
                <van-checkbox v-model="allChecked" @change="selectAllGroup">全选</van-checkbox>
            </van-submit-bar>  
        </div>
    </div>
</template>

<script>
import Checkbox from 'vant/lib/checkbox';
import 'vant/lib/checkbox/style';
import CheckboxGroup from 'vant/lib/checkbox-group';
import 'vant/lib/checkbox-group/style';
import SubmitBar from 'vant/lib/submit-bar';
import 'vant/lib/submit-bar/style';
    export default {
        name: 'bb-vant-product-list',
        components: {
          "van-checkbox":Checkbox,
          "van-checkbox-group":CheckboxGroup,
          "van-submit-bar":SubmitBar
        },
        props: {
            //默认值  支持v-model
            value:{
                type:[Array,String]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*选项数据 静态
                [{
                    text:'选项1'，
                    value:1,
                    disabled:false
                },{
                    text:'选项2'，
                    value:2,
                    disabled:false
                }]
            */
            fieldsData:{
                type:Array,
                default:function(){
                    return [{
                        titleData:{
                            text:"企业-1",
                            value:"all",
                            subtitle:"200",
                            checked:false,
                            price:200
                        },
                        fields:[{
                            text:'选项1',
                            value:"a",
                            disabled:false,
                            price:100
                        },{
                            text:'选项2',
                            value:"b",
                            disabled:false,
                            price:100
                        }]
                    },{
                        titleData:{
                            text:"企业-2",
                            value:"all",
                            subtitle:"200",
                            checked:false,
                            price:200
                        },
                        fields:[{
                            text:'选项3',
                            value:"c",
                            disabled:false,
                            price:100
                        },{
                            text:'选项4',
                            value:"d",
                            disabled:false,
                            price:100
                        }]
                    }];
                }
            },
            /*选项数据 动态
                通过DS接口获取
            */
            fieldsDs:{
                type:Object
            },
            //自定义内容
            contentTemplate:{
                type:Array
            },
            priceKey:{
                type:String,
                default:"price"
            },
            submitButton:{
                type:Object
            },
            /*其他属性扩展 disabled 等
                disabled: 禁用
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false
                    };
                }
            },
        },
        data() {
            return {
                realFields:this.fieldsData,
                valueBase:[],
                valueBaseString:'',
                content:this.contentTemplate,
                result: [],
                allResult:[],
                checkboxGroup:[{
                    groupChecked:[],
                    fullResult:[],
                    fullChecked:false
                }],
                allChecked:false,
                fromChange:false,
                fromSelectAll:false,
                totalPrice:0
            };
        },
        created(){
            let t=this;
            //获取数据
            this.getData();
            _TY_Tool.buildDefaultValTpl(t, "valueBaseString");
            t.valueBase = eval(t.valueBaseString);
            t.transferContentArr();
        },
        //事件 change 
        methods: {
            //获取数据
            getData() {
                const t = this;
                if (t.fieldsDs) {
                    Util.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t.realFields = value;
                            t.transferContentArr();
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //值改变
            change(val){
                if(this.fromSelectAll){
                    this.fromSelectAll = false;
                    return;
                }
                this.valueBase = this.result;
                let newResult = [].concat(this.result);
                //将当前数据组合并进result中
                newResult = newResult.concat(this.checkboxGroup[val]["fullResult"]);
                //去重
                let set = new Set(newResult);
                let newArr = Array.from(set);
                if(this.result.length == this.allResult.length){
                    this.allChecked = true;
                }else{
                    this.allChecked = false;
                }
                //newResult如果长度改变了 则说明 result没有全部选中
                if(this.result.length == newArr.length){
                    this.realFields[val].titleData.checked = true;
                    // this.changeSelect = true;
                    //this.selectAll(val,true);
                }else{
                    this.realFields[val].titleData.checked = false;
                    // this.changeCancel = true;
                    //this.selectAll(val,false);
                }
                this.fromChange = true;
                this.totalPriceFn();
                this.selectAll(val);
                this.$emit("change",this.result);
            },
            transferContentArr(){
                const t = this;
                t.realFields.forEach((fieldP,index)=>{
                    t.checkboxGroup[index] = t.checkboxGroup[index]?t.checkboxGroup[index]:{
                        groupChecked:[],
                        fullResult:[],
                        fullChecked:false
                    };
                    fieldP.fields.forEach((field,key)=>{
                        //数据解析到模板中去
                        let _content = _TY_Tool.tpl(JSON.stringify(t.content),_TY_Tool.buildTplParams(t,{
                            rowData:field
                        }));
                        if(!_content){
                            console.error("错误提示:","列表组件没有配置模板或者没有匹配到参数");
                            return true;
                        }
                        /*
                            兼容 ul包含ul的情况
                            子的ul中模板用<#= ... #>代替，否则第一层就会被模板参数替换
                        */
                        const reg = /<#=(.*?)#>/g;
                        if(_content.match(reg)){
                            //如果字符串中含有<#=...#> 这样的标识，转换成 <%=...%>
                            _content = _content.replace(reg,function(){
                                return "<%="+arguments[1]+"%>";
                            });
                        }
                        field.content = JSON.parse(_content);
                        t.checkboxGroup[index]["fullResult"].push(field.value);
                        t.allResult.push(field.value);
                    });
                });
            },
            selectAll(e){
                const t = this;
                if(this.fromChange){
                    this.fromChange = false;
                    return;
                }
                if(t.realFields[e].titleData.checked){
                    let newResult = t.result.concat(t.checkboxGroup[e]["fullResult"]);
                    let set = new Set(newResult);
                    let newArr = Array.from(set);
                    t.result = newArr;
                }else{
                    let newResult = [].concat(t.result);
                    newResult.forEach((val,key)=>{
                        t.checkboxGroup[e]["fullResult"].forEach((ele,index)=>{
                            if(val == ele){
                                console.log("val",val);
                                newResult = newResult.filter(item => item !== val);
                            }
                        });
                    });
                    t.result = newResult;
                }
                if(t.result.length == t.allResult.length){
                    this.allChecked = true;
                }else{
                    this.allChecked = false;
                }
                this.fromSelectAll = true;
                this.totalPriceFn();
                this.$emit("change",t.result);
            },
            totalPriceFn(){
                const t = this;
                let price = 0;
                t.realFields.forEach((fieldP,index)=>{
                    fieldP.fields.forEach((field,key)=>{
                        t.result.forEach((val,ind)=>{
                            if(val == field.value){
                                price = price +  field[t.priceKey]
                            }
                        })
                    })
                });
                t.totalPrice = 100*price;
            },
            selectAllGroup(e){
                const t = this;
                if(e){
                   t.result = t.allResult;
                }else{
                    t.result = [];
                }
            },
            onSubmit(e){
                this.$emit("commit",this.result);
                _TY_Tool.resolveButton(this.submitButton,_TY_Tool.buildTplParams(this));
            },
        }
    }
</script>

<style lang="less">
    .bb-vant-product-list{
        background:#f5f5f5;
        .van-checkbox__icon{
            margin-left:0.13rem;
        }
        .van-checkbox__label{
            width:89%;
        }
        .title-contril{
            border-bottom:1px solid #E5E5E5;
            height:0.93333rem;
            .title{
                font-family: PingFangSC-Regular;
                font-size: 0.45rem;
                color: #222222;
                text-align: left;
                display:inline-block;
                width:80%;
            }
            .subTitle{
                font-family: PingFang-SC-Medium;
                font-size: 0.35rem;
                color: #F5A623;
                text-align: right;
                display:inline-block;
                width:16%;
            }
            .van-checkbox__label{
                display:inline-block;
                width:87%;
            }
        }
        .checkbox-group-list{
            margin-top:0.13333333rem;
            background:#fff;
        }
        .submit-bar{
            height:1.333333rem;
        }
    }
</style>