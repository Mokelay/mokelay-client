<template>  
    <div>
        <span v-if="returnString" class="code_text">{{p_value}}</span>
        <bb-dialog title="积木设置" size="middle" :isShow.sync="showDialog">
            <bb-form v-if="showDialog" ref="bb-config-ad-form" size="mini" labelWidth="80px" :dsFields="attributesDs" :alias="alias" v-model="valueBase" @commit="commit" :on="bbInfo&&bbInfo.on"></bb-form>
        </bb-dialog>
        <el-button @click="openDialog"><i class="iconfont ty-icon_shezhi1"></i></el-button>
        <el-button class="" @click="clear"><i class="el-icon-delete"></i></el-button>
    </div>
</template>

<script>
    export default {
        name: 'bb-button-config',
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
                this.p_value = this.returnString?this.transferVal(val):'';
            },
            bbAlias(val){
                this.alias = val;
            }
        },
        created: function () {
            let t=this;

            this.key = _TY_Tool.uuid();
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
                    param = JSON.parse(val);
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
                    api:'list-adByBbAlias',method:'get',category:'config',inputs: [{paramName: 'bbAlias', valueType: "template", variable: t.alias}],outputs:[{dataKey: 'tableData', valueKey: 'data_list.list',handle:'bb-config-ad-fill-uuid'}]
                };
                t.$set(t.attributesDs,'inputs',[{paramName: 'bbAlias', valueType: "template", variable: t.alias}]);

            }
            
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
</style>