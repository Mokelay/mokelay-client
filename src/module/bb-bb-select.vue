<template>
    <div>
        <bb-cascader placeholder="请选择积木" @change="change" :changeOnSelect="true" :staticOptions="firstOpts" :dsList="dsList" v-model="bb"></bb-cascader>
    </div>
</template>

<script>
    export default {
        name: 'bb-bb-select',
        props: {
            value:{
                type:[String,Object,Array]
            }
        },
        data() {
            return {
                bb:this.value,
                firstOpts:[],//第一层数据
                dsList:[{
                  type:'method',                        //级联数据获取方式  接口获取
                  index:-1,                              //级联第几层接口，比如第一层数据的获取接口   -1表示无限级联
                  method:'loadChildBB',                //获取数据的方法名
                  props:{                               //方法返回字段和级联选择器的字段对应（字段名转换）
                    value:'uuid',
                    label:'name',
                    children:'children'
                  }
                }]
            }
        },
        watch: {
        },
        created: function () {
            let t=this;
            t.loadFirstData();
        },
        mounted:function(){
        },
        methods: {
            change(value){
                let t=this;
                console.log("change value:",value);

                t.$emit('change',value);
                t.$emit('input',value);
            },
            loadFirstData(){
                let t=this;
                t.firstOpts = [];
                //获取根数据
                const uuidList = window._TY_Root.$refs;
                for(let i in uuidList){
                    t.firstOpts.push({
                        value:i,
                        label:uuidList[i].$attrs.aliasName||uuidList[i].$vnode.componentOptions.tag,//获取组件名
                        children:[]
                    });
                }
            }
        }
    }
</script>