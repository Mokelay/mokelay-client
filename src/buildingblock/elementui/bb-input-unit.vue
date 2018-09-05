<template>
    <div class="flex bb-input-unit">
        <el-input-number class="number-class" :value="numberValue" @input="numberInput" :min="-1000" :controls="option.controls" :controls-position="option.controlsPosition" :size="option.size" :disabled="option.disabled"></el-input-number>
        <el-select class="unit-class" :value="unitValue" @input="unitInput" :size="option.size" :disabled="option.disabled" placeholder="请选择单位">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>

    export default {
        name: 'bb-input-unit',
        props: {
            value:{
                type:[Number,String]
            },
            //单位
            units:{
                type:Array,
                default:function(){
                    return [{
                        text:'像素(px)',
                        value:'px'
                    },{
                        text:'绝对单位(pt)',
                        value:'pt'
                    },{
                        text:'相对父级单位(em)',
                        value:'em'
                    },{
                        text:'相对基准单位(rem)',
                        value:'rem'
                    },{
                        text:'百分比(%)',
                        value:'%'
                    },{
                        text:'占比(vh)',
                        value:'vh'
                    }];
                }
            },
            //基础配置
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        size:"",
                        controls:true,//是否显示控制器
                        controlsPosition:""//默认控制器在两边 ，可选right
                    }
                }
            }
        },
        data() {
            return {
                numberValue:'',//长度值
                unitValue:'',//长度单位
                valueBase:this.value,//value值
                options:this.units
            }
        },
        watch: {
            value(val){
                this.valueBase=val;
                this._split(val);
            }
        },
        created: function () {
            let t=this;
            if(t.value){
                t._split(t.value);
            }
        },
        mounted:function(){
            let t=this;
            
        },
        methods: {
            //合并成value输出
            _merge:function(){
                let t=this;
                if(!t.numberValue){
                    t.numberValue = 0;
                }
                if(!t.unitValue){
                    t.unitValue = t.options[0].value;
                }
                t.valueBase = t.numberValue+t.unitValue;
                t.$emit('input',t.valueBase);
                t.$emit('change',t.valueBase);
            },
            //value拆分成number和unit
            _split:function(val){
                let t=this;
                if(val){
                    const _num = val.replace(/[^0-9\.]/ig,"");
                    const _unit = val.replace(/[^a-z]+/ig,"");
                    t.numberValue = _num;
                    t.unitValue = _unit;
                    if(!_unit){
                        t.unitValue = t.options[0].value;
                    }
                }
            },
            numberInput:function(val){
                let t=this;
                t.numberValue = val;
                t._merge();
            },
            unitInput:function(val){
                let t=this;
                t.unitValue = val;
                t._merge();
            }
          
        }
    }
</script>

<style lang="less" scoped>
    .bb-input-unit{
        width:240px;
        .number-class{
            flex:2;
        }
        .unit-class{
            flex:1.5;
        }
    }

</style>
