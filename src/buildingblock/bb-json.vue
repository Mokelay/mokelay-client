
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
            
        },
        created: function () {
            let t=this;
            //引入第三方vue组件  单独打包 json-tree-view.js
            const JsonTreeView = r => require.ensure([], () => r(require('vue-json-tree-view')), 'json-tree-view');
            JsonTreeView(function(TreeView){
                let Vue = require('vue');
                Vue.default.use(TreeView)
                t.canRender=true;
             });
        },
        mounted:function(){
        },
        methods: {
            
        }
    }
</script>