<template>
    <el-form label-position="left" inline class="demo-table-expand">

    </el-form>
</template>

<script>
    export default {
        name: 'bb-view',
        props: {
            /*静态表单项
                [{
                    alias:''表单项键名
                    aliasName:''表单项名称
                    dt:'string,number,File,image' 值类型
                }]
            */
            fields:{
                type:Array
            },
            /*动态表单项*/
            fieldsDs:{
                type:Object
            },
            /*静态数据
                {   
                    键名：键值
                    alias1:value1,
                    alias2:value2
                }
            */
            data:{
                type:Object
            },
            /*动态数据*/
            dataDS:{
                type:Object
            },
        },
        data() {
            return {
            }
        },
        watch: {
        },
        created: function () {
            const t = this;
        },
        mounted:function(){
        },
        methods: {
            getData: function () {
                const t = this;
                if (t.dataDs) {
                    _TY_Tool.getDSData(t.dataDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t[dataKey] = val.value.list;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            }
        }
    }
</script>
<style lang='less' scoped>

</style>