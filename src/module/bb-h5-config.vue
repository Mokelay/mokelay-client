<template>
    <div class="h5config">
        <bb-layout-seriation></bb-layout-seriation>
        <bb-vant-uploader class="" :content="[]"><bb-indep-button :button="addText"></bb-indep-button></bb-vant-uploader>
        <bb-vant-uploader :content="[]"><bb-indep-button :button="addPic"></bb-indep-button></bb-vant-uploader>
        <hr style="border:0;background-color:#f5f5f5;height:1px;width:100%;margin:auto;"/>
        <hr style="border:0;background-color:#f5f5f5;height:1px;width:10%;transform:rotate(90deg);margin:auto;"/>
        <bb-vant-uploader :content="[]"><bb-indep-button :button="addAudio"></bb-indep-button></bb-vant-uploader>
        <bb-vant-uploader :content="[]"><bb-indep-button :button="addVideo"></bb-indep-button></bb-vant-uploader> 
        <bb-vant-dialog :isShow="showEditText">
            <bb-vant-field></bb-vant-field>
        </bb-vant-dialog>
    </div>
</template>

<script>
    export default {
        name: 'bb-h5-config',
        props: {
            /*支持v-model 
                value:{
                    { 
                        uuid: '',
                        alias: 'bb-layout-canvas', //布局类积木 || 普通积木
                        aliasName: '自由式布局', 
                        attributes: {}, //积木属性
                        animation: [{ //动画
                        }],
                        interactives: [{ //触发交互
                        }],
                        layout: {} //积木布局
                    }
                }
            */
            value:{
                type:Object,
                default:function(){
                    return { 
                        uuid: '',
                        alias: '',
                        aliasName: '', 
                        attributes: {},
                        animation: [{
                        }],
                        interactives: [{
                        }],
                        layout: {}
                    }
                }
            }
        },
        data() {
            return {
                addText:{
                    type:'text',//按钮样式
                    icon:'ty-icon_bianji',//按钮图标
                    selectText:'添加文字',//
                    action:'buzz',
                    buzz:'buzzNull'  //巴斯方法名称  action:'buzz’时有效
                },
                addPic:{
                    type:'text',//按钮样式
                    icon:'ty-jc_photo_single',//按钮图标
                    selectText:'添加图片',//
                    action:'buzz',
                    buzz:'buzzNull'  //巴斯方法名称  action:'buzz’时有效
                },
                addAudio:{
                    type:'text',//按钮样式
                    icon:'ty-lg_batchsave',//按钮图标
                    selectText:'添加音频',//
                    action:'buzz',
                    buzz:'buzzNull'  //巴斯方法名称  action:'buzz’时有效
                },
                addVideo:{
                    type:'text',//按钮样式
                    icon:'ty-jc_video',//按钮图标
                    selectText:'添加视频',//
                    action:'buzz',
                    buzz:'buzzNull'  //巴斯方法名称  action:'buzz’时有效
                },
                showEditText:false,
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){

        },
        methods: {
            //载入当前积木的编辑内容
            editBB:function(content){
                const t = this;
                if(!content.alias){
                    t.show = false
                    return;
                }
                t.show = true;
                t.valueBase = content;
                t.alias = content.alias;
                t.key = _TY_Tool.uuid();
                //选获取积木详情，获取交互
                t.getBBInfo().then(()=>{
                    t.setEditor();
                })
            }
        }
    }
</script>
<style lang='less'>
    .h5config{
        &>div{
            width: 48%;
            margin: auto;
            text-align: center;
        }
    }
    
</style>