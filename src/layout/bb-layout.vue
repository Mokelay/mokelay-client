<template>
	<div class="bb-layout">
		<tool :toolListDs="toolListDs"></tool>
		<preview :bbPreviewList="bbPreviewList" @edit="edit" @delete="remove"></preview>
		<edit :bbEditFields="bbEditFields" :bbValue="bbValue" @commit="commit"></edit>
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
        	editItem:function(bbItem){
        		this.$emit('edit',bbItem)
        	},
        	removeItem:function(bbItem){
        		this.$emit('delete',bbItem)
        	},
            commit:function(formData){
                const t = this;
                t.$emit('commit',formData);
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