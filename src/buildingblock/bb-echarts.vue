<script>
    export default {
        name: 'bb-echarts',
        render: function (createElement) {
            var t = this;
            return createElement(
                t.chartType,
                {
                    props: {
                        publicConfig:t.publicConfig,
                        rows:t.realRows,
                        columns:t.realColumns,
                        settings:t.realSettings,
                        columnsDs:t.columnsDs,
                        dataDs:t.dataDs
                    }
                }
            );
        },
        props: {
            chartType:{
                type:String,
                default:'bb-echarts-line'
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
                        'width-change-delay':300
                    }
                }
            },
            rows:{
                type:[Array,String]
            },
            columns:{
                type:[Array,String]
            },
            settings:{
                type:[Array,String]
            },
            columnsDs:{
                type:Object
            },
            dataDs:{
                type:Object
            },
        },
        data() {
            return{
                realRows:typeof this.rows == 'string'?eval("("+this.rows+")"):this.rows,
                realColumns:typeof this.columns == 'string'?eval("("+this.columns+")"):this.columns,
                realSettings:typeof this.settings == 'string'?eval("("+this.settings+")"):this.settings
            }
        },
        created: function () {
        },
        mounted: function () {
        },
        methods: {
        },
        components: {
        },
    }

</script>