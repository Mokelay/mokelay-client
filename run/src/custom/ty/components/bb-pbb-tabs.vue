<template>
    <el-tabs type="card" active-name="attribute">
        <el-tab-pane label="属性" name="attribute">
            <bb-form :fields="attrDescribeList" v-model="attributesDate" @commit="commit"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="交互" name="event">
            <bb-pbb-interactive :pbbId="pbbId" :pageAlias="pageAlias" :bb="bb"></bb-pbb-interactive>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    import bbPbbInteractive from './bb-pbb-interactive.vue';
    export default {
        name: 'bbPbbTabs',
        props: {
            pbbId: {
                type: Number
            },
            pageAlias: {
                type: String
            },
            bb: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            fields:{
                type: Array
            },
            attrDescribeList:{
                type: Array
            },
            value:{
                type: [Object,String]
            }
        },
        watch: {
            value(val){
                this.attributesDate=val;
            }
        },
        data(){
            return {
                attributesDate:this.value
            }
        },
        computed: {},
        components: {
            'bb-pbb-interactive': bbPbbInteractive
        },
        methods: {
            commit:function(){
                const t = this
                t.$emit('commit', t.attributesDate);
            }
        }
    }
</script>
