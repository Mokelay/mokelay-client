<template>
    <el-select placeholder="请选择" v-model="valueBase" :multiple="multiple" @change='change'>
      <el-option
              v-for="option in items"
              :key="option.value"
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
            value:{
              type: [String,Array,Number],
              default:''
            },
            fields:{
              type: Array,
              default:function(){
                  return [];
              }
            },
            multiple:{
              type: Boolean,
              default:false
            },
            options:{
              type: Array,
              default:function(){
                  return [];
              }
            },
            textField:{
              type:String
            },
            valueField:{
              type:String
            },
            ds: {
                type: Object,
                default: function () {
                    return null
                }
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
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
                this.valueBase = val;
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
        },
        methods: {
            getData: function () {
                var t = this;
                if (this.ds) {
                    t.loading = true;
                    Util.getDSData(t.ds, {"bb": t, "router": t.$route.params, "external":t.external,'local':window.localStorage,'session':window.sessionStorage}, function (map) {
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
              this.$emit('input',val)
              this.$emit('change',val)
            },
            clean:function(val){
              this.valueBase = null;
            }
        }
    }
</script>