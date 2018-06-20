<template>
    <div>
        <van-contact-card
            :type="realName?'edit':'add'"
            :name="realName"
            :tel="realTel"
            :add-text="addText"
            :editable="editable"
            @click="click"
            />

        <!-- 联系人列表 -->
        <van-popup v-model="showList" position="bottom">
            <van-contact-list
                v-model="chosenContactId"
                :list="contactList"
                @add="onAdd"
                @edit="onEdit"
                @select="onSelect"
                />
        </van-popup>

        <!-- 联系人编辑 -->
        <van-popup v-model="showEdit" position="bottom">
            <van-contact-edit
                :contact-info="contact"
                :is-edit="isEdit"
                @save="onSave"
                @delete="onDelete"
                />
        </van-popup>
    </div>
</template>

<script>
import ContactCard from 'vant/lib/contact-card';
import 'vant/lib/contact-card/style';
import ContactList from 'vant/lib/contact-list';
import 'vant/lib/contact-list/style';
import ContactEdit from 'vant/lib/contact-edit';
import 'vant/lib/contact-edit/style';
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';

    export default {
        name: 'bb-vant-contact-card',
        components: {
          "van-contact-card":ContactCard,
          "van-contact-edit":ContactEdit,
          "van-contact-list":ContactList,
          "van-popup":Popup
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
            },
            /*其他属性设置
                {
                  index:1 //当前选中联系人
                  list:[], //静态联系人列表
                  listDs:{} //动态联系人列表
                  addText:"" //添加时的提示文案
                  isEdit:false //编辑联系人
                }
            */
            option:{
                type:Object,
                default:function () {
                    return {
                        index:1,
                        list:[], 
                        listDs:{},
                        addText:"",
                        isEdit:false
                    }
                }
            }
        },
        data() {
            return {
                realName:this.name,
                realTel:this.tel,
                contact:{}, //当前编辑的联系人
                contactList:this.option.list, //当前编辑的联系人
                chosenContactId:this.option.index, //当前选中人的id
                showList:false,
                showEdit:false,
                isEdit:this.option.isEdit
            };
        },
        mounted(){
            const t = this;
            t.getData();
        },
        methods: {
            //点击
            click(){
                this.showList = true;
                this.$emit('click',this);
            },
            //外部设置联系人信息
            setInfo(name,tel){
                this.realName = name;
                this.realTel = tel;
            },
            //手机号格式校验函数
            telValidator(tel){
                return true;
            },
            //保存联系人   content：表单内容
            onSave(contact){
                this.showEdit = false;
                this.showList = false;
                this.$emit('save',contact);
                this.realName = contact.name;
                this.realTel = contact.tel;
                this.contactList.push(contact);

            },
            //删除联系人     content：表单内容
            onDelete(content){
                this.$emit('delete',content);
                this.showEdit = false;
            },
            //外部设置当前编辑联系人信息
            setContact(contact){
                this.valueBase = contact;
            },
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
                this.isEdit = false;
                this.showEdit = true;
                this.$emit('add',this);
            },
            //编辑联系人 item: 当前联系人对象，index: 索引
            onEdit(contact,index){
                this.isEdit = true;      
                this.showEdit = true;
                this.$emit('edit',contact,index);
                this.contact = contact;
            },
            //切换联系人 item: 当前联系人对象，index: 索引
            onSelect(contact,index){
                this.showList = false;
                this.$emit('select',contact,index);
                this.realName = contact.name;
                this.realTel = contact.tel;
            }
        }
    }
</script>

<style scoped>
</style>