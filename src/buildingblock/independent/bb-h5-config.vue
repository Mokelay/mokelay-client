<template>
    <div class="h5config">
        <bb-layout-seriation-edit ref="editContent" class="h5configEdit" :horizontal="false" :content="realContent"></bb-layout-seriation-edit>
        <bb-indep-button :button="addText" @click="addContent"></bb-indep-button>
        <bb-indep-button :button="addPic" @click="addContent"></bb-indep-button>
        <hr style="border:0;background-color:#f5f5f5;height:1px;width:100%;margin:auto;"/>
        <hr style="border:0;background-color:#f5f5f5;height:1px;width:10%;transform:rotate(90deg);margin:auto;"/>
        <bb-indep-button :button="addAudio" @click="addContent"></bb-indep-button>
        <bb-indep-button :button="addVideo" @click="addContent"></bb-indep-button> 
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
                type:Array
            }
        },
        data() {
            return {
                addText:{
                    type:'text',//按钮样式
                    icon:'ty-icon_bianji',//按钮图标
                    selectText:'添加文字',//
                    action:'buzz',
                    buzz:'buzzNull',  //巴斯方法名称  action:'buzz’时有效
                    style:{
                        'font-size':'0.4rem'
                    }
                },
                addPic:{
                    type:'text',//按钮样式
                    icon:'ty-jc_photo_single',//按钮图标
                    selectText:'添加图片',//
                    action:'buzz',
                    buzz:'buzzNull',  //巴斯方法名称  action:'buzz’时有效
                    style:{
                        'font-size':'0.4rem'
                    }
                },
                addAudio:{
                    type:'text',//按钮样式
                    icon:'ty-lg_batchsave',//按钮图标
                    selectText:'添加音频',//
                    action:'buzz',
                    buzz:'buzzNull',  //巴斯方法名称  action:'buzz’时有效
                    style:{
                        'font-size':'0.4rem'
                    }
                },
                addVideo:{
                    type:'text',//按钮样式
                    icon:'ty-jc_video',//按钮图标
                    selectText:'添加视频',//
                    action:'buzz',
                    buzz:'buzzNull',  //巴斯方法名称  action:'buzz’时有效
                    style:{
                        'font-size':'0.4rem'
                    }
                },
                addTextContent:{
                    uuid: _TY_Tool.uuid(),
                    alias: 'bb-indep-textarea', //布局类积木 || 普通积木
                    transferAlias:'bb-words',
                    aliasName: '添加文字', 
                    attributes: {
                        placeholder:"请输入练习活动简介",
                        styleConfig:{
                            fontFamily:'',
                            fontSize:'14px',
                            fontColor:'#9a9a9a',
                            bold:false ,
                            italic:false ,
                            underline:false,
                            textAlign:'left',
                            lingHeight:1.5,
                            letterSpacing:0,
                            borderWidth:0,
                            borderColor:"#6298D8",
                            borderStyle:"solid",
                            borderRadius:"2px",
                            width:"100%",
                            resize:"none",
                            height:"5rem",
                            padding:"5px",
                            margin:"",
                        }
                    }, 
                    animation: [{ //动画
                    }],
                    interactives: [{
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'input',
                        executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                        containerMethodName:'defaultVmodel'
                    }],
                    layout: {} //积木布局
                },
                addPicContent:{
                    uuid: _TY_Tool.uuid(),
                    alias: 'bb-vant-uploader-image', //布局类积木 || 普通积木
                    transferAlias:'bb-photos',
                    aliasName: '添加图片', 
                    attributes: {
                        accept:"image/*",
                        transformConfig:{
                            transformMode:'list'
                        }
                    }, //积木属性
                    animation: [{ //动画
                    }],
                    interactives: [{
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'input',
                        executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                        containerMethodName:'defaultVmodel'
                    }],
                    layout: {} //积木布局
                },
                addAudioContent:{
                    uuid: _TY_Tool.uuid(),
                    alias: 'bb-vant-uploader-audio', //布局类积木 || 普通积木
                    transferAlias:'bb-indep-audio-player',
                    aliasName: '添加音频', 
                    attributes: {
                        accept:"audio/*",
                    }, //积木属性
                    animation: [{ //动画
                    }],
                    interactives: [{
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'input',
                        executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                        containerMethodName:'defaultVmodel'
                    }],
                    layout: {} //积木布局
                },
                addVideoContent:{
                    uuid: _TY_Tool.uuid(),
                    alias: 'bb-vant-uploader', //布局类积木 || 普通积木
                    transferAlias:'bb-video',
                    aliasName: '添加视频', 
                    attributes: {
                        accept:"video/*",
                    }, //积木属性
                    animation: [{ //动画
                    }],
                    interactives: [{
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'input',
                        executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                        containerMethodName:'defaultVmodel'
                    }],
                    layout: {} //积木布局
                },
                showEditText:false,
                realContent:this.value || []
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){

        },
        methods: {
            //添加积木
            addContent(type){
                const t = this;
                switch(type.selectText){
                    case "添加文字":
                        const textContent = _TY_Tool.deepClone(t.addTextContent);
                        t.realContent.push(textContent);
                        break;
                    case "添加图片":
                        const picContent = _TY_Tool.deepClone(t.addPicContent);
                        t.realContent.push(picContent);
                        break;
                    case "添加音频":
                        const audioContent = _TY_Tool.deepClone(t.addAudioContent);
                        t.realContent.push(audioContent);
                        break;
                    case "添加视频":
                        const videoContent = _TY_Tool.deepClone(t.addVideoContent);
                        t.realContent.push(videoContent);
                        break;
                }
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //外部获取最新的content
            getContents(){
                this.realContent = this.$refs.editContent.getContents();
                window.realContent = this.realContent;
                return this.realContent;
            }
        }
    }
</script>
<style lang='less'>
    .h5config{
        &>button{
            width: 48%;
            margin: auto;
            text-align: center;
        }
        .h5configEdit{
            margin: 1rem 0rem;
        }
    }
    
</style>