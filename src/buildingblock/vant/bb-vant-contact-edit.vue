<template>
    <van-contact-edit
        v-model="valueBase"
        :is-edit="option['is-edit']"
        :is-saving="option['is-saving']"
        :is-deleting="option['is-deleting']"
        :tel-validator="telValidator"
        @save="onSave"
        @delete="onDelete"
        />
</template>

<script>
import ContactEdit from 'vant/lib/contact-edit';
import 'vant/lib/contact-edit/style';

    export default {
        name: 'bb-vant-contact-edit',
        components: {
          "van-contact-edit":ContactEdit
        },
        props: {
            /*当前编辑联系人
                {
                    id:'1',
                    name:'name',
                    tel:'13700000000'
                }
            */
            value:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            /*其他属性扩展
                {
                    'is-edit':false, //编辑联系人
                    'is-saving':false, //显示保存按钮加载动画
                    'is-deleting':false //显示删除按钮加载动画
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        'is-edit':false,
                        'is-saving':false,
                        'is-deleting':false
                    };
                }
            },
        },
        data() {
            return {
                valueBase:this.value
            };
        },
        mounted(){
        },
        methods: {
            //手机号格式校验函数
            telValidator(tel){
                return true;
            },
            //保存联系人   content：表单内容
            onSave(content){
                this.$emit('save',content);
            },
            //删除联系人     content：表单内容
            onDelete(content){
                this.$emit('delete',content);
            },
            //外部设置当前编辑联系人信息
            setContact(contact){
                this.valueBase = contact;
            }
        }
    }
</script>

<style scoped>
</style>