<template>
    <div class="bb-layout">
        <div class="bb-layout-topbar"><el-button type="primary" @click="commit">提交</el-button></div>
        <el-row class='bb-layout-content'>
            <el-col :span="3"><tool :value="value" @addBB="addBB"></tool></el-col>
            <el-col :span="previewWidth"><preview :value="value" @edit="editItem" @removeBB="removeBB" @updateBBLayout="updateBBLayout"></preview></el-col>
            <el-col :span="editWidth" v-if="showEdit"><edit :value="editValue" :content="value.content" @updateBBAttributes="updateBBAttributes" @addInteractive="addInteractive" @removeInteractive="removeInteractive"></edit></el-col>
        </el-row>
    </div>
</template>
<script>
/**
使用场景
1. 直接使用 
<bb-layout></bb-layout>

2. 初始化layout数据
<bb-layout :value="{
    layoutObject:{title:''},
    content:[{uuid:'',alias:'',aliasName:'',attributes:{},layout:""}],
    interactives:[{uuid:'',fromContentUUID:'',fromContentEvent:'',executeContentUUID:'',executeContentMethodName:''}]}"></bb-layout>

3. 把积木数据能够保存后端
<bb-layout ref="layout"
    @addBB="addBB"
    @removeBB="removeBB"
    @updateBBAttributes="updateBBAttributes" 
    @updateBBLayout="updateBBLayout"
    @addInteractive="addInteractive"
    @removeInteractive="removeInteractive"
    @commit = "commit"
    ></bb-layout>

//uuid为bb中内部生成的uuid
//alias 为添加的BB别名
//layout为布局，如果没有定下布局也可以传空，当有更新的时候使用updateBBLayout
addBB = function(uuid,alais,layout){
    //调用后台保存布局中的BB接口
}

//uuid为bb中内部生成的uuid
removeBB = function(uuid){
    //调用后台删除布局中的BB的接口
}

//uuid为bb中内部生成的uuid
updateBBAttributes = function(uuid,attributes){
    //调用后台接口保存
}

//uuid为bb中内部生成的uuid
updateBBLayout = function(layout){
    //调用后台接口保存
}

//interactive对象结构参考 value中的interactives
addInteractive = function(interactive){
    //调用后台添加交互接口
}

//uuid为interactive的uuid
removeInteractive = function(uuid){
    //调用后台删除交互接口
}

//value为bb-layout的vlaue，当点击保存的时候获取到
commit = function(value){
    //全局保存，如果业务已经实现上述6个event，基本commit就不用调后台接口了
    //如果没有实现上述6个event，那只需要实现这个commit就可以全局保存了
}


当然通过 vue.$refs.layout.value 也可以获取到最新的布局数据
**/

    import tool from './module/bb-tool.vue'
    import preview from './module/bb-preview.vue'
    import edit from './module/bb-edit-attribute.vue'
    export default {
        name: 'bb-layout',
        props: {
            value:{
                type:Object,
                default:function(){
                    return {
                        layoutObject:{},
                        content:[],
                        interactives:[]
                    }
                }
            }
        },
        data() {
            return{
                showEdit:false,
                previewWidth:21,
                editWidth:0,
                editValue:null,//当前编辑的积木
                layoutArray:null//排序数组用于更新排序
            }
        },
        methods: {
            addBB:function(bbItem){//添加积木
                this.value.content.push(bbItem);
                this.hideEditor();
                this.$emit('addBB',bbItem.uuid,bbItem.alias,bbItem.layout)
            },
            updateBBLayout:function(bbItem){//更新layout
                const t = this;
                //初始化排序数组
                if(!t.layoutArray){
                    t.getLayoutArray();
                }
                let index1 = 0;
                let index2 = 0;
            
                t.layoutArray.forEach((val,key)=>{
                    if(bbItem.el.id == val.uuid){
                        index1 = key;
                    }
                    if(bbItem.sibling && bbItem.sibling.id == val.uuid){
                        index2 = key;
                    }
                });
                if(!bbItem.sibling){
                    index2 = t.layoutArray.length;
                }
                //更新layoutArray数组
                t.layoutArray = t.swapItems(t.layoutArray,index1,index2);
                //更新value.content中的排序
                let newContent = [];
                t.layoutArray.forEach((val,index)=>{
                    val.layout = index;
                    t.value.content.forEach((ele,key)=>{
                        if(val.uuid == ele.uuid){
                            ele.layout = index;
                            newContent.splice(index,0,ele);
                        }
                    })
                })
                t.value.content = newContent;
                t.$emit('updateBBLayout',t.layoutArray)
            },
            editItem:function(bbItem){//编辑积木属性
                const t = this;
                const bbInteractive = [];
                t.value.interactives.forEach((val,key)=>{//读取当前积木交互数据
                    if(val.fromContentUUID == bbItem.uuid){
                        bbInteractive.push(val);
                    }
                })
                t.editValue = {
                    uuid:bbItem.uuid,
                    alias:bbItem.alias,
                    aliasName:bbItem.aliasName,
                    attributes:bbItem.attributes,
                    layout:bbItem.layout,
                    interactive:bbInteractive
                }
                t.showEditor();
            },
            removeBB:function(bbItem){//删除积木
                const t = this;
                t.value.content.forEach((val,key)=>{
                    if(val.uuid == bbItem.uuid){
                        t.value.content.splice(key,1);//更新value
                    }
                })
                t.hideEditor();
                t.$emit('removeBB',bbItem.uuid)
            },
            updateBBAttributes:function(uuid,attributes){//更新积木属性
                const t = this;
                t.hideEditor();
                const content = t.value.content;
                t.value.content = [];
                content.forEach((val,key)=>{
                    if(val.uuid == uuid){
                        val.attributes = attributes;
                    }
                });
                t.value.content = content;
                t.$emit('updateBBAttributes',uuid,attributes);
            },
            addInteractive:function(formData){//添加交互
                const t = this;
                t.value.interactives.push(formData);//更新value
                t.$emit('addInteractive',formData);
            },
            removeInteractive:function(uuid){//删除交互
                const t = this;
                t.value.interactives.forEach((val,key)=>{
                    if(val.uuid == uuid){
                        t.value.interactives.splice(key,1);
                    }
                })
                t.$emit('removeInteractive',uuid);
            },
            commit:function(){//删除交互
                const t = this;
                t.hideEditor();
                t.$emit('commit',t.value);
            },
            showEditor:function(){
                const t = this;
                t.previewWidth = 15;
                t.editWidth = 6;
                t.showEdit = true;
            },
            hideEditor:function(){
                const t = this;
                t.previewWidth = 21;
                t.editWidth = 0;
                t.showEdit = false;
            },
            // 交换数组元素
            swapItems: function (arrDefault, index1, index2) {
                const t = this;
                if(index2 <0){
                    index2 = arrDefault.length - 1;
                }
                let arr = arrDefault;
                const ele = arr.splice(index1, 1)[0];
                const down = index1 - index2;
                if (down > 0) {//下移
                    arr.splice(index2, 0, ele);
                } else {//上移
                    arr.splice(index2 - 1, 0, ele);
                }
                return arr
            },
            getLayoutArray:function(){
                const t = this;
                t.layoutArray = [];
                t.value.content.forEach((val,index)=>{
                    let layout = {
                        uuid:val.uuid,
                        layout:val.layout
                    };
                    t.layoutArray.push(layout);
                })
            }
        },
        components:{
            tool,
            preview,
            edit
        }
    }
</script>
<style lang="less" scoped>
.bb-layout{
    padding:5px;
    overflow-y: hidden;
    .bb-layout-topbar{
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>