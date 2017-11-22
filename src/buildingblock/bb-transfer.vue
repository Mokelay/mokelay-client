<template>
    <el-transfer
            v-model="bb_value"
            :props="props"
            :data="datas">
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
            props: {
                type: Object
            },
            ds: {
                type: Object
            }
        },
        data() {
            return {
                bb_value: '',
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
            }
        }
    }
</script>

<style scoped>
</style>