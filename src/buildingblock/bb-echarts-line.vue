<template>
    <div id="bb-echarts-line"></div>
</template>
<script>
    import Vue from 'vue'
    export default {
        name: 'bb-echarts-line',
        props: {
            publicConfig:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            rows:{
                type:Array
            },
            columns:{
                type:Array
            },
            settings:{
                type:Object
            },
            columnsDs:{
                type:Object
            },
            dataDs:{
                type:Object
            },
        },
        data() {
            return{
                realColumns:null,
                realRow:null
            }
        },
        created: function () {
            this.realColumns = this.columns;
            this.realRow = this.rows;
            this.getData();
            this.renderCahrts();
        },
        mounted: function () {
        },
        methods: {
            getData: function () {
                var t = this;
                if (t.dataDs) {
                    _TY_Tool.getDSData(t.dataDs, {"bb": t, "router": t.$route.params}, function (map) {
                        map.forEach((val,key)=>{
                           const dataKey = val.dataKey
                            t[dataKey] = val.value.list;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            renderCahrts:function(){
                const t = this;
                require.ensure([],function(require){
                    let veLine = require('v-charts/lib/line')
                    let _form = new Vue({
                        router: t.$router,
                        render: function(createElement){
                            const charts = createElement('ve-line',{
                                props:Object.assign(t.publicConfig,{
                                        data:{columns:t.realColumns,rows:t.realRow},
                                        settings:t.settings
                                    }),
                                on:{},
                                ref:"ve-line"
                            },[]);
                            return createElement('div',{class:''},[charts])
                        },
                        components:{"ve-line":veLine}
                    }).$mount('#bb-echarts-line');
                })
            }
        }
    }
</script>