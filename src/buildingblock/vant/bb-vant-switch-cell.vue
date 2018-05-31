<script>
import SwitchCell from 'vant/lib/switch-cell';
import 'vant/lib/switch-cell/style';

    export default {
        name: 'bb-vant-switch-cell',
        components: {
          "van-switch-cell":SwitchCell
        },
        render: function (createElement) {
            const t = this;
            const props = {
                    value:t.valueBase,
                    title:t.title,
                    loading:t.option.loading, 
                    disabled:t.option.disabled
                };
            const switchCellItem = createElement('van-switch-cell',{props:props,on:{input:t.change}},[]);
            return switchCellItem;
        },
        props: {
            //内容
            value:{
                type:[Number,String,Boolean]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*标题*/
            title:{
                type:String
            },

            /*其他属性配置
                {
                    loading:false  是否为加载状态  
                    disabled:false 是否为禁用状态
                }
            */
            option:{
                type:Object,
                default:function() {
                    return {
                        loading:false, 
                        disabled:false
                    };
                }
            }
        },
        data() {
            return {
                valueBase:false
            };
        },
        mounted(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");  
            t.$emit('mounted',this.valueBase); 
        },
        //事件click
        methods: {
            //输入事件
            change(key){
                this.valueBase = key;
                this.$emit('input',key);
                this.$emit('change',key);
            }

        }
    }
</script>

<style scoped>
</style>