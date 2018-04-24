<template>
    <span class="bb-html" :contenteditable="contenteditable" v-on:dblclick="dblclick" v-on:blur="blur" v-html="valueBase"></span>
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
                contenteditable:false
            }
        },
        computed:{
        },
        watch: {
            value(val){

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
                if(!this.value){
                    return;
                }
                let fields = (this.value+"").match(reg);
                //没有<#=#> 这种结构的填充数据 直接返回
                if(!fields||fields.length<=0){
                    stringHasTransfer = true;
                    fields = (this.value+"").match(reg2);
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
                map.forEach(function(item,index){
                    const _component = item.component;
                    const _fieldName = item.fieldName;
                    let fieldValue;
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
                    bbVal=bbVal.replace(new RegExp(item.src, 'gi'),_html);
                });
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
            }
        }
    }
</script>
<style lang='less' scoped>
</style>