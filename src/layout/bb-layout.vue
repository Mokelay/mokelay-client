<template>
	<div class="bb-layout">
        <el-row class='question-layout-content'>
    		<el-col :span="3"><tool :toolListDs="toolListDs" @add="addBB"></tool></el-col>
    		<el-col :span="previewWidth"><preview :bbPreviewList="bbPreviewList" @edit="editItem" @delete="removeItem"></preview></el-col>
    		<el-col :span="editWidth" v-if="showEdit"><edit :bbEditFields="bbEditFields" :bbValue="bbValue" @commit="commit"></edit></el-col>
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
        	listType:{
        		type:String
        	},
            bbPreviewList:{
                type:Array
            },
        	bbEditFields:{
        		type:Array
        	},
            bbValue:{
                type:[Object,String]
            }
        },
        data() {
        	return{
                showEdit:false,
                previewWidth:21,
                editWidth:0,
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
        watch: {},
        methods: {
        	addBB:function(bbItem){
                this.$emit('add',bbItem)
            },
            editItem:function(bbItem){
                this.showEditor();
        		this.$emit('edit',bbItem)
        	},
        	removeItem:function(bbItem){
                this.hideEditor();
        		this.$emit('delete',bbItem)
        	},
            commit:function(formData){
                const t = this;
                t.hideEditor();
                t.$emit('commit',formData);
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