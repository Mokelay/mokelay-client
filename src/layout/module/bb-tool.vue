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
		toolListDs:{
			type: Object
		}
	},
	data() {
		return {
			toolList: [],
			clickTimes:null
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
			this.clickTimes ++ ;
			this.$emit('add',{
				bb:bb,
				key:this.clickTimes
			});
		}
	}
};
</script>
<style lang="less" scoped>
.tool-list{
	padding: 11px;
	max-width: 150px;
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