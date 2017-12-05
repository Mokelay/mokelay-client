<template>
    <div>
        <el-steps :space="realSpace" :active="active" :align-center="alignCenter">
            <el-step v-for="step in steps" :title="step.title" :description="step.description" :key="step.title">
            </el-step>
        </el-steps>
        <bb-read-bb :fields="steps[active-1].fields" ></bb-read-bb>
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
                //TODO 用于测试互动，后面可以删除
                if (this.active++ > 2) this.active = 0;
            }
        }
    }
</script>