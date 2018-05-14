<template>
    <div class="m10">
        <h3 v-if="h1" class="title">{{h1}}</h3>
        <el-breadcrumb separator="/" >
            <el-breadcrumb-item v-for="field in fields" :key='field.name' :to="{path:field.path}" >{{field.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: 'bb-breadcrumb',
        props: {
            fields:{
                type:Array,
                default:function(){
                    []
                }
            },
            h1:{
                type:String,
            }
        },
        watch: {
        },
        computed: {},
        data() {
            return {}
        },
        created: function () {
            
        },
        methods: {
        }
    }
</script>
<style scoped>
    .m10{
        margin: 10px;
    }
    .title{
        font-family: '.PingFangSC-Medium';
        font-size: 16px;
        color: #444444;
        line-height: 40px;
    }
</style>