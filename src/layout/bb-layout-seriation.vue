<template>
</template>
<script>
// 顺序排列布局
    export default {
        name: 'bb-layout-seriation',
        render: function (createElement) {
            
        },
        props: {
            value:{
                type:Object,
                default:function(){
                    return {
                        layoutObject:{},
                        content:[],
                        interactives:[]
                    }
                }
            }
        },
        data() {
            return{
            }
        },
        methods: {
        },
        components:{
        }
    }
</script>
<style lang="less">
</style>