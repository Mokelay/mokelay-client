<template>
    <div>
        <el-steps :space="realSpace" :active="p_active" :align-center="alignCenter">
            <el-step v-for="step in steps" :title="step.title" :description="step.description" :key="step.title">
            </el-step>
        </el-steps>
        <bb-read-bb :fields="steps[p_active-1].fields" ></bb-read-bb>
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
            }
        },
        data() {
            return {
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
                
            },
            next: function() {
                if (this.p_active++ > (this.steps.length)) this.p_active = 1;
            },
            loadChildBB(){
                let t=this;
                return [{
                    uuid:1,
                    name:'测试1',
                    isleaf:true
                },{
                    uuid:'pbb_2219',
                    name:'测试2',
                    isleaf:false
                }]
            }
        }
    }
</script>