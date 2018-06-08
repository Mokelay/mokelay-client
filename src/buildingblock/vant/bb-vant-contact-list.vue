<template>
    <van-contact-list
        v-model="valueBase"
        :list="realList"
        :add-text="addText"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
        />
</template>

<script>
import ContactList from 'vant/lib/contact-list';
import 'vant/lib/contact-list/style';

    export default {
        name: 'bb-vant-contact-list',
        components: {
          "van-contact-list":ContactList
        },
        props: {
            //当前选中联系人的 id  支持  v-model
            value:{
                type:String
            },
            /*静态联系人列表
                [{
                    id:'1',
                    name:'name',
                    tel:'13700000000'
                }]
            */
            list:{
                type:String
            },
            //动态联系人列表
            listDs:{
                type:String
            },
            //添加时的文案提示
            addText:{
                type:String
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
            //动态联系人列表
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
            //点击
            onAdd(){
                this.$emit('add',this);
            },
            //编辑联系人 item: 当前联系人对象，index: 索引
            onEdit(){
                this.$emit('edit',item,index);
            },
            //切换联系人 item: 当前联系人对象，index: 索引
            onSelect(){
                this.$emit('select',item,index);
            }
        }
    }
</script>

<style scoped>
</style>