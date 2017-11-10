<script>
    // var _PBB_PREFIX = "pbb_form_";

    import Util from '../libs/util';
    export default {
        name: 'bb-form',
        render: function (createElement) {
            var t =this;
            var formItems = [];
            

            //创建FormItem
            this.realFields.forEach(function(field){
                //支持etProps
                var props = field['props'];
                var etProps = field['etProps'];
                t.formData = t.formData?t.formData : {};
                if(etProps){
                    etProps = eval("("+etProps+")");
                    props = etProps;
                }
                //创建InputField
                if(props){
                    props.value = t.formData[field['attributeName']];
                }else{
                    props = {
                        value:t.formData[field['attributeName']]
                    }
                }
                var defaultOn = {
                    input: function (val) {
                        t.formData[field['attributeName']] = val;
                    }
                };

                var pbbId = field['pbbId'];
                var itemOn = Object.assign({}, defaultOn);//传入事件监听
                var on = t.on;
                if(on){
                    on.forEach(function(_on,index){
                        if(pbbId == _on['pbbId']){
                            itemOn[_on['triggerEventName']] = t.$refs[_on['executePbbId']]?t.$refs[_on['executePbbId']][_on['executeBBMethodName']] : ''
                        }
                    });
                }

                var ref = pbbId;
                var item = createElement(field['et'],{
                    props:props,
                    on: itemOn,
                    ref:ref
                });

                var className = field['et'] == 'bb-hidden'?'form-item-hidden':'form-item';
                field['rules'] = typeof field['rules'] == 'string'?[]:field['rules']
                var formItem = createElement('el-form-item',{
                    class:className,
                    props:{
                        label:field['name'],
                        prop:field['attributeName'],
                        rules:field['rules']
                    }
                },[item]);
                formItems.push(formItem);
            });
            //取消按钮
            var cancelButton  = createElement('el-button',{
                    domProps:{
                        innerHTML:'取消'
                    },
                    style:{textAlign:'center'},
                    props:{type:''},
                    on:{
                        click:t.cancelCommit
                    }
                })
            //清空表单内容
            var cleanButton  = createElement('el-button',{
                    domProps:{
                        innerHTML:'清空内容'
                    },
                    style:{textAlign:'center'},
                    props:{type:''},
                    on:{
                        click:t.clearForm
                    }
                })

            //设置按钮
            formItems.push(createElement('el-form-item',{
                    props:{}
                },[cancelButton,cleanButton,createElement('el-button',{
                    domProps:{
                        innerHTML:this.settingButtonText
                    },
                    style:{textAlign:'center'},
                    props:{type:'primary'},
                    on:{
                        click:t.formCommit
                    }
                })]));

            //创建Form
            return createElement('el-form',{
                props:{
                    model:t.formData,
                    labelWidth:"100px"
                },on:{
                    submit:"return false;"
                },ref:"form"
            },formItems);
        },
        props: {
            fields:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            //处理fields之间的交互
            //[{pbbId:'',triggerEventName:'',executePbbId:'',executeBBMethodName:''}]
            on :{
                type:Array,
                default:function(){
                    return [];
                }
            },
            value:{
                type:[String,Object]
            },
            settingButtonText:{
                type:String,
                default:function(){
                    return "设置";
                }
            },
            buttonConfig:{
                type:Object,
                default:function(){
                    return {
                        action:null,//execute-ds url dialog-page code buzz
                        ds:null,
                        goUrl:null,
                        confirmTitle:null,
                        confirmText:null,
                        callback:'custom',//refresh
                        valueKey:null
                    }
                }
            },
            ds:null,//表单值
            dsFields:null//获取表单项
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.formData = val;
                } else if (typeof val === 'string') {
                    this.formData = (val ? JSON.parse(val) : {});
                }
                this.$emit("input",val);
            }
        },
        data() {
            return {
                formData:this.value,
                realFields:this.fields
            }
        },
        created: function () {
            this.getFields();
            this.getData();
        },
        mounted:function(){
        },
        methods: {
            clean: function () {
                this.formData = {};
                // this.$refs['form'].resetFields();
            },
            formCommit:function(){
                var t = this;
                this.$emit('input', this.formData);
                this.$refs['form'].validate(function(valid){
                    if(valid){
                        t.$emit('commit', t.formData);
                        Util.resolveButton(t.buttonConfig,{
                                'bb':t,
                                "router": t.$route.params,
                                'row-data':null,
                                'getData':t.getData
                            },t.afterCommit);
                    }
                });
            },
            afterCommit:function(button){
                const t = this;
                if(button.goUrl){
                    t.$router.push(button.goUrl);
                }
            },
            getFields: function () {
                var t = this;
                if (t.dsFields) {
                    Util.getDSData(t.dsFields, {"bb": t, "router": t.$route.params}, function (map) {
                        t.realFields = map[0].value;
                    }, function (code, msg) {
                    });
                }
            },
            getData: function () {
                var t = this;
                if (t.ds) {
                    Util.getDSData(t.ds, {"bb": t, "router": t.$route.params}, function (map) {
                        t.formData = map[0].value;
                    }, function (code, msg) {
                    });
                }
            },
            cancelCommit:function(){
                const t = this;
                t.$msgbox({
                    title: '消息',
                    message: '确认取消？',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        done();
                    }
                }).then(()=>{
                    t.$router.back()
                }).catch((err)=>{
                    console.log('err:',err);
                })
            },
            clearForm:function(){
                const t = this;
                t.$msgbox({
                    title: '消息',
                    message: '确认清空当前表单内容？',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        done();
                    }
                }).then(()=>{
                    t.formData = undefined;
                    t.formCommit();
                    //t.$router.back()
                }).catch((err)=>{
                    console.log('err:',err);
                })
            }
        }
    }
</script>

<style scoped>
    .form-item{
        /*margin-bottom: 5%;*/
    }
    .form-item-hidden{
        display: none;
    }
</style>