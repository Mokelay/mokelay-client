<template>
	<div class="tool-list">
		<div class="bb" v-for="bb in toolList" :name="bb.name" :alias="bb.alias" :key="bb.alias" @click="addBB(bb)">
			<el-button :plain="true" type="text"><i :class="bb.icon"></i> {{bb.name}}</el-button>
		</div>
	</div>
</template>
<script>
const Util = window._TY_Tool;
export default {
	name: "bb-tool",
	props: {
		maxNumber:{
			type:[String,Number]
		}
	},
	data() {
		return {
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
			length:5,
			radix:8
		};
	},
	created() {
		this.getData();
	},
	methods:{
	//获取线上bb组件列表
		getData:function () {
		    const t = this;
		    if (t.toolListDs) {
		        Util.getDSData(t.toolListDs, {"bb": t, "router": t.$route.params}, function (map) {
		            const list = map[0].value.list;
		            t.toolList = list;
		        }, function (code, msg) {
		      });
		    }
		},
		addBB:function(bb){
			const t = this;
			const uuid = Util.uuid(this.length,this.radix)
			t.$emit('addBB',{
				uuid:uuid,
				alias:bb.alias,
				attributes:'',
				layout:t.maxNumber+1
			});
		}
	}
};
</script>
<style lang="less" scoped>
.tool-list{
	padding: 11px;
	max-width: 150px;
	max-height: 100vh;
	overflow-y: auto;
	.bb{
		margin-bottom: 4px;
		background: #FFFFFF;
		border: 1px solid #E4E4E4;
		font-family: '.PingFangSC-Regular';
		font-size: 14px;
		color: #444444;
		.el-button{
			width: 100%;
		}
	}
}
</style>