<template>
    <div>
        <el-popover
                width="500"
                placement="right"
                trigger="click"
                ref="popover"
        >
            <bb-transfer
                    v-model="bb_value"
                    :itemKey="itemKey"
                    :itemLabel="itemLabel"
                    :ds="ds"
                    :staticData="staticData"
            >
            </bb-transfer>
            <bb-button class="fr mt20" type="primary" @click="commit">确定</bb-button>
        </el-popover>
        <el-input class="wa" placeholder="请选择" disabled v-model="bb_input_value" @change="change"></el-input>
        <bb-button type="text" v-popover:popover><i class="el-icon-search"></i></bb-button>
        <bb-button type="text" class="ml0" @click="clear"><i class="el-icon-delete"></i></bb-button>
    </div>
</template>

<script>

    export default {
        name: 'bb-button-transfer',
        props: {
            value: {
                type: [String, Number]
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
                bb_input_value: '',
                bb_value: ''
            }
        },
        created: function () {

        },
        watch: {
            value(val) {
                this.bb_input_value = val;
                this.bb_value = val;
            }
        },
        methods: {
            commit() {
                this.bb_input_value = this.bb_value;
                //v-model
                this.$emit('input', this.bb_input_value);

                this.change(this.bb_input_value);

                this.$refs.popover.doClose();
            },
            change(value) {
                //触发prop change事件
                this.$emit('change', value);
            },
            clear() {
                this.bb_input_value = '';
                this.bb_value = '';
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