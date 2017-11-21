<template>
    <el-button-group>
        <bb-button v-for="(button,index) in buttons" :key="button.text" :button="button.button"></bb-button>
    </el-button-group>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-button-group',
        props: {
            buttons:{
                type: Array,
                default:function(){
                    return [{
                        type:'primary',
                        text:'初始化按钮',
                        button:{
                            type:'primary',
                            text:'初始化按钮',
                        }
                    }]
                }
            }
        },
        data() {
            return {
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {}
    }
</script>