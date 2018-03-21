<template>
    <div>
        <bb-cascader placeholder="请选择积木" @change="change" :changeOnSelect="true" :staticOptions="firstOpts" :dsList="dsList" v-model="bb" valueTpl="<%=value[value.length-1]%>"></bb-cascader>
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
        },
        mounted:function(){
             let t=this;
             window.setTimeout(function(){
                t.loadFirstData();
             },500);
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
                t.firstOpts = [{
                    value:"Page_Ref_Root",
                    label:"Root",
                    children:[]
                }];
                //获取根数据
                // const uuidList = window._TY_Root.$refs;

                // console.log("uuidList",uuidList);
                // for(let i in uuidList){
                //     if(uuidList[i]&&uuidList[i]._isVue){//是vue对象
                //         let len = t.firstOpts.length;
                //         t.firstOpts.push({
                //             value:i,
                //             label:uuidList[i].$attrs.aliasName||uuidList[i].$vnode.componentOptions.tag,//获取组件名
                //             children:[]
                //         });
                //     }
                // }
            }
        }
    }
</script>