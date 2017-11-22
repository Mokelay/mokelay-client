<template>
    <el-transfer
            v-model="bb_value"
            :props="{
                key:itemKey,
                label:itemLabel
            }"
            :data="datas"
            @change="change">
    </el-transfer>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-transfer',
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
            props: {
                type: Object
            },
            ds: {
                type: Object
            }
        },
        data() {
            return {
                bb_value: [],
                datas: []
            }
        },
        created: function () {
            this.getData();
        },
        watch: {
            value(val) {
                this.bb_value = val;
            }
        },
        computed: {},
        methods: {
            getData(node) {
                const t = this;
                if (t.ds) {
                    Util.getDSData(t.ds, {
                        "bb": t,
                        "router": t.$route.params
                    }, function (map) {
                        this.datas = map || [];
                    }, function (code, msg) {
                    });
                } else {
                    this.datas = this.data;
                }
            },
            change(value, direction, movedKeys) {
                const result = {value, direction, movedKeys};
                console.log(result);
                //v-model
                this.$emit('input', value);
                //触发prop change事件
                this.$emit('change', value);
            }
        }
    }
</script>

<style scoped>
</style>