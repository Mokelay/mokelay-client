<template>
    <img :src="src" :style="style"/>
</template>

<script>
    export default {
        name: 'bb-img',
        props: {
            src:{
                type:String
            },
            style:{
                type:Object,
                default:function(){
                    return {}
                }
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