<template>
    <div>
        <el-input v-model="p_value" placeholder="请选择" :disabled="true" class="wa"></el-input>
        <el-button @click="choose"><i class="el-icon-search"></i></el-button>
        <el-button @click="p_value=''" class="ml0"><i class="el-icon-delete"></i></el-button>
        <bb-dialog :isShow.sync="popupVisible">
            <bb-icon :ds="ds" ref="icon" @icon-click="iconClick"></bb-icon>
        </bb-dialog>
    </div>
</template>


<script>
    import Vue from 'vue';
    import Util from '../libs/util.js'

    import bbdialog from '../buildingblock/elementui/bb-dialog.vue';
    import bbicon from './bb-icon.vue';

    import {
            Input,
            Button
    } from 'element-ui'
    Vue.use(Input);
    Vue.use(Button);

    export default {
        name: 'bb-icon-select',
        components:{
            "bb-dialog":bbdialog,
            "bb-icon":bbicon
        },
        props: {
            value: {
                type: String
            },
            ds: {
                type: Object
            }
        },
        data() {
            return {
                p_value: this.value,
                popupVisible:false
            }
        },
        watch: {
            value: function (val) {
                this.p_value = val;
            }
        },
        computed: {},
        created: function () {
        },
        mounted: function () {
            const t = this;
        },
        methods: {
            choose(){
                const t = this;
                t.popupVisible = true;
                // require.ensure(["art-dialog"],function(require){
                //     var _form = new Vue({
                //         router: t.$router,
                //         render: function(createElement){
                //             return createElement('bb-icon',{
                //                 props:{
                //                     ds:t.ds
                //                 },
                //                 on:{
                //                     "icon-click": function(data){
                //                         t.p_value = data;
                //                         t.$emit('input', data);
                //                         t.dialog.close().remove();
                //                         t.dialog = null;
                //                     }
                //                 },
                //                 ref:"icon"
                //             },[]);
                //         }
                //     }).$mount();

                //     var dialog = require('art-dialog');
                //     var d = dialog({
                //         width:800,
                //         // zIndex:2100,
                //         // height:'100%',
                //         title: '选择图标',
                //         content: _form.$el,
                //         onclose: function() {
                //             if (t.dialog) {
                //                 t.dialog.close().remove();
                //                 t.dialog = null;
                //             }
                //         }
                //     });
                //     d.showModal();
                //     t.dialog = d;
                // },'art-dialog');
            },
            iconClick:function(data){
                const t = this;
                t.p_value = data;
                t.$emit('input', data);
                t.popupVisible = false;
            }
        }
    }
</script>

<style scoped>
    .wa {
        width: auto;
    }

    .ml0 {
        margin-left: 0;
    }
</style>