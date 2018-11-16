<template>
    <div>
        <span class="code_text">{{p_value}}</span>
        <el-button type="primary" class="m10" @click="openDialog">代码编辑</el-button>
        <el-dialog
              title="代码编辑"
              :visible.sync="dialogVisible"
              :width="dialogWidth"
              :modal="false"
              :fullscreen="fullscreen"
              :before-close="handleClose">
              <div ref="frameBox">
                    <el-button type="primary" @click="jsonFormat(true)">格式化(JSON/JS)</el-button>
              </div>
              <codemirror ref="mirror" class="bb_codemirror" v-model="p_value" :options="cmOptions"></codemirror>
              <!--   <iframe ref="childFrame" id="childFrame" width="100%" height="100%">
                </iframe> -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="formCommit">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>

    // require component
    import { codemirror } from 'vue-codemirror'
    import _CodeMirror from 'codemirror'
    // require styles
    import 'codemirror/lib/codemirror.css'

    require('codemirror/mode/javascript/javascript')
    require('codemirror/mode/vue/vue')

    import Vue from 'vue';
    import {
            Dialog,
            Button
    } from 'element-ui'
    Vue.use(Dialog);
    Vue.use(Button);

    export default {
        name: 'bb-editor-code',
        components: {
        },
        props: {
            value:{
                type:[String,Object,Array]
            },
            returnObj:{
                type:Boolean,
                default:false
            },
             /**
             *  编辑代码确认按钮触发事件
                @button:当前点击的按钮配置
                {
                    style:{},//css样式
                    type:'primary',//按钮样式
                    disabled:false,//按钮是否可编辑
                    size:'small',//按钮大小
                    icon:'icon',//按钮图标
                    text:'按钮文字',//
                    selectText:'按钮文字',
                    action:'url 地址跳转|| execute-ds执行接口 || dialog-page弹窗 || code自定义代码 || buzz 巴斯代码',
                    url:''跳转地址 action:'url’时有效
                    urlType:'openWindow 在新标签中打开 
                    ds:{} //按钮请求的接口配置 action:'execute-ds’时有效
                    confirmTitle:'', //请求接口前的提示语标题   action:'execute-ds’时有效
                    confirmText:'', //请求接口前的提示语内容   action:'execute-ds’时有效
                    callBackStaticWords:'' //请求接口成功提示语
                    dialogPage:'pageAlias',//弹窗中的页面名称   action:'dialog-page’时有效
                    method:fn , //需要执行的方法 action:'code’时有效
                    buzz:'buzzName'  //巴斯方法名称  action:'buzz’时有效
                }
            */
            button:{
                type:Object,
                default: function(){
                    return null;
                }
            }
        },
        components:{
            "codemirror":codemirror
        },
        data() {
            return {
                p_value:typeof(this.value)!='string'?JSON.stringify(this.value):this.value,
                dialogVisible:false,
                dialogWidth:'100%',
                fullscreen:true,
                codeObj : null,
                external:{},//支持外部参数
                cmOptions:{
                    tabSize: 4,//缩进
                    mode: 'text/javascript',
                    // theme: 'base16-dark',
                    lineNumbers: true,
                    line: true,
                    matchBrackets:true
                }//编辑器选项
            }
        },
        watch: {
            value(val){
                var t = this;
                let temp = val;
                if(val && val instanceof Object&&t.returnObj){
                    temp = JSON.stringify(val);
                }
                t.p_value = temp;
            }
        },
        created: function () {
            //初始化编辑器
            this.initCodeMirror();
        },
        mounted: function () {
            var t =this;
            t.jsonFormat(false);
        },
        methods: {
            initCodeMirror:function(){
                _CodeMirror.defineExtension("autoFormatRange", function (from, to) {
                    var cm = this;
                    var outer = cm.getMode(), text = cm.getRange(from, to).split("\n");
                    var state = _CodeMirror.copyState(outer, cm.getTokenAt(from).state);
                    var tabSize = cm.getOption("tabSize");

                    var out = "", lines = 0, atSol = from.ch == 0;
                    function newline() {
                        out += "\n";
                        atSol = true;
                        ++lines;
                    }

                    for (var i = 0; i < text.length; ++i) {
                        var stream = new _CodeMirror.StringStream(text[i], tabSize);
                        while (!stream.eol()) {
                            var inner = _CodeMirror.innerMode(outer, state);
                            var style = outer.token(stream, state), cur = stream.current();
                            stream.start = stream.pos;
                            if (!atSol || /\S/.test(cur)) {
                                out += cur;
                                atSol = false;
                            }
                            if (!atSol && inner.mode.newlineAfterToken &&
                                inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i+1] || "", inner.state))
                                newline();
                        }
                        if (!stream.pos && outer.blankLine) outer.blankLine(state);
                        if (!atSol) newline();
                    }

                    cm.operation(function () {
                        cm.replaceRange(out, from, to);
                        for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
                            cm.indentLine(cur, "smart");
                    });
                });
            },
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                }
            },
            //设置值
            setValue:function(val){
                const t=this;
                t.p_value = val;
            },
            //json格式化
            jsonFormat:function(showMessage){
                let t=this;
                try{
                    JSON.parse(t.p_value);
                    t.cmOptions.mode = "application/ld+json";
                    t.cmOptions.lineWrapping = true;
                    t.cmOptions.autoCloseBrackets = true;
                }catch(e){
                    t.jsFormat();
                    return;
                }
                t.p_value = _TY_Tool.jsonFormat(t.p_value);
            },
            jsFormat:function(){
                let t=this;
                t.cmOptions.mode = "javascript";//javascript  htmlmixed
                t.cmOptions.lineWrapping = true;
                t.cmOptions.autoCloseBrackets = true;
                if(t.$refs['mirror']){
                    const editor = t.$refs['mirror'].codemirror;
                    var totalLines = editor.lineCount(); 
                    editor.autoFormatRange({line:0, ch:0}, {line:totalLines});    
                }
            },
            //打开弹窗
            openDialog:function(){
                let t=this;
                t.dialogVisible = true;
            },
            //关闭前的操作
            handleClose:function(){
                const t=this;
                t.dialogVisible =false;
            },
            formCommit:function(){
                let t=this;
                let result = t.p_value;
                if(t.returnObj && result){
                    try{
                    　　result = JSON.parse(result);
                    }catch(e){
                        try{
                            result = eval("("+result+")");
                        }catch(e1){
                            result = eval(result);
                        }
                    }
                }
                t.$emit("input",result);
                //如果有确认按钮配置
                if(t.button){
                     _TY_Tool.resolveButton(t.button,_TY_Tool.buildTplParams(t,{
                        value:result
                     })).then(()=>{
                        t.dialogVisible =false;
                     });
                }else{
                    t.dialogVisible =false;
                }
            },
            //获取iframe的值
            getIframeValue:function(){
                let t=this;
                return t.p_value;
            },
            //设置iframe value值
            setIframeValue:function(val){
                let t=this;
                t.p_value = val;
            }
        }
    }
</script>

<style scoped>
    .m10 {
        margin: 10px;
    }
    .code_text{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100px;
        display: inline-block;
        vertical-align: middle;
    }

    .bb_codemirror{
        height: calc(100vh - 205px);
    }
</style>


<style>
    .vue-codemirror .CodeMirror {
            border: 1px solid #eee;
            height: 100%;
        }
    .CodeMirror .CodeMirror-scroll {
        height: 100%;
        overflow-y: hidden;
        overflow-x: auto;
    }
</style>