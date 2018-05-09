
<!-- <template>
    <div>
       <tree-view :data="jsonSource" :options="{rootObjectKey:rootObjectKey,maxDepth:maxDepth}"></tree-view>
    </div>
</template> -->

<script>

    export default {
        name: 'bb-json',
        render: function (createElement) {
            const t = this;
            if(!t.canRender){
                return;
            }
            return createElement('tree-view', {
                ref:'bb-json',
                props:{
                    data:t.jsonSource,
                    options:{
                        rootObjectKey:t.rootObjectKey,
                        maxDepth:t.maxDepth
                    }
                }
            }, []);
        },
        props: {
            //json展示data
            data:{
                type:[Array,Object,String],
                default:function(){
                    return {};
                }
            },
            //json的最大深度
            maxDepth:{
                type:Number
            },
            //json根的key
            rootObjectKey:{
                type:String,
                default:"Root"
            },
            //默认展开第几列
            defaultOpen:{
                type:[String,Number]
            },
            //动态数据源
            ds:{
                type:Object
            }
        },
        data() {
            return {
                jsonSource:typeof(this.data)==='string'?JSON.parse(this.data):this.data,
                canRender:false
            }
        },
        watch: {
            data(val){
                this.jsonSource = typeof(val)==='string'?JSON.parse(val):val
            }
        },
        computed:{
            p_defaultOpen(){
                return this.defaultOpen||0;
            }
        },
        created: function () {
            let t=this;
            //引入第三方vue组件  单独打包 json-tree-view.js
            const JsonTreeView = r => require.ensure([], () => r(require('vue-json-tree-view')), 'json-tree-view');
            JsonTreeView(function(TreeView){
                let Vue = require('vue');
                Vue.default.use(TreeView)
                t.canRender=true;
                setTimeout(function(){
                    let refs = t.$refs;
                    refs['bb-json'].$children[0].open = t.p_defaultOpen;
                },500);
             });
        },
        mounted:function(){
            this.getJson();
        },
        methods: {
            //获取动态数据
            getJson:function(){
                const t = this;
                if(t.ds){
                    _TY_Tool.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        t.jsonSource = typeof map[0].value == 'string'?JSON.parse(map[0].value):map[0].value;
                    }, function (code, msg) {
                    });
                } 
            },
            //外部设置值
            setJson:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        t.jsonSource = val.arguments;
                    }  
                })
            }
        }
    }
</script>