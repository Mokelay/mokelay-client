<template>
    <span class="bb-vant-tag tagClass" :class="radius?'bb_radius':''" @click="tagClick">
        <van-tag
            v-for="(tag,key) in valueBase"
            :key="key" 
            :type="tag.type||''"
            :plain="tag.plain||true"
            :mark="tag.mark||false"
            :data-index = "key"
            :data-tag ="JSON.stringify(tag)"
            :style="tag.selected?Object.assign(cssbuild(cssStyle),cssbuild(activeStyle)):cssbuild(cssStyle)"
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
                    value:'',
                    selected:false//是否被选中
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
            },
            //是否可点击
            isActive:{
                type:Boolean,
                default:false
            },
            //是否可多选 和isActive一起用
            multiple:{
                type:Boolean,
                default:false
            },
            //默认样式
            cssStyle:{
                type:Object,
                default:function(){
                    return {};
                }
            },
            //点击后的样式
            activeStyle:{
                type:Object,
                default:function(){
                    return {};
                }
            },
            //是否全圆角
            radius:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                valueBase:this.tags,
                valueBaseString:'',
                show:false,
                selected:[],//选中对象
                selectedVal:'',//选中val值
                cssbuild:_TY_Tool.setSimpleStyle//模板中需要用到
            };
        },
        created:function(){
            let t=this;
            t.getData();
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
                    _TY_Tool.getDSData(t.tagDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            var _list = [];
                            if(item['valueKey'].split('.').length > 1){//支持定制接口
                                _list = item['value']
                            }else{
                                if(item['value']&&item['value']['currentRecords']){
                                    _list = item['value']['currentRecords'];
                                }else if(item['value']&&item['value']['list']){
                                    _list = item['value']['list'];    
                                }else{
                                    _list = item['value'];
                                }
                            }
                            t.valueBase = _list;
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //tag点击事件
            tagClick:function(event){
                let t=this;
                let dom = event.srcElement;
                if(!dom){
                    return;
                }
                let index = dom.dataset['index'];
                let tag = JSON.parse(dom.dataset['tag']);
                if(t.isActive){
                    if(tag.selected){
                        t.$set(t.valueBase[index],'selected',false);
                        // t.selected.splice(t.selected.indexOf(tag.value),1);
                        //重新计算选中tag
                        t._calculateSelected();
                    }else{
                        if(!t.multiple&&t.selected.length>0){
                            //不是多选，并且已经有值了,其他全部变未选中
                            t.valueBase.forEach((item,_index)=>{
                                t.$set(t.valueBase[_index],'selected',false);        
                            });
                        }
                        t.$set(t.valueBase[index],'selected',true);
                        t._calculateSelected();
                    }
                    t.$emit('itemClick',tag.value,tag,t.selectedVal,t.selected,t);
                }
            },
            //计算选中值
            _calculateSelected:function(){
                let t=this;
                t.selected = [];
                let tmpVal = [];
                t.valueBase.forEach((item)=>{
                    if(item.selected){
                        t.selected.push(item);
                        tmpVal.push(item.value);
                    }
                });
                t.selectedVal = tmpVal.length>0?tmpVal.join(","):'';
            }
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

<style>
    .bb-vant-tag .van-tag{
        pointer-events:auto;
        cursor: pointer;
    }
    .bb-vant-tag .van-tag[class*=van-hairline]:after{
        pointer-events:auto;
        cursor: pointer;
    }
    .bb-vant-tag.bb_radius .van-tag[class*=van-hairline]:after{
        border-radius: 1rem;
        border-color: #E5E5E5;
    }
    
</style>