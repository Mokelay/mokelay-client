<template>
    <van-stepper
    	:style="styleBase"
		  v-model="valueBase"
		  :integer="onlyInt"
		  :min="min"
		  :max="max"
		  :step="step"
		  :default-value="defaultValue"
		  :disabled="disabled"
		  :disable-input="disableInput"
		  @change="change"
		  @plus="plus"
		  @minus="minus"
	/>
</template>

<script>
import Stepper from 'vant/lib/stepper';
import 'vant/lib/stepper/style';

    export default {
        name: 'bb-vant-stepper',
        components: {
          "van-stepper":Stepper,
        },
        props: {
            //默认值
            value:{
                type:[Number,String]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number]
            },
            //只能是整形
            onlyInt:{
            	type:Boolean,
            	default:false
            },
            //最小值
            min:{
            	type:[String,Number],
            	default:1
            },
            //最大值
            max:{
            	type:[String,Number]
            },
            //步长
            step:{
            	type:[String,Number],
            	default:1
            },
            //组件默认值
            defaultValue:{
            	type:[String,Number],
            	default:1
            },
            //是否禁用
            disabled:{
            	type:Boolean,
            	default:false
            },
            //禁用input框
            disableInput:{
            	type:Boolean,
            	default:false
            },
            //样式
            bbStyle:{
            	type:Object
            }
        },
        data() {
            return {
                valueBase:this.value
            };
        },
        computed:{
        	//设置css样式
        	styleBase(){
        		let result;
        		if(this.bbStyle){
        			result = _TY_Tool.setStyle({
        				layout:this.bbStyle
        			},this);
        		}
        		return result;
        	}
        },
        watch:{
            value:function(val){
                this.valueBase = val;
            }
        },
        mounted(){
            let t=this;
            //解析模板默认值
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        methods: {
            //change事件
            change:function(val){
                this.$emit('change',val,this);
                this.$emit('input',val,this);
            },
            //点击增加按钮时触发事件 
            plus:function(){
                this.$emit('plus',this.valueBase,this);
                this.$emit('input',this.valueBase,this);
            },
            //点击减少按钮时触发
            minus:function(){
                this.$emit('plus',this.valueBase,this);
                this.$emit('input',this.valueBase,this);
            }
        }
    }
</script>

<style scoped>
</style>