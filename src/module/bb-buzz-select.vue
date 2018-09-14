<template>
    <div>
        <el-input size="small" v-model="valueBase" placeholder="请选择" :readonly="true" @focus="edit" class="wa"></el-input>
        <el-button size="small" @click="choose"><i class="el-icon-search"></i></el-button>
        <el-button size="small" @click="add" class="ml0 " style="margin-left:0"><i class="el-icon-plus"></i></el-button>
        <el-button size="small" @click="clear" style="margin-left:0" class="ml0"><i class="el-icon-delete"></i></el-button>
        <bb-dialog :isShow.sync="editVisible" size="large">
            <!-- 添加和编辑弹窗 -->
            <div>
                <label style="width: 60px;display: inline-block;">模板: </label>
                <bb-select :fields="templates" @change="templateChange"></bb-select>
            </div>
            <div style="margin: 10px 0;">
                <label style="width: 60px;display: inline-block;">巴斯名称: </label>
                <bb-input style="width:240px" ref="buzzName"></bb-input>
            </div>
            <div ref="frameBox"></div>
            <span class="bbBottomButtons">
                <!-- 放一个确认和一个取消按钮 -->
                <bb-button :button="{type:'defalut',size:'normal'}" @click="selectCancel">取消</bb-button>
                <bb-button :button="{type:'primary',size:'normal'}" @click="editConfirm">确认</bb-button>
            </span>
        </bb-dialog>
         <bb-dialog :isShow.sync="selectVisible">
         <!-- 选择弹窗 -->
            <bb-list 
                v-if="selectVisible"
                :columns="selectionGridConfig.columns"  
                :ds="selectionGridConfig.ds"  
                :selection="selectionGridConfig.selection"  
                :pagination="selectionGridConfig.pagination"  
                :search="selectionGridConfig.searchConfig.search"  
                :searchConfig="selectionGridConfig.searchConfig"
                :advancedSearch="selectionGridConfig.advancedSearch"
                :advancedSearchConfig="selectionGridConfig.advancedSearchConfig"
                :highlightCurrent="true"
                fixedColumn="500"
                @list-select="listSelect" 
                :showHeader="selectionGridConfig.showHeader"></bb-list>
            <span class="bbBottomButtons">
                <!-- 放一个确认和一个取消按钮 -->
                <bb-button :button="{type:'defalut',size:'normal'}" @click="selectCancel">取消</bb-button>
                <bb-button :button="{type:'primary',size:'normal'}" @click="selectConfirm">确认</bb-button>
            </span>
        </bb-dialog>
    </div>
</template>

<script>

    const TEMPLATE = {
        "api_data_transfer":`
//巴斯最后返回结果： [{text:'xxx',value:'xxxx'}...]
var fun = function() {
    //realDataMap 含有数据源中配置的返回值，下面是以list返回数据为例 分页数据:page_data.currentRecords
    var dataList = realDataMap.data_list.list;
    dataList.forEach((item, index) => {
        item.text = item.label_Type;
        item.value = item.id;
    });
    return realDataMap.data_list;
}
fun();`
    };

    export default {
        name: 'bb-buzz-select',
        props: {
            value:{
                type:String
            }
        },
        data() {
            return {
                valueBase:this.value,
                currentRow:null,//选中的数据,添加时该值为空,通过他判断是新增还是编辑
                editVisible:false,
                selectVisible:false,//选择框显示
                //选择列表数据配置
                selectionGridConfig:{
                    ds:{
                        "api": "page-buzz-self",
                        "category": "config",
                        "method": "get",
                        "inputs": [{
                            "paramName": "keywords",
                            "valueType": "inputValueObj",
                            "valueKey": "bb",
                            "variable": "keywords"
                        },{
                            "paramName": "page",
                            "valueType": "inputValueObj",
                            "valueKey": "bb",
                            "variable": "page"
                        },{
                            "paramName": "pageSize",
                            "valueType": "inputValueObj",
                            "valueKey": "bb",
                            "variable": "pageSize"
                        }],
                        "outputs": [
                            {
                                "dataKey": "tableData",
                                "valueKey": "page_data"
                            }
                        ]
                    },
                    columns:[{
                        "label": "别名",
                        "prop": "alias",
                        "type": "default"
                    },{
                        "label": "名称",
                        "prop": "name",
                        "type": "default"
                    }],
                    "searchConfig": {
                        "search": true,
                        "searchType": "searchInput"
                    },
                    pagination:true
                },
                templates:[{
                    text:'接口数据转换模板',
                    value:'api_data_transfer'
                }]
            }
        },
        watch: {
            value(val){
                this.valueBase = val;
            }
        },
        created: function () {
        },
        mounted:function(){
             let t=this;
             
        },
        methods: {
            //选择按钮点击
            choose:function(){
                //选择按钮点击
                let t=this;
                t.selectVisible = true;
            },
            //新增按钮点击
            add:function(){
                //添加按钮点击
                let t = this;
                t.editVisible = true
                t.currentRow = null;
                //打开编辑弹窗
                t._openIframe();
            },
            clear:function(){
                let t=this;
                t.currentRow = null;
                t.valueBase = "";
                t.$emit('change',"");
                t.$emit('input',"");
            },
            //编辑框点击
            edit:function(){
                let t=this;
                if(t.valueBase){
                    t.editVisible = true
                    //打开编辑弹窗
                    t._openIframe();
                    //调接口 获取巴斯详情
                    _TY_Tool.get(_TY_ContentPath+"/read-buzz-by-alias",{
                        alias:t.valueBase
                    }).then((response)=>{
                        var data = response['data'];
                        if(data['ok']){
                            //请求成功
                            t.currentRow = data.data.data;
                            //设置代码
                            setTimeout(()=>{
                                t._setIframeValue(t.currentRow.code);
                            },1000);
                        }else{
                            t.$message({
                                type:'error',
                                message:data['message']
                            });
                        }
                    });
                }
            },
            //选择取消
            selectCancel:function(){
                let t=this;
                t.selectVisible = false;
                t.editVisible = false;
                t.currentRow = null;
            },
            //选中确认
            selectConfirm:function(){
                let t=this;
                if(!t.currentRow){
                    this.$message({
                        type: 'info',
                        message: '请先选择巴斯'
                    });
                }else{
                    t.valueBase = t.currentRow.alias;
                    t.selectVisible = false;
                    t.$emit('change',t.valueBase);
                    t.$emit('input',t.valueBase);
                }
            },
            //选中一行
            listSelect:function(row){
                //选中数据缓存
                this.currentRow = row;
            },
            //编辑 添加 确认
            editConfirm:function(){
                let t=this;
                const code = t._getIframeValue();//获取编辑器值
                //获取数据调修改、添加接口
                if(t.currentRow){
                    //编辑 更新代码
                    _TY_Tool.post(_TY_ContentPath+"/update-buzz",{
                        id:t.currentRow.id,
                        code:code
                    }).then((response)=>{
                        let data = response['data'];
                        if(data['ok']){
                            t.$message({
                                type:'success',
                                message:'修改成功'
                            });
                            t.editVisible = false;
                        }else{
                            t.$message({
                                type:'error',
                                message:'修改失败,'+data.message
                            });
                        }
                    });
                }else{
                    //新增
                    const pageAlias = _TY_Root.$route.query.pageAlias||'auto_generate';
                    const buzzAlias = "generate_"+pageAlias+"_"+_TY_Tool.uuid(8);
                    const buzzName = t.$refs['buzzName'].valueBase||pageAlias+'页巴斯';
                    _TY_Tool.post(_TY_ContentPath+"/add-buzz",{
                        alias:buzzAlias,
                        name:buzzName,
                        code:code,
                        description:"生成巴斯",
                        type:'javascript'
                    }).then((response)=>{
                        let data = response['data'];
                        if(data['ok']){
                            t.$message({
                                type:'success',
                                message:'添加成功'
                            });
                            //添加成功后，将别名返回
                            t.valueBase = buzzAlias;
                            t.editVisible = false;
                            t.$emit('change',t.valueBase);
                            t.$emit('input',t.valueBase);
                        }else{
                            t.$message({
                                type:'error',
                                message:'添加失败,'+data.message
                            });
                        }
                    });
                }
            },
            //模板change 事件
            templateChange:function(val){
                let t =this;
                const code = t._getIframeValue();//获取编辑器值
                if(code){
                    //如果code 有值, 提示是否替换
                    t.$confirm("改变模板会替换下面代码，是否确定?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //模板切换
                        t._changeTemplate(val);
                    });
                }else{
                    t._changeTemplate(val);
                }
            },
            //改变template
            _changeTemplate:function(val){
                let t=this;
                if(val&&TEMPLATE[val]){
                    //设置值
                    t._setIframeValue(TEMPLATE[val]);
                }
            },
            /*
                下面是 打开iframe 编辑器的代码部分
            */
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
                // setTimeout(function(){
                //     let frame = document.getElementById('childFrame_'+t.key);
                //     frame.contentWindow.setEditorVal("");

                // },300);
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

<style lang="less" scoped>
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