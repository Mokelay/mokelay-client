<script>
    import Util from '../libs/util.js'
    export default {
        name: 'bb-tree',
        render: function (createElement) {
            const t = this;
            if(t.canRender) {
                let treeDom = createElement('el-tree', {
                    'class': 'bn',
                    attrs: {

                        'show-checkbox': true,
                        'node-key': t.nodeValue,
                        'highlight-current': true,
                        'default-checked-keys': t.checkedField
                    },
//                    domProps:{
//                        value:t.value
//                    },
                    props: {
                        data: t.data,
                        props:{
                            children: 'children',
                            label: t.nodeText,
                            isLeaf: 'leaf'
                        }
                    },
                    on: {
                        'node-expand': t.openNode,
                        'check-change': t.checkChange
                    },
                    key: t.randomKey,
                    ref: 'tree'
                }, []);
                let confirmBtn = createElement('el-button', {
                    'class': 'fr',
                    domProps: {
                        innerHTML: '确定'
                    },
                    attrs: {type: 'primary'},
                    on: {
                        click: t.formCommit
                    }
                }, []);

                return createElement('div', {}, [treeDom, confirmBtn]);
            }
        },
        props: {
            value: {
                type: String
            },
            nodeValue:{
                type:String,
                default:'id'
            },
            nodeText:{
                type:String,
                default:'name'
            },
            parentKey:{
                type:String,
                default:'parentId'
            },
            mainKey:{
                type:String,
                default:'id'
            },
            multiple: {
                type: Boolean,
                default: false
            },
            checkedField: {
                type: Array
            },
            opts:{
                type:Array
            },
            ds: {
                type: Object
            }
        },
        data() {
            return {
                data: null,
                canRender:false
            }
        },
        computed: {
            randomKey(){
                return ""+Math.floor(Math.random()*10000);
            }
        },
        created: function () {
            const t=this;
            t.getData();
        },
        mounted:function(){
        },
        methods: {
            openNode: function (node) {
                const t = this;
                if(node&&node[t.nodeValue]){
                    t.getData(node[t.nodeValue]);
                }
            },
            formCommit(){
                const t=this;
                let checkedNode = t.$refs.tree.getCheckedNodes();
                let newCheckedNode = [];//所有字段
                let checkedNodeVal =[];//只有配置的主键字段
                //过滤掉空字段的数据  element的bug
                if(checkedNode&&checkedNode.length>0){
                    checkedNode.forEach(function(item){
                        if(item[t.nodeValue]){
                            newCheckedNode.push(item);
                            checkedNodeVal.push(item[t.nodeValue]);
                        }
                    });
                }
                //触发到父组件处理
                if (!this.multiple) {
                    this.$emit("input", checkedNodeVal[0]);//让父组件能用v-model
                }else{
                    this.$emit("input", checkedNodeVal.join(","));//让父组件能用v-model
                }
                //往上级传送选择的字段
                this.$emit("tree-commit", newCheckedNode);
            },
            //勾选改变后
            checkChange(data, check, childCheck){
                const t=this;
                if (check && !this.multiple) {//多选的话
                    this.$refs.tree.setCheckedKeys([]);
                    this.$refs.tree.setCheckedKeys([data[t.nodeValue]]);
                }
            },
            getData: function (parentId) {
                var t = this;
                if (t.ds) {
                    t._parentId = parentId||0;//默认是0 ，查询根列表
                    let inputs = t.ds.inputs;
                    let hasParam = false;
                    inputs.forEach(function(item){
                        if(item.paramName==t.parentKey){
                            hasParam=true;
                            item.constant=t._parentId;
                        }
                    });
                    if(!hasParam){
                        //没有这个参数
                        inputs.push({
                            paramName: t.parentKey,
                            valueType: "constant",
                            constant: t._parentId
                        });
                    }
                    Util.getDSData(t.ds, {"bb": t, "router": t.$route.params}, function (map) {
                        let list = [];
                        if(!map||map.length<=0){
                            return;
                        }
                        map[0]['value'].forEach((item, key)=> {
                            if(item['child_num']&&item['child_num']>0){
                                //非叶子节点
                                item.children=[{
                                    id:''//随便加一条  能显示下拉按钮就行
                                }]
                            }else{
                                item.leaf=true;
                            }
                            list.push(item);
                        });
                        if(t._parentId&&t._parentId!=0){
                            //说明不是根
                            if(t.data&&t.data.length>0){
                                t._fillChild(t.data,t._parentId,list);
                            }
                        }else{
                            //是根节点
                            t.data= list;
                        }
                        t.canRender = true;
                    }, function (code, msg) {
                    });
                } else if(t.opts&&t.opts.length>0) {
                    t.data = t.opts;
                    t.canRender = true;
                }
            },
            _fillChild(data,parentId,list){
                const t=this;
                if(!data){
                    return;
                }
                let found =false;
                data.forEach(function(item,index){
                    if(item[t.nodeValue]==parentId){
                        item.children=list;
                        found=true;
                    }
                });
                if(!found){
                    //没有找到
                    data.forEach(function(item,index){
                        if(item.children&&item.children.length>0){
                            let hasFound = t._fillChild(item.children,parentId,list);
                            if(hasFound){
                                found = true;
                                return true;
                            }
                        }
                    });
                }
                return found;
            }
        }
    }
</script>

<style scoped>

    .bn {
        border: none
    }

    .fr {
        float: right;
    }

</style>