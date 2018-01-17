<template>

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
                        title:'投票标题',
                        voteType:'words',
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
            }
        },
        computed:{
        },
        watch: {
        },
        mounted:function(){
        },
        methods: {
            //提交投票 事件 commit
            //选中选项 事件 select
        }
    }
</script>
<style lang='less' scoped>
</style>