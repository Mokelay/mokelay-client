<template>
    <span class="bb-html" :contenteditable="contenteditable" @input="valChange" v-on:dblclick="dblclick" v-on:blur="blur" v-html="valueBase"></span>
</template>

<script>
    export default {
        name: 'bb-html',
        props: {
            /*
                value 支持v-model   支持自动替换编辑器，比如<#=input.fieldNameA#> 自动换成input输入框，如果默认值
            */
            value:{
                type:[String,Number]
            },
            /*
                defaultValTpl 默认值支持模板 
            */
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            //如果value中有 类似 <#=input.fieldNameA#> 这种替换标识，并且defaultValObject 传值{fieldNameA:'xxx'},value自动换成input输入框，并且填充默认值'xxx'；支持模板
            defaultValObject:{
                type:[String,Object]
            }
        },
        data() {
            return {
                valueBase: this.value,
                contenteditable:false,
                resultObject:{},//最后返回模板中的变量值对象
                resultString:'',//最后生成的完整String
                resultHtmlString:''//最后生成的完整html String
            }
        },
        computed:{
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
            //渲染默认值模板
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            t.fillHtml();
        },
        methods: {
            //填充html代码
            fillHtml:function(){
                let t=this;
                const reg = /<#=.*?#>/ig;
                const reg2 = /&lt;#=.*?#&gt;/ig;
                let stringHasTransfer = false;
                if(!this.valueBase){
                    return;
                }
                let fields = (this.valueBase+"").match(reg);
                //没有<#=#> 这种结构的填充数据 直接返回
                if(!fields||fields.length<=0){
                    stringHasTransfer = true;
                    fields = (this.valueBase+"").match(reg2);
                }
                if(!fields||fields.length<=0){
                    return;
                }
                let map = [];
                fields.forEach(function(item,index){
                    let target = stringHasTransfer?item.replace("&lt;#=","").replace("#&gt;",""):item.replace("<#=","").replace("#>","");
                    let components = target.split("\.");
                    const component = components[0];
                    let fieldName = "";
                    if(components.length>1){
                        fieldName = components[1];
                    }
                    //组合成方便识别的数组
                    map.push({
                        src:item,//<#=input.fieldNameA#>
                        target:target,//input.fieldNameA
                        component:component,//input
                        fieldName:fieldName//fieldNameA
                    });
                });
                let valObject;
                if(t.defaultValObject){
                    //支持模板
                    valObject=_TY_Tool.tpl(t.defaultValObject,_TY_Tool.buildTplParams(t));
                }
                if(valObject&&typeof valObject ==='string'){
                    valObject = JSON.parse(valObject);
                }
                if(map.length<=0){
                    return;
                }
                let bbVal = t.valueBase;//先复制valueBase数据，以免响应式会触发渲染
                let bbResultVal = t.valueBase;//用于value替换
                map.forEach(function(item,index){
                    const _component = item.component;
                    const _fieldName = item.fieldName;
                    let fieldValue="";
                    if(valObject&&valObject.hasOwnProperty(_fieldName)){
                        fieldValue = valObject[_fieldName];
                    }
                    let _html = '';
                    switch(_component){
                        case "input":
                            _html = _html+"<input type='text' name='"+_fieldName+"' style='font-size: inherit;' value='"+(fieldValue?fieldValue:"")+"'/>"
                            break;
                        case "inputLine":
                            _html = _html+"<input type='text' name='"+_fieldName+"' style='font-size: inherit;border: 0;border-bottom: 1px solid #444;' value='"+(fieldValue?fieldValue:"")+"'/>"
                            break;

                    }
                    bbVal=bbVal.replace(new RegExp(item.src, 'gi'),"<bb-html name="+_fieldName+" >"+_html+"</bb-html>");
                    //加标签是用于标记
                    bbResultVal = bbResultVal.replace(new RegExp(item.src, 'gi'),"<bb-item name="+_fieldName+">"+fieldValue+"</bb-item>");
                    t.resultObject[_fieldName]=fieldValue;
                });
                t.resultHtmlString = bbResultVal;
                //填充无html的string
                t.fillResultString(t.resultHtmlString);
                t.valueBase = bbVal;
            },
            dblclick:function(params){
                this.$emit('bb-dblclick');
            },
            blur:function(params){
                this.$emit('bb-blur');
            },
            edit:function(params){
                this.contenteditable = true;
            },
            cancel:function(params){
                this.contenteditable = false;
            },
            fillResultString:function(str){
                let t=this;
                let result = str.replace(/<[^>]+>|&nbsp;/g,"");
                t.resultString = result;
            },
            //val,fieldName  用事件冒泡的方式，接受 动态html代码里的事件触发
            valChange:function(...args){
                let t=this;
                //获取字段名
                let fieldName = event.target.getAttribute("name");
                let fieldValue = event.target.value;
                t.resultObject[fieldName] = fieldValue;//返回的值对象
                const _html = event.currentTarget.innerHTML;
                const reg = new RegExp("<bb-item name="+fieldName+".*?>.*?</bb-item>", 'gi')
                t.resultHtmlString = t.resultHtmlString.replace(reg,"<bb-item name="+fieldName+">"+fieldValue+"</bb-item>");//完整的html 代码
                //填充无html的string
                t.fillResultString(t.resultHtmlString);
                t.$emit("input",t.valueBase,t);
                //change事件将返回的所有数据 以参数形式传出去
                t.$emit('change',t.resultHtmlString,t.resultString,t.resultObject,t);
            },
            //外部设置内容
            setContent:function(...args){
                let t=this;
                if(args[0]&&args[0] instanceof Array && args[0].length>0&&args[0][0]&&args[0][0].hasOwnProperty('value')&&args[0][0].value){
                    //如果是一个 ds返回的map对象
                    t.valueBase = args[0][0].value;
                    return;
                }
                args.forEach((val,key)=>{
                    if(val.type == 'custom'){
                        t.valueBase = val.arguments;
                    }
                })
                this.fillHtml();
            },
        }
    }
</script>
<style lang='less' scoped>
</style>