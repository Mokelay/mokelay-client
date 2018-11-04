<!-- <template>
    <div class="bb-indep-list">
        <table class="table" :class="[{
            'table-bordered': realOption.border,
            'text-center': realOption.center
        }]">
            <thead>
                <tr>
                    <th v-if="realOption.index"><div class="cell">序号</div></th>
                    <th v-for="(column,key) in realColumns"><div class="cell">{{column.label || "操作"}}</div></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for ="(rowData,index) in tableData">
                    <td v-if="realOption.index">{{index+1}}</td>
                    <td v-for="(column,key) in realColumns">
                        <bb-layout-seriation v-if="column.content" :content="column.content"></bb-layout-seriation>
                        <span v-else>{{rowData[column.prop]}}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
 -->
<script>
    export default {
        name: 'bb-indep-list',
        render: function (createElement) {
            const t = this;
            const _table = t.renderTable(createElement);
            return _table;
        },
        props: {
            //table 外部传入数据
            value: {
                type: [Array,String],
                default: function () {
                    return []
                }
            },
            /*懒加载
                初始不加载数据，外部交互触发后加载
            */
            lazy:{
                type:Boolean,
                default: false
            },
            /*数据源  
                dynamic后端动态数据
                static静态数据
            */
            ds: {
                type: Object
            },
            /*表头数组
                [{
                    prop:null,  表头键值
                    label:'默认表单', 表头展示名称
                    列表内数据赛选条件
                    fixed:"right",
                    width:"120px",
                    content:[{  渲染内容积木 例如用 bb-photo-single 去渲染图片地址  bb-tag渲染标签
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        attributes:{},              //积木属性
                        animation:[{                //动画
                        }],
                        interactives:[{             //触发交互
                        }],
                        layout:{//积木布局}
                    }]
                }]
            */
            columns: {
                type: Array
            },
            /*其他属性
                index:true  展示序号
                border:true  是否有边框
                center:true  居中
                cellStyle:{ 内容单元格样式
                    color:'#FF0000'
                }
                cellStyle:{ 头部单元格样式
                    color:'#FF0000'
                }
                maxHeight:500 最大高度 超过滚动
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        index:true,
                        border:true,
                        center:true,
                        cellStyle:{},
                        headerCellStyle:{},
                        maxHeight:500
                    }
                }
            }
        },
        data() {
            return {
                realColumns:_TY_Tool.deepClone(this.columns),
                tableData: (this.value&&typeof(this.value)==='string')?eval(this.value):this.value||[],
                loading: false,
                realOption:this.option,
                page:1,
                pageSize:10,
                totalItems:0
            }
        },
        watch: {
            value(val) {
                const newData = (val&&typeof(val)==='string')?JSON.parse(val):val||[];
                this.tableData = newData;
            }
        },
        created: function () {
            const t = this;
            console.log("t.realColumns:",t.realColumns);
        },
        mounted:function(){
            if(!this.lazy){
                this.getData()
            }
            this.$emit('bb-mounted');
        },
        methods: {
            //渲染表格
            renderTable(createElement){
                const t = this;
                //表格头部创建
                const thArr = [];
                const headerCellStyle = _TY_Tool.setSimpleStyle(t.realOption.headerCellStyle);
                const cellStyle = _TY_Tool.setSimpleStyle(t.realOption.cellStyle);
                if(t.realOption.index){
                    const indexDiv = createElement('div',{class:"cell",props:{}},"序号");
                    const indexColumn = createElement('th',{props:{},style:headerCellStyle},[indexDiv]);
                    thArr.push(indexColumn)
                }
                t.realColumns.forEach((column,key)=>{
                    const thDiv = createElement('div',{class:"cell",props:{}},[column.label || "操作"]);
                    const th = createElement('th',{props:{},style:headerCellStyle},[thDiv]);
                    thArr.push(th);
                });
                const tr = createElement('tr',{props:{}},[thArr]);
                const thead = createElement('thead',{props:{}},[tr]);

                //表格内容创建
                const trArray = [];
                t.tableData.forEach((rowData,index)=>{
                    const tdArray = [];
                    if(t.realOption.index){
                        const tdIndex = createElement('td',{props:{},style:cellStyle},[index+1]); 
                        tdArray.push(tdIndex);
                    }
                    t.realColumns.forEach((column,key)=>{
                        let tdDiv = "";
                        if(column.content){
                            //数据解析到模板中去
                            let _content = _TY_Tool.tpl(JSON.stringify(column.content),_TY_Tool.buildTplParams(t,{
                                rowData:rowData
                            }));
                            tdDiv = createElement('bb-layout-seriation',{props:{content:JSON.parse(_content)}},[]);
                        }else{
                            tdDiv = createElement('span',{props:{}},[rowData[column.prop]]);
                        }
                        const td = createElement('td',{props:{},style:cellStyle},[tdDiv]);
                        tdArray.push(td);
                    });
                    const tr = createElement('tr',{props:{}},[tdArray]);
                    trArray.push(tr);
                });
                const tbody = createElement('tbody',{props:{}},[trArray]);

                //组装table
                let tableClass = "table";
                if(t.realOption.border){
                    tableClass = tableClass + " table-bordered";
                }
                if(t.realOption.center){
                    tableClass = tableClass + " text-center";
                }
                const table = createElement('table',{class:tableClass,props:{}},[thead,tbody]);
                return  createElement('div',{class:"bb-indep-list",props:{}},[table]);
            },
            //获取table数据
            getData(){
                var t = this;
                if (t.ds) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        t.ds.type = t.ds.type?t.ds.type:"dynamic";
                        if(t.ds.type == "dynamic"){
                          map.forEach(function (item) {
                            if(item['value']&&item['value']['list']){
                                t.tableData = item['value']['list'];
                            }else{
                                t.tableData = item['value'];
                            }
                            if(item['value']['currentRecords']){
                                t.totalItems = item['value']['totalRecords'];
                                t.tableData = item['value']['currentRecords'];
                            }
                          });
                        }else{
                            t.tableData = map;
                        }
                        t.loading = false;
                        t.$emit("loadData",{totalItems:t.totalItems,page:t.page,pageSize:t.pageSize});
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //外部刷新
            linkage(page,pageSize){
                const t = this;
                t.page = page?page:t.page ;
                t.pageSize = pageSize?pageSize:t.pageSize;
                t.getData();
            }
        }    
    }
</script>

<style lang='less'>
.bb-indep-list{
    .cell{
        position: relative;
        word-wrap: normal;
        vertical-align: middle;
        width: 100%;
        display: inline-block;
        box-sizing: border-box;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
    }
    .table{
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        -ms-flex: 1;
        flex: 1;
        width: 100%;
        max-width: 100%;
        background-color: #fff;
        font-size: 14px;
        color: #666;
    }
    thead {
        color: #444;
        font-weight: 500;
    }
    tr{
        background-color: #fff;
    }
    th{
        white-space: nowrap;
        overflow: hidden;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        text-align: left;
    }
    td{
        transition: background-color .25s ease;
    }
    th,td{
        padding: 12px 0;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
    }
    .table-bordered{
        border: 1px solid #efefef;
        border-right: none;
        border-bottom: none;
        th,td{
            border-right: 1px solid #efefef;
            border-bottom: 1px solid #efefef;
        }
    }
    .text-center{
        th,td{
            text-align: center;
        }
    }
}
</style>