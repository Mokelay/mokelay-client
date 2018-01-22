<template>
    <div class="bb-bar">
        <bb-read-bb></bb-read-bb>
        <bb-read-bb></bb-read-bb>
        <bb-read-bb></bb-read-bb>
    </div>
</template>

<script>
    export default {
        name: 'bb-bar',
        props: {
            /*
                basicConfig 样式配置
                {
                    logoUrl:'logo图片地址',
                    logoHref:'点击跳转地址'
                    backgroundColor:'':'', 背景色
                    imgWidth:'', 宽度
                    imgHeight:'', 高度
                    fontColor:'', 标题字体颜色
                    fontSize:'',    标题字体大小
                }
            */
            basicConfig:{
                type:Object
            },
            /*
                bbFieldsLeft 左侧积木
                [{
                    bb:'bb-button' || 'bb-dropdown'
                    bbProps:{ //bb:logo
                        url:'logo图片地址',
                        href:'点击跳转地址'
                    }
                }]
            */
            bbFieldsLeft:{
                type:Array
            },
            /*
                bbFieldsMiddle 中间积木
                [{
                    bb:'bb-button' || 'bb-dropdown'
                    bbProps:{}
                }]
            */
            bbFieldsMiddle:{
                type:Array
            },
            /*
                bbFieldsRight 右侧积木
                [{
                    bb:'bb-button' || 'bb-dropdown'
                    bbProps:{}
                }]
            */
            bbFieldsRight:{
                type:Array
            },
           
        },
        data() {
            return {
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
        }
    }
</script>
<style lang='less' scoped>

</style>