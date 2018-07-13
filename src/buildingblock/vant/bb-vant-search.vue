<template>
    <form action="/">
      <van-search
        v-model="valueBase"
        :placeholder="placeholder"
        :show-action="showAction"
        :background="background"
        @search="onSearch"
        @cancel="onCancel"
      />
      <div v-if="showSearchBtn" slot="action" @click="onSearch">{{searchBtnText}}</div>
    </form>
</template>

<script>
import Search from 'vant/lib/search';
import 'vant/lib/search/style';

    export default {
        name: 'bb-vant-search',
        components: {
          "van-search":Search,
        },
        props: {
            //内容
            value:{
                type:[Number,String]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            //placeholder 提示信息
            placeholder:{
                type:String
            },
            //是否显示右侧取消按钮
            showAction:{
                type:Boolean,
                default:false
            },
            //是否显示右侧搜索按钮
            showSearchBtn:{
                type:Boolean,
                default:false
            },
            //右侧 按钮文案  只有 showAction为true时才会显示
            searchBtnText:{
                type:String,
                default:"搜索"
            },
            //搜索框背景色 默认是#f2f2f2
            background:{
                type:String
            }
        },
        data() {
            return {
                valueBase:this.value
            };
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
        //事件click
        methods: {
            //搜索事件
            onSearch:function(val){
                this.$emit('search',val,this);
                this.$emit('input',val,this);
            },
            //取消搜索事件 
            onCancel:function(){
                this.$emit('cancel',this.valueBase,this);
                this.$emit('input',this.valueBase,this);
            }
        }
    }
</script>

<style scoped>
</style>