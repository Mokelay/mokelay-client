<template>
    <div>
        <el-steps :space="realSpace" :active="p_active" :align-center="alignCenter">
            <el-step v-for="step in p_steps" :title="step.title" :description="step.description" :key="step.title">
            </el-step>
        </el-steps>
        <bb-read-bb :fields="p_steps[p_active-1].fields"></bb-read-bb>
    </div>
</template>

<script>

    export default {
        name: 'bb-steps',
        props: {
            space: {
                type: Number,
                default: 200
            },
            active: {
                type: Number,
                default: 1
            },
            steps: {
                type:Array,
                default:function(){
                    return [{fields:null,title:'初始化标题',description:'初始化描述'}];
                }
            },
            alignCenter:{
                type:Boolean,
                default:true
            },
            //动态和静态数据源
            ds:{
                type:Object
            }
        },
        data() {
            return {
                p_steps:this.steps,
                p_active:this.active
            }
        },
        computed: {
            realSpace: function () {
                let space = this.space;
                if(this.alignCenter){
                    space = null
                }
                return space
            }
        },
        created: function () {
            this.getData();
        },
        mounted:function(){
            const t = this;
            t.$on('nextStep',t.getData);
        },
        methods: {
            getData: function () {
                var t = this;
                if (this.ds) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        t.ds.type = t.ds.type?t.ds.type:"dynamic";
                        if(t.ds.type == "dynamic"){
                          map.forEach(function (item) {
                            var list;
                            if(item['value']&&item['value']['list']){
                              list = item['value']['list'];
                            }else{
                              list = item['value'];
                            }
                            t.p_steps = [];
                            for (var i in list) {
                                var ele = list[i][t.valueField];
                                if(typeof(list[i][t.valueField]) != 'string'){
                                  ele = JSON.stringify(list[i][t.valueField])
                                }
                                let option = {
                                  value:ele,
                                  text:list[i][t.textField]+(t.showValue?"("+ele+")":"")
                                }
                                t.p_steps.push(option);
                            }
                            t.totalItems = item['value']['totalRecords'];
                          });
                        }else{
                          t.p_steps = map;
                        }
                        t.loading = false;
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            next: function() {
                if (this.p_active++ > (this.p_steps.length)) this.p_active = 1;
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>