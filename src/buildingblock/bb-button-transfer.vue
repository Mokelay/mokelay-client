<template>
    <div>
        <el-popover
                width="400"
                placement="right"
                trigger="click"
                ref="popover"
        >
            <el-transfer
                    v-model="bb_value"
                    :itemKey="itemKey"
                    :itemLabel="itemLabel"
                    :ds="ds"
                    :staticData="staticData">
            </el-transfer>
            <el-button class="fr mt20" type="primary" @click="commit">确定</el-button>
        </el-popover>
        <el-input class="wa" placeholder="请选择" disabled v-model="bb_value"></el-input>
        <el-button v-popover:popover><i class="el-icon-search"></i></el-button>
        <el-button class="ml0" @click="bb_value = []"><i class="el-icon-delete"></i></el-button>
    </div>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-button-transfer',
        props: {
            value: {
                type: Array
            },
            itemKey: {
                type: String,
                default: 'key'
            },
            itemLabel: {
                type: String,
                default: 'label'
            },
            staticData: {
                type: Array
            },
            ds: {
                type: Object
            }
        },
        data() {
            return {
                bb_value: []
            }
        },
        created: function () {

        },
        watch: {
            value(val) {
                this.bb_value = val;
            }
        },
        computed: {},
        methods: {
            commit() {
                //v-model
                this.$emit('input', this.bb_value);
                //触发prop change事件
                this.$emit('change', this.bb_value);

                this.$refs.popover.doClose();
            },
            change(value) {
                console.log(value);
                //v-model
                this.$emit('input', value);
                //触发prop change事件
                this.$emit('change', value);
            }
        }
    }
</script>

<style scoped>
    .wa {
        width: auto;
    }

    .ml0 {
        margin-left: 0;
    }

    .fr {
        float: right;
    }

    .mt20 {
        margin-top: 20px;
    }
</style>