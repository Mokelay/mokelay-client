<template>
    <div class="bb-layout">
        <el-row class="bb-layout-topbar">
            <el-col :span="19"><tool :value="value" @addBB="addBB"></tool></el-col>
            <el-col :span="5" class="topbar-button"><el-button type="primary" @click="showPreview">预览</el-button><el-button type="primary" @click="commit">提交</el-button></el-col>
        </el-row>
        
        <el-row class='bb-layout-content'>
            <el-col :span="24"><preview :value="value" @edit="editItem" @removeBB="removeBB" @updateBBLayout="updateBBLayout"></preview></el-col>
        </el-row>
        <!-- <edit v-if="showEdit" :isEditShow="showEdit" :value="editValue" :content="value.content" @updateBBAttributes="updateBBAttributes" @addInteractive="addInteractive" @removeInteractive="removeInteractive" @closeDia="hideEditor"></edit> -->
        <bb-dialog :isShow="isShowPreview" size="large" title="预览" @closeDia="closePreview">
            <bb-preview :value="value"></bb-preview>
        </bb-dialog>

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
    ds:["api-alias-1","api-alias-1"],
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
    @addDS="addDS"
    @removeDS="removeDS"
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

//参数为apiAlias
addDS = function(apiAlias){
    //调用后台接口添加DS
}

//参数为apiAlias
removeDS = function(apiAlias){
    //调用后台接口删除DS
}

//value为bb-layout的vlaue，当点击保存的时候获取到
commit = function(value){
    //全局保存，如果业务已经实现上述6个event，基本commit就不用调后台接口了
    //如果没有实现上述6个event，那只需要实现这个commit就可以全局保存了
}


当然通过 vue.$refs.layout.value 也可以获取到最新的布局数据
**/
    import Vue from 'vue';
    import tool from './module/tool.vue'
    import preview from './module/preview.vue'
    import edit from './module/edit.vue'
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
                isShowPreview:false,
                previewWidth:21,
                editWidth:0,
                editValue:null,//当前编辑的积木
                layoutArray:null//排序数组用于更新排序
            }
        },
        methods: {
            addBB:function(bbItem){//添加积木
                bbItem.layout = this.value.content.length
                this.$set(this.value.content,this.value.content.length,bbItem);
                this.hideEditor();
                this.$emit('addBB',bbItem.uuid,bbItem.alias,bbItem.layout)
            },
            updateBBLayout:function(bbItem){//更新layout
                const t = this;
                //初始化排序数组
                t.getLayoutArray();
                let sourceKey = 0;
                let targetKey = 0;
                t.layoutArray.forEach((val,key)=>{
                    if(bbItem.el.id == val.uuid){
                        sourceKey = key;
                    }
                    if(bbItem.sibling && bbItem.sibling.id == val.uuid){
                        targetKey = key;
                    }
                });
                if(!bbItem.sibling){
                    targetKey = t.layoutArray.length;
                }
                //更新layoutArray数组
                t.layoutArray = t.swapItems(t.layoutArray,sourceKey,targetKey);
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
                t.dialog.close().remove();
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
                t.showEdit = true;
                t.setting();
            },
            hideEditor:function(){
                const t = this;
                t.showEdit = false;
            },
            // 交换数组元素
            swapItems: function (arrDefault, sourceKey, targetKey) {
                const t = this;
                if(targetKey <0){
                    targetKey = arrDefault.length - 1;
                }
                let arr = arrDefault;
                const ele = arr.splice(sourceKey, 1)[0];
                const down = sourceKey - targetKey;
                if (down > 0) {//上移
                    arr.splice(targetKey, 0, ele);
                } else {//下移
                    arr.splice(targetKey - 1, 0, ele);
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
            },
            showPreview:function(){
                const t = this;
                t.isShowPreview = true;
            },
            closePreview:function(){
                const t = this;
                t.isShowPreview = false;
            },
            setting:function(){
                const t = this;
                require.ensure(["art-dialog","jquery"],function(require){
                    const layoutEdit = new Vue({
                        router: t.$router,
                        components:{edit},
                        render: function(createElement){
                            const formItem = createElement('edit',{
                                props:{
                                    isEditShow:t.showEdit,
                                    value:t.editValue,
                                    content:t.value.content
                                },
                                on:{
                                    updateBBAttributes:t.updateBBAttributes,
                                    addInteractive:t.addInteractive,
                                    removeInteractive:t.removeInteractive,
                                    closeDia:t.hideEditor
                                },
                                ref:"layoutEdit"
                            },[]);
                            return createElement('div',{class:'layout-edit-content'},[formItem])
                        }
                    }).$mount();
                    const dialog = require('art-dialog');
                    const d = dialog({
                        width:800,
                        //height:500,
                        zIndex:1,
                        title: '设置',
                        content: layoutEdit.$el
                    });
                    d.showModal();
                    t.dialog = d;
                });
            }
        },
        components:{
            tool,
            preview,
            edit
        }
    }
</script>
<style lang="less">
.bb-layout{
    .bb-layout-topbar{
        text-align: right;
        margin-bottom: 10px;
        line-height: 60px;
        background: #eef1f6;
        .topbar-button{
            padding: 0 10px;
        }
    }
    .bb-layout-content{
        padding: 10px;
        border:1px dashed #e4e4e4;
    }
    .layout-edit-content{
        height: 500px;
        overflow-y: auto;
    }
}
</style>