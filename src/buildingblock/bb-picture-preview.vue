<template>
    <div v-if="list && list.length > 0" class="pic_preview_bb">
        <div @click="taggleShow">
            <div class="pic_min" ><img :src="list[0]"></div>
            <div class="pic_min" v-if="list.length == 2"><img :src="list[1]"></div>
            <div class="pic_min" v-else-if="list.length > 2"><span class="pic_des">共有{{list.length}}张照片</span></div>
        </div>
        <bb-dialog :isShow="isShow" @closeDia="taggleShow" title="照片预览">
            <div class="pic_content">
                <el-row>
                    <el-col :span="14">
                        <div class="pic_preview">
                            <img :src="list[current]" alt="">
                            <span class="pic_index">{{current+1 +'/'+list.length}}</span>

                            <el-button class="pic_arrow_left" icon="arrow-left" @click="pic_arrow_left"></el-button>
                            <el-button class="pic_arrow_right" icon="arrow-right" @click="pic_arrow_right"></el-button>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="pic___right">
                            <template v-for="(s, index) in list">
                                <a href="javascript:;" @click="handleFn(index)">
                                    <img :src="s" alt="">
                                </a>
                            </template>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </bb-dialog>
    </div> 
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'bb-picture-preview',
        props: {
            imgList:{
                type: [Array,String],
                default:function(){
                    return null
                }
            }
        },
        data() {
            return {
                current: 0,
                isShow:false
            }
        },
        computed: {
            list: function() {
                const t = this;
                if(t.imgList && typeof t.imgList == 'string'){
                    const newArr = t.imgList.split(',');
                    return newArr;
                }else if(t.imgList){
                    return t.imgList;
                }
            }
        },
        methods: {
            handleFn(index) {
                this.current = index;
            },
            pic_arrow_left:function(){
                this.current = this.current == 0?this.list.length - 1:this.current - 1
            },
            pic_arrow_right:function(){
                this.current = this.current < this.list.length - 1?this.current + 1:0
            },
            taggleShow:function(){
                this.isShow = !this.isShow
            }
        }
    }
</script>

<style lang="less">
    .pic_preview_bb{
        display: flex;
        padding: 10px 0px;
    }
    .pic_content{
        img{
            position: absolute;
            margin: auto;
            top: 0;
            bottom:0;
            left:0;
            right:0;
            max-width: 100%;
            max-height: 100%;
        }
    }
    .pic_preview{
        height: 400px;
        //width: 400px;
        position: relative;
        z-index: 1;
    }
    .pic___right {
        height: 400px;
        margin-left: 20px;
        position: relative;
        a {
            display: block;
            float: left;
            margin: 0 10px;
            margin-bottom: 20px;
            width: 80px;
            height: 80px;
            position: relative;
        }
        a:focus{
            border: 2px solid #0091EA;
        }
    }
    .pic_index{
        opacity: 0.4;
        background: #000000;
        border-radius: 10px;
        font-family: '.PingFangSC-Regular';
        font-size: 12px;
        color: #FFFFFF;
        padding: 4px 5px;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 2;
    }
    .pic_arrow_left{
        left: 0;
    }
    .pic_arrow_right{
        right:0;
    }
    .pic_arrow_left,.pic_arrow_right{
        position: absolute;
        margin: auto;
        top: 0;
        bottom:0;
        max-width: 100%;
        max-height: 100%;
        background: rgba(0,0,0,0.40);
        color: #fff;
        z-index: 2;
        width: 40px;
        height: 40px;
    }
    .pic_arrow_left:hover,.pic_arrow_right:hover{
        background: rgba(0,0,0,0.40);
    }
    .pic_min{
        flex-grow: 1;
        display: inline-block;
        width: 60px;
        height: 100%;
        position: relative;
        flex:1;
        float: left;
        margin-right: 10px;
        .pic_des{
            border: 1px dashed #E4E4E4;
            display: inline-block;
            width: 100%;
            height: 100%;
            font-family: 'PingFangSC-Regular';
            font-size: 12px;
            color: #666666;
            position: absolute;
            left: 0;
            top: 0;
            padding: 11px;
            line-height: 16px;

        }
        img{
            height: 60px;
            width: 60px;
            max-width: 100%;
            max-height: 100%;
            vertical-align: middle;
        }
    }
</style>