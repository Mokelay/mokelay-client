<template>
	<div class="tool-list">
		<bb-menu :fields="menuList" :router="false" @click="addBB"></bb-menu>
	</div>
</template>
<script>
const Util = window._TY_Tool;
export default {
	name: "tool",
	props: {
		value:{
			type:Object
		}
	},
	data() {
		return {
			toolType:[],
			toolTypeDs:{
				api: "list-bb-type",
				category:'config',
				method: "get",
				inputs: [],
				outputs: [{
					dataKey: "type",
					valueKey: "data_list"
				}]
			},
			toolList: [],
			toolListDs:{
				api: "list-bb",
				category:'config',
				method: "post",
				inputs: [],
				outputs: [{
					dataKey: "type",
					valueKey: "data_list"
				}]
			},
			menuList:[],
			length:5,
			radix:8
		};
	},
	created() {
		this.getType();
	},
	methods:{
	//获取线上bb组件列表
		getType:function () {
		    const t = this;
		    if (t.toolTypeDs) {
		        Util.getDSData(t.toolTypeDs, _TY_Tool.buildTplParams(t), function (map) {
		            const list = map[0].value.list;
		            t.toolType = list;
		            t.getData();
		        }, function (code, msg) {
		      });
		    }
		},
		getData:function () {
		    const t = this;
		    if (t.toolListDs) {
		        Util.getDSData(t.toolListDs, _TY_Tool.buildTplParams(t), function (map) {
		            const list = map[0].value.list;
		            t.toolList = list;
		            t.setMenu();
		        }, function (code, msg) {
		      });
		    }
		},
		setMenu:function () {
		    const t = this;
		    t.toolType.forEach((val,key)=>{
		    	const menuItem = {
		    		title:val.name,
		    		url:val.alias,
		    		children:[]
		    	};
		    	t.toolList.forEach((ele,index)=>{
		    		if(val.alias == ele.type){
		    			menuItem.children.push({
		    				title:ele.name,
		    				url:ele.alias,
		    				icon:ele.icon
		    			});
		    		}
		    	})
		    	t.menuList.push(menuItem);
		    })
		},
		addBB:function(bb){
			const t = this;
			const uuid = Util.uuid(this.length,this.radix)
			//创建积木名称  默认积木name
			t.$prompt('请输入积木名称', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValue:bb.title
			}).then(({ value }) => {
				t.$emit('addBB',{
					uuid:uuid,
					alias:bb.url,
					aliasName:value,
					attributes:{},
				});
			}).catch(() => {
				t.$message({
					type: 'info',
					message: '取消输入'
				});       
			});
		}
	}
};
</script>
<style lang="less" scoped>
	.tool-list{
		ul{
			background-color: #eef1f6;
		}
	}
</style>