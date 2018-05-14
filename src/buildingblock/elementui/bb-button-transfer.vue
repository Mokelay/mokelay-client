<template>
    <div>
        <el-popover
                width="524"
                placement="right"
                trigger="click"
                ref="popover">
            <bb-transfer
                    v-model="bb_value"
                    :itemKey="itemKey"
                    :itemLabel="itemLabel"
                    :ds="ds"
                    :staticData="staticData"
                    @change="transferChange">
            </bb-transfer>
            <el-button class="fr mt20" type="primary" @click="commit">确定</el-button>
        </el-popover>
        <el-input class="wa" placeholder="请选择" disabled v-model="bb_input_text" @change="change"></el-input>
        <el-button v-popover:popover><i class="el-icon-search"></i></el-button>
        <el-button class="ml0" @click="clear"><i class="el-icon-delete"></i></el-button>
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
                bb_input_text: '',
                bb_value: ''
            }
        },
        created: function () {

        },
        methods: {
            commit() {
                //v-model
                this.$emit('input', this.bb_value);

                this.$refs.popover.doClose();
            },
            transferChange(keys, text) {
                this.bb_input_text = text.join(',');
            },
            change(value) {
                //触发prop change事件
                this.$emit('change', value);
            },
            clear() {
                this.bb_value = '';
                this.bb_input_text = '';
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