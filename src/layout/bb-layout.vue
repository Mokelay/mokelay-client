<template>
	<div class="bb-layout">
        <el-row class='question-layout-content'>
    		<el-col :span="3"><tool :maxNumber="maxNumber" @addBB="addBB"></tool></el-col>
    		<el-col :span="previewWidth"><preview :value="value" @edit="editItem" @delete="removeBB" @updateBBLayout="updateBBLayout"></preview></el-col>
    		<el-col :span="editWidth" v-if="showEdit"><edit :value="editValue" @updateBBAttributes="updateBBAttributes" @addInteractive="addInteractive" @removeInteractive="removeInteractive"></edit></el-col>
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
    content:[{uuid:'',alias:'',attributes:{},layout:""}],
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
updateBBLayout = function(uuid,layout){
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
                    return null
                }
            }
        },
        data() {
        	return{
                showEdit:false,
                previewWidth:21,
                editWidth:0,
                editFields:[],
                editValue:null,
                maxNumber:this.value.content.length
        	}
        },
        computed: {},
        watch: {
            value(val){
            }
        },
        methods: {
        	addBB:function(bbItem){//添加积木
                this.value.content.push(bbItem);
                this.$emit('addBB',bbItem)
            },
            updateBBLayout:function(bbItem){//更新layout
                this.$emit('updateBBLayout',bbItem)
            },
            editItem:function(bbItem){//编辑积木属性
                const t = this;
                t.editValue = bbItem;
                t.showEditor();
        	},
        	removeBB:function(bbItem){//删除积木
                this.hideEditor();
        		this.$emit('removeBB',bbItem)
        	},
            updateBBAttributes:function(formData){//更新积木属性
                const t = this;
                t.hideEditor();
                t.$emit('updateBBAttributes',formData);
            },
            addInteractive:function(formData){//添加交互
                const t = this;
                t.hideEditor();
                t.$emit('addInteractive',formData);
            },
            removeInteractive:function(formData){//删除交互
                const t = this;
                t.hideEditor();
                t.$emit('removeInteractive',formData);
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
    min-height:~'calc(100vh - 135px)';
}
</style>