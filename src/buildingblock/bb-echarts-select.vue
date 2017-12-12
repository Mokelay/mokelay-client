<template>
    <div>
        <bb-button-form :fields="fields" settingText="设置图表公共参数" v-model="ds"></bb-button-form>
    </div>
</template>

<script>
    export default {
        name: 'bb-echarts-select',
        props: {
            value:{
                type:Object
            }
        },
        data() {
            return {
                fields:[
                    {name:'宽度',attributeName:'width',et:'bb-input',props:{}},
                    {name:'高度',attributeName:'height',et:'bb-input',props:{}},
                    {name:'显示提示框',attributeName:'tooltip-visible',et:'bb-editor-switch',props:{value:true}},
                    {name:'显示图例',attributeName:'legend-visible',et:'bb-editor-switch',props:{value:true}},
                    {name:'图例显示位置',attributeName:'legend-position',et:'bb-input',props:{fields:[{text:'左',value:'left'},{text:'顶部',value:'top'},{text:'右',value:'right'},{text:'底部',value:'bottom'}]}},
                    {name:'网格配置',attributeName:'grid',et:'bb-editor-code',props:{}},
                    {name:'为图表绑定事件',attributeName:'events',et:'bb-editor-code',props:{}},
                    {name:'对数据提前进行额外的处理',attributeName:'before-config',et:'bb-editor-code',props:{}},
                    {name:'对生成好的echarts配置进行额外的处理',attributeName:'after-config',et:'bb-editor-code',props:{}},
                    {name:'加载中',attributeName:'loading',et:'bb-editor-switch',props:{value:false}},
                    {name:'暂无数据状态',attributeName:'data-empty',et:'bb-editor-switch',props:{value:false}},
                    {name:'处理生成图表时的宽度问题',attributeName:'judge-width',et:'bb-editor-switch',props:{value:false}},
                    {name:'容器宽度变化的延迟',attributeName:'width-change-delay',et:'bb-input-number',props:{value:300}},
                ],
                ds:this.value
            }
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.ds = val;
                } else if (typeof val === 'string') {
                    this.ds = (val ? JSON.parse(val) : {});
                }
                this.$emit("input",val);
            },
            ds(val){
                this.$emit("input",val);
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
        }
    }
</script>