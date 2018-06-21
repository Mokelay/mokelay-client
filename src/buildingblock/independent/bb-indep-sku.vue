
<template>
    <div class="bb-sku flex ">
        <div class="pic-box flex1">
            <div class="pic">
                <img :src="picList[activePicIndex]">
            </div>
            <ul class="">
                <li v-for="(item,index) in picList" @click="picClick(item,index)" :class="activePicIndex==index?'active':''">
                    <img :src="item"/>
                </li>
            </ul>
        </div>
        <div class="info-box flex1">
            <dl class="title-box">
                <dt>{{title}}</dt>
                <dd>{{description}}</dd>
            </dl>
            <dl class="info-type" v-if="tags&&tags.length>0">
                <dt>适用对象</dt>
                <dd v-for="(item,index) in types">{{item.text}}</dd>
            </dl>
            <ul class="btn-type">
                <li v-for="(item,index) in types" @click="typeClick(item,index)" :class="activeTypeIndex==index?'active':''">
                    {{item.text}}
                    <i class="iconfont ty-icon_chenggong_lv"></i>
                </li>
            </ul>
            <div class="info-p">
                <dl class="price-o" v-if="discount!=10">
                    <dt>原价</dt>
                    <dd>
                       <em>￥</em>
                       <span class="num-o">{{originPrice}}</span> 
                    </dd>
                </dl>
                <dl class="price">
                    <dt>{{discount!=10?'折扣价':'套餐价'}}</dt>
                    <dd>
                        <em>￥</em>
                        <span class="num">{{price}}</span>
                        <sup v-if="discount!=10">{{discount}}折</sup>
                    </dd>
                </dl>
                <dl class="info-sm" v-if="types[activeTypeIndex].description">
                    <dt>套餐包括:</dt>
                    <dd>{{types[activeTypeIndex].description}}</dd>
                </dl>
            </div>
            <div class="btn-box">
                <div class="amount-box">
                    <input type="text" disabled :data-year="year" :value="year+'年'"/>
                    <a href="javascript:;" @click="amount('add')" class="add">+</a>
                    <a href="javascript:;" @click="amount('reduce')" class="reduce">-</a>
                </div>
                <bb-indep-button :button="Object.assign({'selectText':'加入我的需求'},joinButton)" @click="joinClick" class="sku-btn join" ref="join"></bb-indep-button>
                <bb-indep-button :button="Object.assign({'selectText':'试用体验'},trialButton)" @click="trialClick" class="sku-btn trial" ref="trial"></bb-indep-button>
            </div>
        </div>
    </div>
</template>

<script>
    import BBIndepButton from "./bb-indep-button"
    
    export default {
        name: 'bb-indep-sku',
        props: {
            //加入购物车按钮配置
            joinButton:{
                type:Object
            },
            //使用体验按钮配置
            trialButton:{
                type:Object
            },
            /**
                获取商品详情数据源
                {
                    picList:['https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png'],
                    title:'智能家具类A型',
                    description:'此模板是一款专门针对智能硬件的，基于机智云SDK的适用于智能空气净化器的模版。它涵盖了扫码绑定设备、WiFi绑定设备、设备控制等IOT类APP的基本功能，同时支持搜索附近设备、自定义设备属性，模板操作灵活，也适用于定制更多其他类型智能硬件产品',
                    tags:[{
                        text:'空气净化器',
                        value:'kqjhq'
                    }],
                    types:[{
                        text:'超值套餐1',
                        value:'type1',
                        price:'9999',
                        description:'APP前端+后端+管理后台+云服务器+APP个性化调整'
                    }],
                    promotion:[{
                        year:1,
                        discount:10
                    },{
                        year:2,
                        discount:9
                    },{
                        year:3,
                        discount:7
                    }]
                }
            */
            ds:{
                type:Object
            }
        },
        data() {
            return {
                activePicIndex:0,//主图显示的图片
                activeTypeIndex:0,//勾选的套餐类型
                year:1,//默认一年
                goodsInfo:{},//商品信息，接口返回临时存储,加入购物车时，需要将商品信息返回

                title:'',//标题
                description:'',//商品描述
                //商品图片列表
                picList:[],
                /**
                    套餐：
                    {
                        text:'超值套餐1',
                        value:'type1',
                        price:'9999',
                        description:'APP前端+后端+管理后台+云服务器+APP个性化调整'
                    }
                */
                types:[],
                /**
                    标签
                    {
                        text:'空气净化器',
                        value:'kqjhq'
                    }
                */
                tags:[],
                /**促销
                    {
                        year:1,
                        discount:10
                    }
                */
                promotion:[],
                broadcastClock:null//轮播定时器
            }
        },
        components:{
            'bb-indep-button':BBIndepButton
        },
        computed:{
            //折扣
            discount(){
                let t=this;
                if(!t.promotion||t.promotion.length<=0){
                    return 10;
                }
                let result = 10;
                t.promotion.forEach((item,index)=>{
                    if(t.year == item.year){
                        result = item.discount;
                        return false;
                    }
                });
                return result;
            },
            //原价
            originPrice(){
                let t=this;
                let result = 0;
                t.types.forEach((item,index)=>{
                    if(index == t.activeTypeIndex){
                        result = item.price;
                        return false;
                    }
                });
                return result*t.year;
            },
            //打折价
            price(){
                let t=this;
                return Math.floor(t.originPrice * t.discount / 10);
            }
        },
        created:function(){
            let t=this;
            //加载数据
            t.loadData();
            //轮播图定时器
            t.picBroadCast();
        },
        mounted:function(){
            let t =this;
        },
        beforeDestroy:function(){
            let t=this;
            //清除定时器
            if(t.broadcastClock){
                window.clearInterval(t.broadcastClock);
            }
        },
        methods: {
            //测试数据
            testData:function(){
                let t=this;
                t.title="测试标题001";
                t.description="测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈测试描述哈哈哈";
                t.picList=[
                    "https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png",
                    "https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png"
                ];
                t.types=[{
                    text:'套餐1',
                    value:'type1',
                    price:9999,
                    description:'lego配置+积木配置+接口配置+页面配置'
                },{
                    text:'套餐2',
                    value:'type2',
                    price:2999,
                    description:'接口配置+页面配置'
                }];
                t.tags=[{
                    text:'底代码开发',
                    value:'ddmkf'
                }];
                //促销
                t.promotion=[{
                    year:1,
                    discount:10
                },{
                    year:2,
                    discount:9
                },{
                    year:3,
                    discount:7
                }];
            },
            //加载数据
            loadData:function(){
                let t=this;
                if(t.ds){
                    _TY_Tool.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        var _data = map[0].value;
                        t.title = _data.title;
                        t.description=_data.description;
                        t.picList=_data.picList;
                        t.types=_data.types;
                        t.tags=_data.tags;
                        //促销
                        t.promotion=_data.promotion;
                    }, function (code, msg) {

                    });
                }else{
                    //放一点测试数据
                    t.testData()
                }
            },
            //图片轮播
            picBroadCast:function(){
                let t=this;
                t.broadcastClock = window.setInterval(()=>{
                    if(t.picList){
                        t.activePicIndex = t.activePicIndex>=(t.picList.length-1)?0:(t.activePicIndex+1);
                    }
                },5000);
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //小图片点击事件
            picClick:function(item,index){
                let t=this;
                t.activePicIndex = index;
            },
            //套餐类型点击事件
            typeClick:function(item,index){
                let t=this;
                t.activeTypeIndex = index;
            },
            //构建 sku 数据（用户选择的数据）
            buildSkuData:function(){
                let t=this;
                return {
                    type:t.types[t.activeTypeIndex],
                    originPrice:t.originPrice,
                    discount:t.discount,
                    price:t.price,
                    year:t.year,
                    title:t.title
                }
            },
            //加入我的需求click事件
            joinClick:function(button){
                let t=this;
                t.$emit('joinClick',t.buildSkuData(),t,button);
            },
            trialClick:function(button){
                let t=this;
                t.$emit('trialClick',t.buildSkuData(),t,button);
            },
            //计算年份
            amount:function(type){
                let t=this;
                if(type==='add'){
                    t.year = t.year>=3?t.year:t.year+1;
                }else{
                    t.year = t.year<=1?t.year:t.year-1;
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-sku{
        font-size: .464rem;
        .pic-box{
            width:50%;
            margin-right:1.64rem;
            .pic{
                height:14.285rem;
                position:relative;
                text-align: center;
                overflow:hidden;
                border: 0.0357rem solid #eee;
                img{
                    width:100%;
                } 
            }
            ul{
                padding-top:1.285rem;
                list-style:none;
                overflow-x:scroll;
                white-space: nowrap;
                &::-webkit-scrollbar{
                    display:none;
                }
                li{
                    cursor:pointer;
                    list-style:none;
                    display:inline-block;
                    width:22%;
                    heigth:2.5rem;
                    background:#eeeefa;
                    border:.0357rem solid #d2d2d2;
                    border-radius:0.0714rem;
                    margin-right:.5714rem;
                    overflow:hidden;
                    img{
                        width:100%;
                    }
                    &:last-child{
                        margin-right:0;
                    }
                    &.active{
                        position:relative;
                        top:-0.2857rem;
                        border-color:#8c5ac0;
                    }
                }
            }
        }
        .info-box{
            margin-left:0.64rem;
            .title-box{
                color:##343434;
                dt{
                    font-size: .714rem;
                    padding-bottom:.5714rem;
                    font-weight:700;
                }
                dd{
                    line-height:.714rem;
                }
            }
            .info-type{
                dt{
                    display: inline-block;
                    font-weight: 700;
                }
                dd{
                    color:#8c5ac0; 
                    padding-left:.714rem;
                    display: inline;
                }
            }
            .btn-type{
                padding:.714rem 0;
                list-style:none;
                li{
                    list-style:none; 
                    width:4.357rem;
                    height:1.357rem;
                    line-height:1.3rem;
                    display:inline-block;
                    border:.0357rem solid #d2d2d2;
                    text-align:center;
                    position:relative;
                    cursor:pointer;
                    margin-left:.2587rem;
                   &>i{
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        color:#8c5ac0;
                        display:none;
                   }
                   &.active{
                        border:.0714rem solid #8c5ac0;
                        &>i{
                            display:block;
                        }
                   }
                }
            }
            .info-p{
                padding:.714rem;
                background-color:#f8f8fc;
                .price-o{
                    dt{
                        color:#989898;
                        padding-right:1.4285rem;
                        display:inline-block;
                    }
                    dd{
                        color:#989898;
                        display:inline-block;
                        em{
                            font-style: normal;
                        }
                        .num-o{
                            display: inline-block;
                            text-decoration:line-through;
                        }
                    }
                }
                .price{
                    padding:.2857rem 0 .5714rem;
                    border-bottom:.0357rem dashed #d2d2d2;
                    dt{
                        color:#989898;
                        padding-right:.714rem;
                        display:inline-block;
                    }
                    dd{
                        display:inline-block;
                        em,.num{
                            font-style: normal;
                            font-size: 1rem;
                            color:#343434;
                            font-weight: 700;
                        }
                        sup{
                            line-height:.5714rem;
                            font-size: .4285rem;
                            padding:0 .214rem;
                            border-radius:.0714rem;
                            color:#8c5ac0;
                            border:.0357rem solid #8c5ac0;
                            text-decoration:none;
                            position:relative;
                            top:-0.357rem;
                            right:-0.1785rem;
                        }
                    }
                }
                .info-sm{
                    padding-top:.5714rem;
                    dt{
                        padding-bottom:.2857rem;
                        font-weight:700;
                    }
                    dd{
                        color:#989898;
                    }
                }
            }
            .btn-box{
                padding-top:2rem;
                .amount-box{
                    width: 2rem;
                    height: 1.679rem;
                    border: .0357rem solid #d2d2d2;
                    position: relative;
                    display:inline-block;
                    input{
                        background-color:#fff;
                        width: 1.357rem;
                        height: 1.6rem;
                        border: none;
                        text-align: center;
                        color: #343434;
                        padding: 0;
                        line-height: 1.5714rem;
                        outline-style: none;
                    }
                    a{
                        width: .64285rem;
                        height: .80143rem;
                        display: block;
                        text-align: center;
                        position: absolute;
                        background-color: #ecedec;
                        border-left: .0357rem solid #d2d2d2;
                        color: #3e3d5e;
                        right: 0;
                    }
                    .add{
                        top: 0;
                        border-bottom: .0457rem solid #d2d2d2;
                    }
                    .reduce{
                        bottom:0;
                    }
                }
                .sku-btn{
                    margin: 0 .7143rem;
                    height: 1.678rem;
                    &:last-child{
                        margin:0;
                    }
                }
            }
        }
        
    }

    

</style>