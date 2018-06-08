<template>
    <van-address-list
        v-model="valueBase"
        :list="realList"
        :add-button-text="addButtonText"
        @add="add"
        @edit="edit"
        @select="select"
        ></van-address-list>
</template>

<script>
import AddressList from 'vant/lib/address-list';
import 'vant/lib/address-list/style';

    export default {
        name: 'bb-vant-address-list',
        components: {
          "van-address-list":AddressList
        },
        props: {
            //当前选中地址的 id 支持v-model
            value:{
                type:String
            },
            //底部按钮文字
            addButtonText:{
                type:String
            },
            /*静态地址列表
                [
                    {
                      id: '1',
                      name: '张三',
                      tel: '13000000000',
                      address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
                    },
                    {
                      id: '2',
                      name: '李四',
                      tel: '1310000000',
                      address: '浙江省杭州市拱墅区莫干山路 50 号'
                    }
                ];
            */
            list:{
                type:Array
            },
            //动态地址列表
            listDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.value,
                realList:this.list
            };
        },
        mounted(){
            const t = this;
            t.getData();
        },
        methods: {
            //动态获取地址列表
            getData(){
                const t = this;
                if (t.listDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.listDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.realList = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //新增地址
            add(){
                this.$emit('add');
            },
            //编辑地址 item: 当前地址对象，index: 索引
            edit(item,index){
                this.$emit('edit',item,index);
            },
            //切换选中的地址  item: 当前地址对象，index: 索引
            select(item,index){
                this.$emit('edit',item,index);
            }
        }
    }
</script>

<style scoped>
</style>