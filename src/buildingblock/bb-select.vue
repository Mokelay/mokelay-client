<template>
    <el-select 
      placeholder="请选择" 
      v-model="valueBase" 
      clearable
      :allow-create="filterable"
      :multiple="multiple"
      :filterable="filterable"
      :disabled="disabled"
      default-first-option
      @change='change'
      >
      <el-option
              v-for="(option,key) in items"
              :key="key"
              :label="option.text"
              :value="option.value">
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
              type:String
            },
            /*选项值关键字 配合DS接口使用，从返回数据中获取需要的值*/
            valueField:{
              type:String
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
            }
        },
        data() {
            return {
              items:this.fields.length>0?this.fields:this.options,
              valueBase: this.value,
              external:{}
            }
        },
        watch:{
            fields(val) {
                this.items = val;
            },
            value(val){
                if(this.multiple){
                  this.valueBase = JSON.parse(val);
                }else{
                  this.valueBase = val;
                }
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
                                      text:list[i][t.textField]
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
            change:function(val){
              if(Array.isArray(val)){
                this.$emit('input',JSON.stringify(val))
                this.$emit('change',JSON.stringify(val))
              }else{
                this.$emit('input',val)
                this.$emit('change',val)
              }
             
            },
            clean:function(val){
              this.valueBase = null;
            }
        }
    }
</script>