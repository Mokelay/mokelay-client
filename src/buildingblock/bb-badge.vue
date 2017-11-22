<template>
    <el-badge :is-dot="isDot" :value="showValue" class="item" :hidden="hidden"><span>{{text}}</span></el-badge>
</template>
<script>
    export default {
        name: 'bb-badge',
        props: {
            value: {
                type: [Number, String, Boolean],
                default: null
            },
            text: {
                type: String,
            }
        },
        data() {
            return {
                baseValue: this.value,
                hidden: !Boolean(this.value)
            };
        },
        computed: {
            isDot: function () {
                var p_value = (typeof eval(this.baseValue) === 'boolean') ? eval(this.baseValue) : false;
                return p_value;
            },
            showValue: function () {
                var p_value = (typeof eval(this.baseValue) === 'boolean') ? '' : this.baseValue;
                return p_value;
            }
        },
        created: function () {
        },
        methods: {
            hide: function () {
                this.baseValue = null;
                this.hidden = true;
            },
            buildValue(val){
                const t=this;
                this.baseValue = val;
//                this.showValue = (typeof eval(this.baseValue) === 'boolean') ? '' : this.baseValue;
                if(val){
                    this.hidden = false;
                }
            }
        },
    }
</script>
<style>
    .item .el-badge__content {
        right: 0px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
    }
</style>