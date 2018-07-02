<template>
    <div class="ty_report">
        <div class="ty_report_box" v-for="(item,index) in p_options">
            <div class="ty_report_line" v-if="index!=p_options.length-1"></div>
            
            <div :class="[(item.editFlag?'active':''),'ty_report_circle']">
                <span>{{buildDate(item.createDate).date}}</span>
                <span class="db cc">周{{buildDate(item.createDate).day}}</span>
            </div>

            <div class="ty_report_content flex">
                <div class="report_edit_box flex-wrap">
                    <span class="edit_btn" v-if="!item.editFlag" @click="edit(item,index)"><i class="iconfont ty-icon_bianji"></i></span>
                    <span class="edit_btn" v-if="item.editFlag" @click="save(item,index)">
                        <i class="iconfont ty-icon_chenggong_lv"></i>
                        <span class="db">保存</span>
                    </span>
                </div>
                <div class="report_edit_content flex1">
                    <span v-if="showMark" class="content_bottom">
                        <span style="color:#0091EA">{{item.text.length}}</span>/<span style="color:#aaa">{{maxLength||500}}</span>
                    </span>
                    <textarea class="content_area" :readonly="!item.editFlag" name="text" rows="3" :placeholder="placeholder" @input="areaInput(arguments,item,index)" :maxlength="maxLength">{{item.text}}</textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    // 日报链编辑组件
    export default {
        name: 'bb-indep-report-chain',
        props: {
            /** 静态数据源
                [{
                    editFlag:false,
                    text:'测试日报',
                    userId:'',
                    createDate:'2018-07-02 17:11:11'
                },{
                    editFlag:false,
                    text:'测试日报2',
                    userId:'',
                    createDate:'2018-07-02 17:11:11'
                }];
            */
            options:{
                type:[Array,String]
            },
            //数据源
            ds:{
                type:Object
            },
            //提示文案
            placeholder:{
                type:String,
                default:'请输入内容'
            },
            //最大长度
            maxLength:{
                type:Number
            },
            //是否显示角标
            showMark:{
                type:Boolean,
                default:true
            },
            //保存ds
            saveDs:{
                type:Object
            }

        },
        data() {
            return {
                p_options:typeof(this.options)==='string'?JSON.parse(this.options):this.options,
                focusItem:-1,//focus 的那个item index
                buildDate:_TY_Tool.getDayByDate,//模板中需要用的这个方法
                external:{}
            }
        },
        computed:{

        },
        watch: {
            
        },
        created: function () {
            let t=this;
            t.loadData();
        },
        mounted:function(){
            
        },
        methods: {
            //外部联动 接收交互参数
            linkage:function(...data){
                const t = this;
                if(data){
                    t.external['linkage'] = data;
                    t.loadData();
                }
            },
            loadData:function(){
                let t=this;
                if(t.ds){
                    _TY_Tool.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        if(map&&map.length>0&&map[0]&&map[0].value){
                            let result = map[0].value;
                            if(t.p_options.hasOwnProperty("list")){
                                result = t.p_options.list;
                            }
                            t.p_options = result;
                        }
                    }, function (code, msg) {
                        t.$message({
                            type: 'error',
                            message: '数据获取失败，'+msg
                        });
                    });
                }
            },
            //edit 点击事件
            edit:function(item,index){
                let t=this;
                t.$set(t.p_options[index],'editFlag',true);
                t.focusItem = index;//聚焦
            },
            //编辑后的保存事件
            save:function(item,index){
                let t=this;
                t.$set(t.p_options[index],'editFlag',false);
                //保存事件
                t.$emit('save',item,t);
                if(t.saveDs){
                    _TY_Tool.getDSData(t.saveDs,_TY_Tool.buildTplParams(t,{
                        rowData:item
                    }),function(map){
                        //保存成功事件
                        t.$emit('save-success',item,t);
                    },function(code,msg){
                        t.$message({
                            type: 'warning',
                            message: msg || '操作失败'
                        });
                    });
                }
            },
            //文本域输入事件
            areaInput:function(args,item,index){
                let t=this;
                if(t.showMark){
                    //显示角标，才重新设值，否则不设值
                    const val = args[0].srcElement.value;
                    t.$set(t.p_options[index],'text',val);
                }
            }


        }
    }
</script>

<style scoped>
    .ty_report{

    }
    .db{
        display: block;
    }
    .ty_report_box{
        margin-left: 42px;
        margin-top: 16px;
        position: relative;
    }
    .ty_report_content{
        margin-left: 68px;
        color: #444;
        font-size: 14px;
        line-height: 1.5em;
        word-break: break-all;
        border:1px solid #ccc;
    }
    .report_edit_box{
        width: 80px;
        border-right: 1px solid #ccc;
        background-color: #efefef;
        color:#0091EA;
    }
    .report_edit_box .edit_btn{
        cursor: pointer;
        width: 100%;
        display: block;
        height: 100px;
        text-align: center;
        line-height: 24px;
        padding-top: 20px;
    }
    .report_edit_box .edit_btn i{
        font-size: 24px;
    }
    .ty_report_circle{
        border-radius: 44px;
        width: 88px;
        height: 88px;
        position: absolute;
        color:#9b9b9b;
        left: -44px;
        top:0;
        text-align: center;
        padding-top: 22px;
        background: #fff;
        border: 1px solid #ccc;
        font-size: 14px;
        color:#444;
    }
    .ty_report_circle.active{
        color: #fff;
        background-color: #0091EA;
        border-color: #0091EA;
    }
    .ty_report_circle.active span{
        color: #fff;
    }
    .ty_report_line{
        position: absolute;
        width: 1px;
        height: 100%;
        background: #ccc;
        margin-top: 80px;
    }
    .report_edit_content{
        padding: 20px 20px 15px 20px;
        position: relative;
    }
    .content_area{
        outline: none;
        width: 100%;
        border: 0px;
        margin: 0px;
        font-size: 14px;
    }
    .content_bottom{
        font-size: 12px;
        position: absolute;
        right: 30px;
        bottom: 15px;
    }
    .cc{
        color:#aaa
    }
    

</style>