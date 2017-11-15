<template>
	<div class="bb-layout">
        <el-row class='question-layout-content'>
    		<el-col :span="3"><tool :toolListDs="toolListDs" @add="addBB"></tool></el-col>
    		<el-col :span="previewWidth"><preview :value="value" @edit="editItem" @delete="removeItem" @drop="drop"></preview></el-col>
    		<el-col :span="editWidth" v-if="showEdit"><edit :value="editValue" @commitAttributes="commitAttributes" @addInteractive="addInteractive" @deleteInteractive="deleteInteractive"></edit></el-col>
        </el-row>
	</div>
</template>
<script>
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
                        layout:{},
                        content:[],
                        interactive:[],
                    }
                }
            },
            listType:{//切换积木列表显示的内容
                type:String
            }
        },
        data() {
            const t = this;
        	return{
                showEdit:false,
                previewWidth:21,
                editWidth:0,
                editFields:[],
                editValue:null,
        		//bb-tool 配置
				toolListDs:{
					api: "list-bb",
					category:'config',
					method: "post",
					inputs: [{
						paramName: "type",
						valueType: "constant",
						constant: this.listType
					}],
					outputs: [{
						dataKey: "type",
						valueKey: "data_list"
					}]
				},
        	}
        },
        computed: {},
        watch: {
            value(val){
            }
        },
        methods: {
        	addBB:function(bbItem){//添加积木
                this.$emit('add',bbItem)
            },
            drop:function(bbItem){//更新layout
                this.$emit('drop',bbItem)
            },
            editItem:function(bbItem){//编辑积木属性
                const t = this;
                t.editValue = bbItem;
                t.showEditor();
        		t.$emit('edit',bbItem)
        	},
        	removeItem:function(bbItem){//删除积木
                this.hideEditor();
        		this.$emit('delete',bbItem)
        	},
            commitAttributes:function(formData){//更新积木属性
                const t = this;
                t.hideEditor();
                t.$emit('commitAttributes',formData);
            },
            addInteractive:function(formData){//添加交互
                const t = this;
                t.hideEditor();
                t.$emit('addInteractive',formData);
            },
            deleteInteractive:function(formData){//删除交互
                const t = this;
                t.hideEditor();
                t.$emit('deleteInteractive',formData);
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