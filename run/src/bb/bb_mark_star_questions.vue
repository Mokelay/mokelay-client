<template>
    <div class="markStarQuestions">
        <div class="title">{{title}}</div>
        <div class="options">
            <div class="starArea" v-for="(value, index) in options" :key="index">
                <div class="timu">{{value.timu}}</div>
                <span class="star" v-for="v in value.totalScore" :key="v">
                    <img src="./img/choose.png" />
                </span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "bb_mark_star_questions",
    props: {
        title: {
            type: String,
            default: '打星题',
        },
        // totalScore: {
        //     type: Number,
        //     default: 1,
        // },
        options: {
            type: Array,
            // default: [{
            //     timu: '题目一',
            //     totalScore: 5,
            // }, {
            //     timu: '题目二',
            //     totalScore: 7,
            // }],
            default: function(){
                return [{
                timu: '题目一',
                totalScore: 1,
            }]
            }
        }
    },
    data(){
        return{}
    }
}
</script>
<style lang="less" scoped>
.markStarQuestions{
    width: 100%;
    margin-top: 10px;
    padding-bottom: 6px;
    border: 1px solid #e4e4e4;
    box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
    -moz-box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.10);
    .title{
        width: 100%;
        line-height: 36px;
        padding-left: 20px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #444444;
    }
    .options{
        width: 100%;
        padding-left: 20px;
        .starArea{
            .timu{
                line-height: 36px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #666666;
                width: 100%;
                padding-left: 6px;
            }
            .star{
                img{
                    width: 20px;
                    height: 20px;
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>