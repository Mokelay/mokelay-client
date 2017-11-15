<template>
    <div class="bb-preview" id="bb-preview">
        <p class="title">{{title}}</p>
        <div class='bb-preview-item' v-for="(bbItem,index) in realValue" :id="bbItem.uuid" :key="index">
            <div class="buttonInfo">
                <p>{{(index+1)}}</p>
                <el-button type="text" icon="edit" @click="editItem(bbItem)" class="button-item"></el-button>
                <el-button type="text" icon="delete" @click="removeBB(bbItem)" class="button-item"></el-button>
            </div>
            <bb :alias="bbItem.alias" :config="bbItem.attributes"></bb>
        </div>
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
                title: this.value.layoutObject.title,
                realValue:this.value.content

            }
        },
        watch: {
            'value.content'(val){
                this.realValue = val
            }
        },
        mounted(){
            const t = this;
            require.ensure(['dragula/dragula', 'jquery'], function (require) {
                const dragula = require("dragula/dragula");
                const source = document.getElementById('bb-preview');
                t.drake = dragula([source], {
                    copy: function (el, source) {
                        return false
                    },
                    accepts: function (el, target) {
                        return target === source
                    },
                });
                t.drake.on('drop', function (el, target, source, sibling) {
                    t.$emit('updateBBLayout',{
                        el:el,
                        target:target,
                        source:source,
                        sibling:sibling
                    })
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
        .title{
            text-align: center;
            font-family: '.PingFangSC-Regular';
            font-size: 22px;
            color: #444444;
        }
    }
</style>