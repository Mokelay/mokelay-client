<template>
	<div class="bb-preview" id="bb-preview">
        <p class="title">{{title}}</p>
		<div class='bb-preview-item' v-for="(bbItem,index) in realValue" :id="bbItem.uuid" :key="index">
			<div class="buttonInfo">
                <p>{{(index+1)}}</p>
				<el-button type="text" icon="edit" @click="editItem(bbItem)" class="button-item"></el-button>
                <el-button type="text" icon="delete" @click="removeBB(bbItem)" class="button-item"></el-button>
			</div>
            <div class="bb-preview-content"><bb :alias="bbItem.alias" :key="timestamp" :config="bbItem.attributes"></bb></div>
			<!-- <div class="bb-preview-content"><bb :alias="bbItem.alias" :config="realValue[0].attributes"></bb></div> -->
		</div>
        <div class="bb-preview-suggess" v-if="realValue.length<1">请从工具栏添加积木</div>
	</div>
</template>
<script>
    export default {
        name: 'bb-preview',
        props: {
            value:{
                type:[String,Object]
            }
        },
        data() {
            const t = this;
            return{
                title: '',
                realValue:[],
                timestamp:null
            }
        },
        watch: {
            'value.content'(val){
                this.getTimeKey();
                this.realValue = val;
            },
            'value.layoutObject'(val){
                this.title =  val.title
            }
        },
        created(){
            const t = this;
            t.title = t.value.layoutObject.title;
            t.realValue = t.value.content;
            t.getTimeKey();
        },
        mounted(){
            const t = this;
            require.ensure(['dragula/dragula', 'jquery'], function (require) {
                const dragula = require("dragula/dragula");
                const source = document.getElementById('bb-preview');
                const dragulaButton = document.getElementsByClassName('buttonInfo');
                t.drake = dragula([source], {
                    copy: function (el, source) {
                        return false
                    },
                    accepts: function (el, target) {
                        return true
                    },
                    moves:function(el, source, handle, sibling){
                        return handle.className == "buttonInfo"
                    }
                });
                t.drake.on('drop', function (el, target, source, sibling) {
                    t.$emit('updateBBLayout',{
                        el:el,
                        target:target,
                        source:source,
                        sibling:sibling
                    });
                    t.drake.cancel('drop');
                })
            })
        },
        methods: {
        	editItem:function(bbItem){
        		this.$emit('edit',bbItem)
        	},
        	removeBB:function(bbItem){
                const t = this;
                t.$confirm('确认删除此项','提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    t.$emit('removeBB',bbItem)
                }).catch((err) => {
                    t.$message({
                        type: 'info',
                        message: '操作已取消'
                    });
                });
        	},
            getTimeKey:function(){
                this.timestamp = Date.parse(new Date());
            }
        }    
    }
</script>
<style lang="less" scoped>
    .bb-preview{
        max-height:~'calc(100vh - 100px)';
        overflow-y: auto;
        .bb-preview-item{
            display: flex;
            flex:1;
            margin-bottom: 10px;
            .bb-preview-content{
                padding:10px;
                border: 1px solid #e4e4e4;
                width: 100%;
                overflow-y: auto;
            }
        }
        .bb-preview-suggess{
            text-align: center;
            line-height: 300px;
        }
        .buttonInfo{
            background: #eef1f6;
            border: 1px solid #E4E4E4;
            border-right: none;
            //margin-top: 10px;
            padding: 10px;
            .button-item{
              display: block;
              margin: auto;
            }
        }
        .title{
            text-align: center;
            font-family: '.PingFangSC-Regular';
            font-size: 22px;
            color: #444444;
        }
    }
</style>