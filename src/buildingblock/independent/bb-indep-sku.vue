
<template>
    <div class="bb-sku flex ">
        <div class="pic-box flex1">
            <div class="pic">
                <img :src="picList[activePicIndex]">
            </div>
            <ul class="">
                <li v-for="(item,index) in picList" @click="picClick(item,index)">
                    <img :src="item"/>
                </li>
            </ul>
        </div>
        <div class="info-box flex1">
            <dl class="title-box">
                <dt>智能家居类A型</dt>
                <dd>此模板是一款专门针对智能硬件的，基于机智云SDK的适用于智能空气净化器的模版。它涵盖了扫码绑定设备、WiFi绑定设备、设备控制等IOT类APP的基本功能，同时支持搜索附近设备、自定义设备属性，模板操作灵活，也适用于定制更多其他类型智能硬件产品</dd>
            </dl>
            <dl class="info-type">
                <dt>适用对象</dt>
                <dd>空气净化器</dd>
            </dl>
            <ul class="btn-type">
                <li>
                    超值套餐
                    <i class="iconfont ty-icon_chenggong_lv"></i>
                </li>
                <li>
                    超值套餐2
                    <i class="iconfont ty-icon_chenggong_lv"></i>
                </li>
            </ul>
            <div class="info-p">
                <dl class="price-o">
                    <dt>原价</dt>
                    <dd>
                       <em>￥</em>
                       <span class="num-o">19999</span> 
                    </dd>
                </dl>
                <dl class="price">
                    <dt>折扣价</dt>
                    <dd>
                        <em>￥</em>
                        <span class="num">17999</span>
                        <sup>9折</sup>
                    </dd>
                </dl>
                <dl class="info-sm">
                    <dt>套餐包括:</dt>
                    <dd>APP前端+后端+管理后台+云服务器+APP个性化调整</dd>
                </dl>
            </div>
            <div class="btn-box">
                <div class="amount-box">
                    <input type="text" disabled :data-year="year" :value="year+'年'"/>
                    <a href="javascript:;" @click="amount('add')" class="add">+</a>
                    <a href="javascript:;" @click="amount('reduce')" class="reduce">-</a>
                </div>
                <bb-indep-button :button="{}" class="sku-btn join" ref="join">加入我的需求</bb-indep-button>
                <bb-indep-button :button="{}" class="sku-btn trial" ref="trial">试用体验</bb-indep-button>
            </div>
        </div>
    </div>
</template>

<script>
    import BBIndepButton from "./bb-indep-button"
    export default {
        name: 'bb-indep-sku',
        props: {
            
        },
        data() {
            return {
                activePicIndex:0,
                picList:[
                "https://longyanpc.mmall.com/image/app_longyan.png",
                "https://longyanpc.mmall.com/image/app_longyan.png",
                "https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png",
                "https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png",
                "https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png",
                "https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png"],
                year:1//默认一年
            }
        },
        components:{
            'bb-indep-button':BBIndepButton
        },
        computed:{
            
        },
        created:function(){
            let t=this;
        },
        mounted:function(){
            let t =this;
        },
        methods: {
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //小图片点击事件
            picClick:function(item,index){
                let t=this;
                t.activePicIndex = index;
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
            margin-right:0.64rem;
            .pic{
                height:14.285rem;
                position:relative;
                text-align: center;
                overflow:hidden;
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