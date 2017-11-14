<template>
	<div class="bb-preview">
		<div class='bb-preview-item' v-for="(bbItem,index) in bbPreviewList">
			<div class="buttonInfo">
				<p>{{(index+1)}}</p>
				<el-button type="text" icon="edit" @click="editItem(bbItem)" class="button-item"></el-button>
				<el-button type="text" icon="delete" @click="removeItem(bbItem)" class="button-item"></el-button>
			</div>
			<bb :alias="bbItem.alias" :config="bbItem.config"></bb>
		</div>
	</div>
</template>
<script>
    export default {
        name: 'bb-preview',
        props: {
        	bbPreviewList:{
        		type:Array,
        		default:function(){
        			return [{
        				alias:null,
        				config:null
        			}]
        		}
        	}
        },
        data() {
            return{}
        },
        computed: {},
        watch: {},
        methods: {
        	editItem:function(bbItem){
        		this.$emit('edit',bbItem)
        	},
        	removeItem:function(bbItem){
        		this.$emit('delete',bbItem)
        	}
        }    
    }
</script>
<style lang="less" scoped>
    .bb-preview{
        .bb-preview-item{
            display: flex;
            flex:1;
        }
        .buttonInfo{
            background: #eef1f6;
            border: 1px solid #E4E4E4;
            border-right: none;
            margin-top: 10px;
            padding: 10px;
            .button-item{
              display: block;
              margin: auto;
            }
        }
  }
</style>