<script>
    import Vue from 'vue'
    export default {
        name: 'bb-echarts',
        render: function(createElement){
            const t = this;
            if(t.canRender){
                const tempPublicConfig = Object.assign({
                        width:'auto',
                        height:'400px',
                        'tooltip-visible':true,
                        'legend-visible ':true,
                        'legend-position':'top',
                        grid:null,
                        events:null,
                        'before-config':null,
                        'after-config':null,
                        loading:false,
                        'data-empty':false,
                        'judge-width':false,
                        'width-change-delay':300,
                        "colors":null
                    },t.publicConfig);
                const chart = createElement(t.chartType,{
                    props:Object.assign(tempPublicConfig,{
                            data:{columns:t.realColumns,rows:t.realRows},
                            settings:t.realSettings
                        }),
                    on:{},
                    ref:""
                },[]);
                return createElement('div',{class:''},[chart])
            }
        },
        props: {
            chartType:{
                type:String,
                default:'ve-pie'
            },
            publicConfig:{
                type:Object,
                default:function(){
                    return {
                        width:'auto',
                        height:'400px',
                        'tooltip-visible':true,
                        'legend-visible ':true,
                        'legend-position':'top',
                        grid:null,
                        events:null,
                        'before-config':null,
                        'after-config':null,
                        loading:false,
                        'data-empty':false,
                        'judge-width':false,
                        'width-change-delay':300,
                        "colors":null
                    }
                }
            },
            rows:{
                type:[Array,String]
            },
            columns:{
                type:[Array,String]
            },
            columnsDs:{
                type:Object
            },
            rowsDs:{
                type:Object
            },
            settings:{
                type:[Object,String]
            },
        },
        data() {
            return{
                realRows:null,
                realColumns:null,
                realSettings:null,
                canRender:false,
                external:{}
            }
        },
        created: function () {
            const t = this;
            t.realRows = typeof t.rows == 'string' && t.rows.length?eval("("+t.rows+")"):t.rows;
            t.realColumns = typeof t.columns == 'string' && t.columns.length?eval("("+t.columns+")"):t.columns;
            t.realSettings = typeof t.settings == 'string' && t.settings.length?eval("("+t.settings+")"):t.settings;
            t.getRow();
            t.getData();
        },
        mounted: function () {
        },
        methods: {
            //动态获取表头
            getRow: function () {
                const t = this;
                if (t.columnsDs) {
                    _TY_Tool.getDSData(t.columnsDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                           const dataKey = val.dataKey
                            t.realColumns = val.value;
                        })
                        t.loadCahrts();
                    }, function (code, msg) {
                    });
                }else{
                    t.loadCahrts();
                }
            },
            //动态获取数据
            getData: function () {
                const t = this;
                if (t.rowsDs) {
                    _TY_Tool.getDSData(t.rowsDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                           const dataKey = val.dataKey
                            t.realRows = val.value.list;
                        })
                        t.loadCahrts();
                    }, function (code, msg) {
                    });
                }else{
                    t.loadCahrts();
                }
            },
            //按需加载和渲染ve-line
            loadCahrts:function(){
                const t = this;
                require.ensure(['v-charts'],function(require){
                    const veChart = require('v-charts');
                    Vue.use(veChart)
                    t.canRender = true;
                },'v-charts')
            },
            //外部联动
            linkage:function(data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            }
        },
    }
</script>