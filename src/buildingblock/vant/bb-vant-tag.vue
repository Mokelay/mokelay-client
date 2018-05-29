<template>
    <span class="tagClass">
        <van-tag
            v-for="(tag,key) in valueBase"
            :key="key" 
            :type="tag.type"
            :plain="tag.plain"
            :mark="tag.mark"
            >{{tag.text}}</van-tag>
    </span>
</template>

<script>
import Tag from 'vant/lib/tag';
import 'vant/lib/tag/style';

    export default {
        name: 'bb-vant-tag',
        components: {
          "van-tag":Tag,
        },
        props: {
            /*静态标签数据源
                [{
                    text:'标签内容',
                    type:"primary success danger" 类型
                    plain:false  是否为空心样式   
                    mark:false 是否为圆角样式
                }]
            */
            tags:{
                type:Array
            },
            /*模板默认值*/
            defaultValTpl:{
                type:String
            },
            //动态标签数据源
            tagDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.tags,
                valueBaseString:'',
                show:false
            };
        },
        mounted(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBaseString");
            t.valueBase = t.defaultValTpl?eval(t.valueBaseString):t.valueBase;
            t.$emit('mounted',t.valueBase); 
        },
        //事件click
        methods: {
            //获取数据
            getData() {
                const t = this;
                if (t.tagDs) {
                    Util.getDSData(t.tagDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t.realFields = value;
                        });
                    }, function (code, msg) {
                    });
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .tagClass{
        span{
            margin-left:0.6rem;  
        }
        span:first-child{
            margin-left:0;
        }
    }
</style>