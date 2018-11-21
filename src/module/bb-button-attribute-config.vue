<template>  
    <div>
        <span v-if="returnString" class="code_text">{{p_value}}</span>
        <bb-dialog title="积木设置" size="middle" :isShow.sync="showDialog">
            <bb-form v-if="showDialog" ref="bb-config-ad-form" size="mini" labelWidth="80px" :dsFields="attributesDs" :alias="alias" v-model="valueBase" @commit="commit" :on="bbInfo&&bbInfo.on"></bb-form>
        </bb-dialog>
        <bb-dialog :isShow.sync="codeVisible" size="large">
            <div ref="frameBox"></div>
            <span class="bbBottomButtons">
                <!-- 放一个确认和一个取消按钮 -->
                <bb-button :button="{type:'defalut',size:'normal'}" @click="selectCancel">取消</bb-button>
                <bb-button :button="{type:'primary',size:'normal'}" @click="selectConfirm">确认</bb-button>
            </span>
        </bb-dialog>
        <el-button @click="openDialog"><i class="iconfont ty-icon_shezhi1"></i></el-button>
        <el-button @click="openCodeDialog"><i class="iconfont ty-qt__custom1"></i></el-button>
        <el-button class="" @click="clear"><i class="el-icon-delete"></i></el-button>
    </div>
</template>

<script>

    import bbdialog from '../buildingblock/elementui/bb-dialog.vue';
    import bbform from '../buildingblock/elementui/bb-form.vue';
    import bbbutton from '../buildingblock/elementui/bb-button.vue';

    import Vue from 'vue';
    import {
            Button
    } from 'element-ui'
    Vue.use(Button);

    export default {
        name: 'bb-button-attribute-config',
        components:{
            "bb-dialog":bbdialog,
            "bb-form":bbform,
            "bb-button":bbbutton
        },
        props: {
            value:{
                type:[Object,String],
                default:function(){
                    return {}
                }
            },
            //积木别名
            bbAlias:{
                type:String
            },
            //返回字符串
            returnString:{
                type:Boolean
            }
        },
        data() {
            return {
                valueBase:this.transferVal(this.value),
                showDialog:false,
                codeVisible:false,//开发者弹窗 显示
                //属性配置
                attributesDs:{},
                //积木详情
                bbInfo:null,
                alias:this.bbAlias||'',//积木别名
                p_value:(this.returnString?this.transferVal(this.value):'')
            }
        },
        watch: {
            value(val){
                this.valueBase = this.transferVal(val);
                this.p_value = this.returnString?val:'';
            },
            bbAlias(val){
                this.alias = val;
            }
        },
        created: function () {
            let t=this;
            this.getBBInfo().then(()=>{
                t.setEditor();
            })
        },
        mounted:function(){

        },
        methods: {
            //清除事件
            clear:function(){
                let t=this;
                t.valueBase = "";
                t.p_value = "";
                t.$emit('input',"");
                t.$emit("change",'');
            },
            //设置积木别名
            setAlias:function(val){
                let t=this;
                if(val){
                    t.alias = val;
                    t.setEditor();
                }
            },
            //选择取消
            selectCancel:function(){
                let t=this;
                t.codeVisible = false;
                t.showDialog = false;
            },
            //选中确认
            selectConfirm:function(){
                let t=this;
                const code = t._getIframeValue();//获取编辑器值
                t.p_value = code;
                if(!t.returnString){
                    t.valueBase = t.transferVal(code); 
                }else{
                    t.valueBase = code;
                }
                t.codeVisible = false;
                t.showDialog = false;
                t.$emit('change',t.valueBase);
                t.$emit('input',t.valueBase);
            },
            //根据bbalias 获取bb的详细信息
            getBBInfo:function(){
                let t=this;
                return new Promise((resolve,reject)=>{
                    if(!t.alias){
                        resolve();
                    }
                    if(_TY_Root._TY_BBInfo&&_TY_Root._TY_BBInfo[t.alias]){
                         t.bbInfo = _TY_Root._TY_BBInfo[t.alias];
                         resolve();
                    }else{
                        _TY_Tool.post(_TY_ContentPath+"/read-bb",{
                            bbAlias:t.alias
                        }).then(function (response) {
                                let data = response['data'];
                                if(data.ok){
                                    t.bbInfo = data.data.data;
                                    if(t.bbInfo.on&&typeof(t.bbInfo.on)==='string'){
                                        let tempOn = t.bbInfo.on;
                                        const _arg = tempOn.match(/`[^]*?`/gi)
                                        if(_arg&&_arg.length>0){
                                            tempOn = tempOn.replace(/`[^]*?`/gi,"\"\"");
                                        }
                                        t.bbInfo.on = JSON.parse(tempOn);
                                        if(_arg&&_arg.length>0){
                                            t.bbInfo.on.forEach((item,index)=>{
                                                item['executeArgument'] = eval(_arg[index]);
                                            });
                                        }
                                    }
                                    if(!_TY_Root._TY_BBInfo){
                                        _TY_Root._TY_BBInfo = {};
                                    }
                                    //放到全局变量里面去
                                    _TY_Root._TY_BBInfo[t.alias] = _TY_Tool.deepClone(t.bbInfo);
                                    resolve();
                                }else{
                                    reject()
                                }
                        }).catch(function (error) {
                            reject()
                        });
                    }
                });
            },
            //转换value
            transferVal:function(val){
                let t=this;
                if(!val){
                    return val;
                }
                let param = val;
                if(typeof(val) ==='string'){
                    try{
                        param = JSON.parse(val);    
                    }catch(e){
                        param = eval("("+val+")");
                    }
                }
                return param;
            },
            //打开弹窗
            openDialog:function(){
                let t=this;
                //打开弹窗按钮点击事件
                t.$emit('click',t);
                t.showDialog = true;
            },
            //开发者弹窗点击
            openCodeDialog:function(){
                let t=this;
                t.codeVisible = true;
                //打开编辑弹窗
                t._openIframe();
                //设置代码
                setTimeout(()=>{
                    let val = typeof(t.valueBase)==='object'?JSON.stringify(t.valueBase):t.valueBase;
                    t._setIframeValue(val);
                    setTimeout(()=>{
                        //如果能json格式化就显示格式化后的数据
                         t.jsonFormat();
                    },0);
                },1200);
            },
            //content change事件
            commit:function(formData){
                let t=this;
                let result = formData;
                if(t.returnString){
                    result = JSON.stringify(result);
                    t.p_value = result;
                }
                t.$emit('input',result);
                t.$emit('change',result);
                t.showDialog = false;
            },
            setEditor:function(){
                let t=this;
                //属性配置
                t.attributesDs = {
                    api:'list-adByBbAlias-online',method:'get',category:'config',inputs: [{paramName: 'bbAlias', valueType: "template", variable: t.alias}],outputs:[{dataKey: 'tableData', valueKey: 'data_list.list',handle:'bb-config-ad-fill-uuid'}]
                };
                t.$set(t.attributesDs,'inputs',[{paramName: 'bbAlias', valueType: "template", variable: t.alias}]);

            },
            /*
                下面是 打开iframe 编辑器的代码部分
            */
            //json格式化
            jsonFormat:function(showMessage){
                let t=this;
                let frame = document.getElementById('childFrame_'+t.key);
                if(frame.contentWindow.editor){
                    let editor = frame.contentWindow.editor;
                    //编辑器的值
                    let data = editor.getValue();
                    try{
                        //如果不能json转换，说明不是json格式
                        JSON.parse(data);
                    }catch(e){
                        if(showMessage){
                            t.$message({
                                type: 'info',
                                message: "数据非JSON格式或者JSON有错!"
                            });
                        }
                        return;
                    }
                    editor.setValue(_TY_Tool.jsonFormat(data));
                    const mode = 'application/ld+json';
                    editor.setOption("mode", mode);
                    editor.setOption("lineWrapping", true);
                    editor.setOption("autoCloseBrackets", true);
                }
            },
            //iframe添加css外链
            _addLink:function(doc,url) {
                var link = doc.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                var head = doc.getElementsByTagName("head")[0];
                head.appendChild(link);
            },
            //添加css 样式
            _addCss:function(doc) {
                let t=this;
                var style = doc.createElement("style");
                style.type = "text/css";
                var code =".CodeMirror {"+
                            "   border: 1px solid #eee;"+
                            "   height: 98%;"+
                            "   min-height: 360px;"+
                            "}"+
                            ".CodeMirror-scroll {"+
                            "   min-height: 360px;"+
                            "    height:100%;"+
                            "    overflow-y: hidden;"+
                            "    overflow-x: auto;"+
                            "}";
                try {
                    style.appendChild(doc.createTextNode(code));
                } catch (ex) {
                    style.text = code;
                }
                var head = doc.getElementsByTagName("head")[0];
                head.appendChild(style);
            },
            //添加js
            _addScript:function(doc,url) {
                var script = doc.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                var head = doc.getElementsByTagName("head")[0];
                head.appendChild(script);
            },
            //添加iframe内容
            _addContent:function(doc,key){
                let t=this;
                var _div = doc.createElement("textarea");
                _div.id = "codeContent_"+key;
                doc.body.appendChild(_div);
                var script = doc.createElement("script");
                script.type = "text/javascript";
                var code ="window.editor = CodeMirror.fromTextArea(document.getElementById('codeContent_"+key+"'), {"+
                            "matchBrackets:true,"+
                            "mode: 'text/typescript',"+
                            "lineNumbers: true"+
                          "});\n"+
                            "function setEditorVal(data){window.editor.setValue(data);}";
                try {
                    script.appendChild(doc.createTextNode(code));
                } catch (ex) {
                    script.text = code;
                }
                doc.body.appendChild(script);
            },
            _openIframe:function(){
                let t=this;
                let opened = false;
                if(t.key){
                    opened = true;
                }else{
                    t.key = _TY_Tool.uuid(8);
                }
                let _height="";
                if(t.fullscreen){
                    _height = "calc(100vh - 205px)";
                }
                setTimeout(function(){
                    if(!opened){
                        let iframe = document.createElement("iframe");
                        iframe.id = "childFrame_"+t.key;
                        iframe.width="100%";
                        iframe.style['min-height']="380px";
                        iframe.style['height']=_height;
                        t.$refs['frameBox'].appendChild(iframe);
                    }
                    let frame = document.getElementById('childFrame_'+t.key);
                    var childWindow = frame.contentWindow;
                    var childDoc = childWindow.document;
                    childDoc.body.innerHTML = '';

                    t._addLink(childDoc,"https://cdn.bootcss.com/codemirror/5.36.0/codemirror.min.css");
                    t._addScript(childDoc,"https://cdn.bootcss.com/codemirror/5.36.0/codemirror.min.js");
                    //主codemirror.js要先加载完成
                    setTimeout(function(){
                        t._addScript(childDoc,"https://cdn.bootcss.com/codemirror/5.36.0/addon/edit/matchbrackets.min.js");
                        t._addScript(childDoc,"https://cdn.bootcss.com/codemirror/5.36.0/addon/comment/continuecomment.min.js");
                         t._addScript(childDoc,"https://cdn.bootcss.com/codemirror/5.36.0/addon/comment/comment.min.js");
                        t._addScript(childDoc,"https://cdn.bootcss.com/codemirror/5.36.0/mode/javascript/javascript.min.js");
                        t._addCss(childDoc);
                    },200);
                    setTimeout(function(){
                        t._addContent(childDoc,t.key);
                    },1000);
                },0);
            },
            //获取iframe的值
            _getIframeValue:function(){
                let t=this;
                let frame = document.getElementById('childFrame_'+t.key);
                var childWindow = frame.contentWindow;
                let editor = childWindow.editor;
                let result = editor.getValue();
                return result;
            },
            //设置iframe value值
            _setIframeValue:function(val){
                let t=this;
                let frame = document.getElementById('childFrame_'+t.key);
                if(frame){
                    var childWindow = frame.contentWindow;
                    let editor = childWindow.editor;
                    editor.setValue(val);
                }
            }
            /*
                iframe 编辑器的代码部分 end
            */
            
        }
    }
</script>
<style lang='less' scoped>  

.code_text{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100px;
        display: inline-block;
        vertical-align: middle;
    } 
    .bbBottomButtons{
        display: inline-block;
        width: 100%;
        text-align: right;
    }
    .wa{
        width:auto;
        cursor: pointer;
    }
    .ml0{
        margin-left:0;
    }
</style>
