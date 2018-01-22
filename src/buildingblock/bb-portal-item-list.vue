<template>
    <div class="bb-portal-item-list">
    </div>
</template>

<script>
    export default {
        name: 'bb-portal-item-list',
        props: {
            /*
                fields 静态数据源
                [{
                    url:'', 图片地址
                    title:'',标题
                    subTitle:'',副标题
                    actionConfig:{  //点击后执行的动作
                        action: url || execute-ds || dialog-page || code || buzz
                        url:''  //action: url 
                        urlType:'default' || 'openWindow'
                        ds:{}  //action: execute-ds
                        dialogPage:'' //action: dialog-page
                        method:fn //action: code
                        buzz:'' //action: buzz
                    }
                }]
            */
            fields:{
                type:Array
            },
            /*
                fieldsDs 动态数据源
            */
            fieldsDs:{
                type:[Object,String]
            },
            /*
                dropdownConfig 下拉菜单配置
                [{
                    dropdown:true || false  是否显示下拉菜单
                    fields:[{ //下拉菜单项
                        title:'编辑', //下拉菜单子项标题
                        actionConfig:{  //下拉菜单子项执行动作
                            action: url || execute-ds || dialog-page || code || buzz
                            url:''  //action: url 
                            urlType:'default' || 'openWindow'
                            ds:{}  //action: execute-ds
                            dialogPage:'' //action: dialog-page
                            method:fn //action: code
                            buzz:'' //action: buzz
                        }
                    }]
                }]
            */
            /*
                styleConfig 样式配置
                {
                    imgWidth:'', 图片宽度
                    imgHeight:'', 图片高度
                    fontColor:'', 标题字体颜色
                    fontSize:'',    标题字体大小
                }
            */
            styleConfig:{
                imgWidth:'',
                imgHeight:'',
                fontColor:'',
                fontSize:'',
            }

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
            //事件 button-finish  点击图片由bb-button 触发触发
        }
    }
</script>
<style lang='less' scoped>

</style>