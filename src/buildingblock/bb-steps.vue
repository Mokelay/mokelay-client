<template>
    <div>
        <el-steps :space="space" :active="active" center>
            <el-step v-for="step in steps" :title="step.title" :description="step.description" :key="step.title">
            </el-step>
        </el-steps>
        <!-- <bb-page v-if="steps[active] && steps[active].pageAlias" :pageAlias="steps[active].pageAlias"></bb-page> -->
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
                    return [];
                }
            }
        },
        data() {
            return {
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