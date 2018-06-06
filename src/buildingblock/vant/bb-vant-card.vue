<script>
import Card from 'vant/lib/card';
import 'vant/lib/card/style';
    export default {
        name: 'bb-vant-card',
        components: {
          "van-card":Card,
        },
        props: {
            /*静态数据源
                {
                    'thumb':String, 左侧图片 
                    'title':String, 标题
                    'desc':String 描述
                    'num': String/Number 商品数量
                    'price':String/Number 商品价格
                    'centered':Boolean  内容是否垂直居中
                    'currency':"￥" 货币符号
                }
            */
            option:{
                type:Object
            },
            /*动态数据源*/
            optionDs:{
                type:Object
            },
            /*静态用户自定义内容积木数据*/
            content:{
                type:Array
            },
            /*动态用户自定义内容积木数据*/
            contentDs:{
                type:Object
            }

        },
        data() {
            return {
                valueBase:this.value
            };
        },
        render: function (createElement) {
            const t = this;
            return createElement('van-card',{
                props:{
                    'thumb':t.valueBase,
                    'title':t.title,
                    'desc':t.option['columns-num'],  //省市县显示列数
                    'num': t.loading, //显示加载状态
                    'price':t.option['item-height'], //选项高度
                    'centered':t.option['visible-item-count'], //可见的选项个数
                    'currency':t.realAreaList //省 市 区 数据
                },
                on:{
                    confirm:t.confirm,
                    cancel:t.cancel,
                    change:t.change
                }
            });
        },
        mounted(){

        },
        //事件click
        methods: {
            //点击事件
            click(param){
                this.$emit('click',param);
            }
        }
    }
</script>

<style scoped>
</style>