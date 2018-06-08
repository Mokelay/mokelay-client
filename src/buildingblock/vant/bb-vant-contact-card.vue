<template>
    <van-contact-card
        :type="realName?'edit':'add'"
        :name="realName"
        :tel="realTel"
        :add-text="addText"
        :editable="editable"
        @click="click"
        />
</template>

<script>
import ContactCard from 'vant/lib/contact-card';
import 'vant/lib/contact-card/style';

    export default {
        name: 'bb-vant-contact-card',
        components: {
          "van-contact-card":ContactCard
        },
        props: {
            // //类型 add edit
            // cardType:{
            //     type:String
            // },
            //联系人姓名
            name:{
                type:String
            },
            //联系人手机号
            tel:{
                type:String
            },
            //添加时的文案提示
            addText:{
                type:String
            },
            //是否可编辑
            editable:{
                type:Boolean,
                default:true
            }
        },
        data() {
            return {
                realName:this.name,
                realTel:this.tel
            };
        },
        mounted(){
        },
        methods: {
            //点击
            click(){
                this.$emit('click',this);
            },
            //外部设置联系人信息
            setInfo(name,tel){
                this.realName = name;
                this.realTel = tel;
            }
        }
    }
</script>

<style scoped>
</style>