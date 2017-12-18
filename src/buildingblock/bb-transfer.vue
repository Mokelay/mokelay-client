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
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
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
                this.bb_value = val.split(',');
                if (val && this.datas.length) {
                    this.formatData();
                }
            },
            datas(val) {
                if (val.length && this.bb_value.length) {
                    this.formatData();
                }
            }
        },
        computed: {},
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"bb_value");
        },
        methods: {
            getData(node) {
                const t = this;
                if (t.ds) {
                    Util.getDSData(t.ds, {
                        bb: t,
                        router: t.$route.params
                    }, function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t[dataKey] = value;
                        });
                    }, function (code, msg) {
                    });
                } else {
                    this.datas = this.staticData;
                }
            },
            transformResult(val) {
                return val.join(',');
            },
            formatData() { //转换数据格式
                if (typeof this.datas[0][this.itemKey] === 'number') {
                    if (typeof this.bb_value[0] === 'string') {
                        this.bb_value = this.bb_value.map((item) => {
                            return +item;
                        })
                    }
                }
            },
            change(value, direction, movedKeys) {
                const result = this.transformResult(value);
                console.log(result);
                //v-model
                this.$emit('input', result);
                //触发prop change事件
                this.$emit('change', value);
            }
        }
    }
</script>

<style scoped>
</style>