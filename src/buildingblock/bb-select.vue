<template>
    <el-select 
      placeholder="请选择" 
      v-model="valueBase" 
      clearable
      :allow-create="filterable"
      :multiple="multiple"
      :filterable="filterable"
      :disabled="option.disabled"
      :default-first-option="option.defaultFirstOption"
      :size="option.size"
      @change='change'
      >
      <el-option
              v-for="(item,key) in items"
              :key="key"
              :label="item.text"
              :disabled="item.disabled"
              :value="item.value">
      </el-option>
    </el-select>
</template>

<script>
    import Util from '../libs/util.js'

    export default {
        name: 'bb-select',
        props: {
            /*实现v-model*/
            value:{
              type: [String,Array,Number],
              default:''
            },
            /*选项静态数据源*/
            fields:{
              type: Array,
              default:function(){
                  return [];
              }
            },
            /*是否多选*/
            multiple:{
              type: Boolean,
              default:false
            },
            /*选项静态数据源  不在使用*/
            options:{
              type: Array,
              default:function(){
                  return [];
              }
            },
            /*选项名关键字 配合DS接口使用，从返回数据中获取需要的值*/
            textField:{
              type:String,
              default:"name"
            },
            /*选项值关键字 配合DS接口使用，从返回数据中获取需要的值*/
            valueField:{
              type:String,
              default:"alias"
            },
            /*选项动态数据源*/
            ds: {
                type: Object,
                default: function () {
                    return null
                }
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            disabled:{
              type:Boolean,
              default:false
            },
            /*是否可搜索*/
            filterable:{
              type:Boolean,
              default:true
            },
            //是否文案显示value值
            showValue:{
              type:Boolean,
              default:false
            },
            //多选时有效   true 返回 abc,def; false 返回 ["abc","def"]
            resultString:{
              type:Boolean,
              default:true
            },
            //基础配置
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        readonly:false,
                        defaultFirstOption:true,
                        size:""
                    };
                }
            }
        },
        data() {
            return {
              items:this.fields.length>0?this.fields:this.options,
              valueBase: this.multipleValTransfer(this.value),
              external:{}
            }
        },
        watch:{
            fields(val) {
                this.items = val;
            },
            value(val){
                //如果开始多选则默认值时一个数据 否则是字符串
                const defaultValue = this.multiple?[]:'';
                this.valueBase = val?this.multipleValTransfer(val):defaultValue;
                this.$emit('mounted',this.valueBase);
            },
            ds(val){
                this.getData();
            }
        },
        created: function () {
          this.getData();
        },
        mounted(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            if(t.valueBase){
              setTimeout(function(){t.$emit('mounted',t.valueBase)},0);
            }
        },
        methods: {
          //多选值 转换，string 数组转换成  多选逗号隔开
            multipleValTransfer(val){
              let t=this;
              let result =val;
              if(!val||(t.multiple&&val.lenth<=0)){
                return result;
              }
              if(typeof(val)==='string'&&t.multiple){
                try{
                  result = JSON.parse(val);
                }catch(e){
                  result=val.split(",");
                }
                if(!(result instanceof Array)){
                  result = [result];
                }
              }
              return result;
            },  
            getData: function () {
                var t = this;
                if (this.ds) {
                    t.loading = true;
                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach(function (item) {
                                var list = item['value']['list'];
                                t.items = [];
                                for (var i in list) {
                                    var ele = list[i][t.valueField];
                                    if(typeof(list[i][t.valueField]) != 'string'){
                                      ele = JSON.stringify(list[i][t.valueField])
                                    }
                                    let option = {
                                      value:ele,
                                      text:list[i][t.textField]+(t.showValue?"("+ele+")":"")
                                    }
                                    t.items.push(option);
                                }
                                t.totalItems = item['value']['totalRecords'];
                            });
                        t.loading = false;
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            linkage:function(data){
              if(data){
                this.external['linkage'] = data;
                this.getData();
              }
            },
            //外部联动，并清空value值
            linkageAndClearValue:function(data){
              if(data){
                this.valueBase = null;
                this.external['linkage'] = data;
                this.getData();
              }
            },
            change:function(val){
              if(Array.isArray(val)){
                if(this.resultString){
                  this.$emit('input',val.join(","));
                  this.$emit('change',val.join(","));
                }else{
                  this.$emit('input',JSON.stringify(val));
                  this.$emit('change',JSON.stringify(val));
                }
              }else{
                this.$emit('input',val);
                this.$emit('change',val);
              }
             
            },
            clean:function(val){
              this.valueBase = null;
            },
            //清空选项
            cleanAll:function(){
              this.valueBase = null;
              this.items = null;
            }

        }
    }
</script>