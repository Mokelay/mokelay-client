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
            card:{
                type:Object,
                default:function(){
                    return {
                        'thumb':'https://img1.mklimg.com/g2/M00/2C/34/rBBrClpqxmyAVzYrAABkOxACkVs880.png!',
                        'title':'卡片',
                        'desc':'商品描述',
                        'num': 10,
                        'price':20,
                        'centered':false,
                        'currency':"￥",
                    };
                }
            },
            /*动态数据源*/
            cardDs:{
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
                realCard:this.card,
                realContent:this.content
            };
        },
        render: function (createElement) {
            const t = this;
            const props = {
                'thumb':t.realCard['thumb'],
                'title':t.realCard['title'],
                'desc':t.realCard['desc'],  //省市县显示列数
                'num': t.realCard['num'], //显示加载状态
                'price':t.realCard['price'], //选项高度
                'centered':t.realCard['centered'] || false, //可见的选项个数
                'currency':t.realCard['currency'] || '￥' //省 市 区 数据
            };
            const slotArr = t.renderSlotItem(createElement);
            const card = createElement('van-card',{props:props,on:{click:t.click}},slotArr);
            return createElement('div',{on:{click:t.click}},[card]);

        },
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //点击事件
            click(){
                this.$emit('click',this);
            },
            //动态获取卡片内容
            getData(){
                const t = this;
                if (t.contentDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.contentDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.realContent = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            renderSlotItem(createElement){
                const t = this;
                const slotObj = {};
                const slotArr = [];
                //根据slot生成对应的content对象
                if(t.realContent){
                    t.realContent.forEach((item,key)=>{
                        slotObj[item.group] = slotObj[item.group]?slotObj[item.group]:[];
                        slotObj[item.group].push(item);
                    });
                    //生成slot嵌套的子积木
                    Object.keys(slotObj).forEach((val,index)=>{
                        const slotBBs =  _TY_Tool.bbRender(slotObj[val], createElement, t);
                        const item = createElement('div',{props:{slot:val}},slotBBs);
                        slotArr.push(item);
                    });
                }
                return slotArr;
            }
        }
    }
</script>

<style scoped>
</style>