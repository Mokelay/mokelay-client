<script>
    import Util from '../../libs/util';
    export default {
        name: 'bb-form',
        render: function (createElement) {
            const t = this;
            const _form_group = [];
            let _form = "";
            if(t.group){
                t.formData = Array.isArray(t.formData)?t.formData:[];
                t.contentGroup.forEach((content,key)=>{
                    t.formData[key] = t.formData[key]?t.formData[key]:{};
                    const removeButton = createElement('bb-button',{class:"remove",props:{button:{type:'text',icon:"ty-icon_tuichu"}},on:{click:t.remove.bind(null,key)}},[]);
                    const newForm = t.renderForm(createElement,content,t.formData[key],key);
                    const groupItem = createElement('div',{class:"groupItem"},[newForm,removeButton]);
                    _form_group.push(groupItem); 
                    _form = createElement('div',{},_form_group);
                });
            }else{
                const newForm = t.renderForm(createElement,t.content,t.formData,0);
                _form = newForm; 
            }
            return _form;
        },
        props: {
            //不在使用，被content代替
            fields:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            //处理fields之间的交互
            //[{pbbId:'',triggerEventName:'',executePbbId:'',executeBBMethodName:''}]
            //不在使用，被content代替
            on :{
                type:[Array,String],
                default:function(){
                    return [];
                }
            },
            value:{
                type:[String,Object],
                default:function(){
                    return {}
                }
            },
            //默认值
            defaultValTpl:{
                type:String,
                default:''
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
            ds:{//表单值
                type:Object
            },
            dsFields:{//获取表单项
                type:Object
            },
            showCancelButton:{
                type:Boolean,
                default:false
            },
            showCleanButton:{
                type:Boolean,
                default:false
            },
            hideSubmitButton:{
                type:Boolean,
                default:false
            },
            parentData:{
                type:[String,Object],
                default:function(){
                    return {
                        'bb':null,
                        "router": null,
                        'row-data':null,
                        'getData':null
                    }
                }
            },
            //表单内部组件的尺寸medium / small / mini
            size:{
                type:String,
                default:''
            },
            //表单域标签的位置right/left/top
            labelPosition:{
                type:String,
                default:'left'
            },
            labelWidth:{
                type:String,
                default:'auto'
            },
            labelInline:{
                type:Boolean,
                default:false
            },
            /*
                content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:''    //表单项键值别名
                            rules:[]            //验证规则
                            width:''            //表单项宽度
                            ........            //其他积木属性
                        },              //积木属性
                        animation:[{                //动画
                            style:"",               //方式
                            time:0,                 //时间
                            delay:0,                //延迟时间
                            playNum:1               //播放次数
                            loop:true|false,        //循环
                            direction:""            //方向
                        }],
                        interactives:[{             //触发交互
                            uuid:'',
                            fromContentEvent:'',    //触发积木的事件,fromContentUUID为当前content的UUID
                            executeType:'',         //执行类型(预定义方法 trigger_method,
                                                    //自定义方法 custom_script,
                                                    //容器类方法 container_method)
                            executeScript:'',       //执行脚本 executeType = custom_script
                            executeContentUUID:'',  //执行积木的UUID executeType = trigger_method
                            executeContentMethodName:'',
                                                    //执行积木的方法
                            containerMethodName:''  //容器方法 executeType = container_method
                        }],
                        layout:{                    //积木布局
                            sort:0,                 //排序 顺序排列布局下有效
                            bgColor:"",             //背景颜色
                            rotate:0,               //旋转
                            transparency:0,         //透明度
                            border:{                //边框
                                style:"",           //边框样式
                                color:"",           //边框颜色
                                size:"",            //边框尺寸
                                radius:"",          //边框弧度
                                margin:""           //边距
                            },
                            shadow:{                //阴影
                                color:"",           //阴影颜色
                                size:"",            //阴影大小
                                direction:'',       //阴影方向
                                vague:''            //阴影模糊
                            }
                        }
                    }]
            */
            content:{
                type:Array
            },
            //开启 则会自动flex排列  不开启默认从上往下排列
            grid:{
                type:Boolean,
                default:false
            },
            group:{
                type:Boolean,
                default:false
            }
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.formData = val;
                    this.getContentGroup();
                } else if (typeof val === 'string') {
                    this.formData = (val ? eval("("+this.value+")") : {});
                    this.getContentGroup();
                }
            },
            fields(val){
                this.realFields = this.fields;
            },
            // formData:{
            //     handler:(val,oldVal)=>{
            //         debugger;
            //     },
            //     deep:true
            // },
            dsFields(val){
                this.getFields();
            },
            on(val){
                if(val){
                    this.p_on = val;
                }
            }
        },
        data() {
            return {
                p_on:this.on,
                initValue:null,
                formData:{},
                commitFormData:null,//因为表单提交后需要清空表单数据，但有时候又需要表单提交的值，所以这里缓存一个清空前的表单数据
                realFields:null,
                contentGroup:[this.content]
            }
        },
        created: function () {
            const t = this;
            t.formData = typeof t.value == 'string' && t.value.length?eval("("+t.value+")"):t.value;
            t.formData = t.formData?t.formData:{};
            t.initValue=(typeof(this.value) == 'string' && this.value.length)?eval("("+this.value+")"):this.value;
            t.realFields = t.fields;
            t.getFields();
            t.getData();
            //初始化表单项
            t.getContentGroup();
        },
        mounted:function(){
            const t = this;
            /*bb-mounted 
                bb-form初次渲染回填初始化值后 触发此事件 
                设置setTimeout防止事件触发时目标方法积木还未渲染*/
            setTimeout(()=>{t.$emit('bb-mounted',null,{bb:t})},0);
            //初始化form表单值
            _TY_Tool.buildDefaultValTpl(t,'formData',true);
        },
        methods: {
            //渲染表单
            renderForm:function(createElement,content,formData,formKey){
                var t =this;
                var formItems = [];
                var bbContent = [];
                //创建FormItem
                if(content){
                    bbContent = content;
                    bbContent.forEach((bb,key)=>{
                        bb.attributes.value = formData?formData[bb['attributes']['attributeName']]:'';
                    });
                }else{
                    t.realFields = t.realFields?t.realFields:[];
                    t.realFields.forEach(function(field){
                        //支持etProps
                        var props = field['props'];
                        var etProps = field['etProps'];
                        formData = formData?formData : {};
                        if(etProps){
                            try{
                                etProps = eval("("+etProps+")");
                            }catch(error){
                                etProps = eval(etProps);
                            }
                            props = etProps;
                        }
                        //创建InputField
                        if(props){
                            props.value = formData[field['attributeName']];
                        }else{
                            props = {
                                value:formData[field['attributeName']]
                            }
                        }
                        var pbbId = field['pbbId'];
                        var on = [];
                        if(t.p_on == ""){
                           on = []; 
                        }else{
                           on = typeof t.p_on == "string"?eval("("+t.p_on+")"):t.p_on;
                        }
                        var interactives = [];
                        if(on){
                            on.forEach(function(_on,index){
                                if(pbbId == _on['pbbId']){
                                    var newInteractives = {       //触发交互
                                        uuid:_TY_Tool.uuid(),
                                        fromContentEvent:_on['triggerEventName'],
                                        executeType:'trigger_method',         //执行类型(预定义方法 trigger_method,
                                        executeContentUUID:_on['executePbbId'],  //执行积木的UUID executeType = trigger_method
                                        executeContentMethodName:_on['executeBBMethodName'],
                                        executeArgument:_on['executeArgument']//执行参数
                                    }
                                    interactives.push(newInteractives);
                                }
                            });
                        }
                        props['rules'] = field['rules'];
                        props['attributeName'] = field['attributeName'];
                        props['show'] = field['show'];
                        props['width'] = field['width'];
                        props['mark'] = field['description'];
                        props['tip'] = field['tip'];
                        props['itemMargin'] = field['itemMargin'];
                        const bbEle = {
                            uuid: field['pbbId'] || _TY_Tool.uuid(),
                            alias: field['et'], //积木别名
                            aliasName: field['name'], //中文名称
                            group:field['group'],
                            attributes: props, //积木属性
                            animation: [], //动画
                            interactives: interactives, //触发交互
                            layout: field['layout'] || {} //积木布局
                        }
                        bbContent.push(bbEle);
                    });
                }
                //有group分组的项
                const groups = {};
                //没有group分组的项
                const normalItems = [];
                bbContent.forEach((field,key)=>{
                    var ref = 'form-item_' + (field['uuid']?field['uuid']:_TY_Tool.uuid());
                    field['rules'] = typeof field['attributes']['rules'] == 'string'?eval(field['attributes']['rules']):field['attributes']['rules'];
                    var formItem = createElement('bb-form-item',{
                        // key: ref,// 注释掉 解决form表单change一处，全部都刷新的bug
                        props:{
                            label:field['aliasName'],
                            prop:field['attributes']['attributeName'],
                            rules:field['rules'],
                            show:field['attributes']['show'],
                            contentItem:field
                        },
                        on:{
                            //为每一项添加默认的输入事件 配合defaultVmodel方法实现v-model语法糖
                            change: function (val) {
                                t.$set(t.formData,field['attributes']['attributeName'],val);
                            }
                        },
                        ref: ref,
                        style: {
                            'width': field['attributes']['width'] || 'auto',
                            'margin-bottom':field['attributes']['itemMargin'] || '10px',
                            'box-sizing': 'border-box;'
                        },
                        attrs:{
                            aliasName:field['aliasName'] + '_edit'
                        }
                    },[]);

                    if(field['group']){
                        const groupName = field['group'];
                        if(groups[groupName]){
                            groups[groupName].push(formItem);
                        }else{
                            groups[groupName] = [];
                            groups[groupName].push(formItem);
                        }
                    }else{
                        normalItems.push(formItem);
                    }
                });
                Object.keys(groups).forEach((key,index)=>{
                    var key_contents = createElement('el-collapse-item',{
                        props:{
                            title:key,
                            name:index
                        },
                    },groups[key]);
                    var group_content = createElement('el-collapse',{
                        props:{
                            title:key,
                            name:index
                        },
                    },[key_contents]);
                    formItems.push(group_content);
                })
                formItems = formItems.concat(normalItems);

                //取消按钮
                var cancelButton = createElement('el-button',{
                        domProps:{
                            innerHTML:'取消'
                        },
                        style:{textAlign:'center'},
                        props:{type:''},
                        on:{
                            click:t.cancelCommit
                        }
                    })
                if(!t.showCancelButton){
                    cancelButton = null
                }
                //清空表单内容
                var cleanButton = createElement('el-button',{
                        domProps:{
                            innerHTML:'清空内容'
                        },
                        style:{textAlign:'center'},
                        props:{type:''},
                        on:{
                            click:t.clearForm
                        }
                    })
                if(!t.showCleanButton){
                    cleanButton = null
                }
                //提交按钮
                var submitButton = createElement('el-button',{
                        domProps:{
                            innerHTML:this.settingButtonText
                        },
                        style:{textAlign:'center'},
                        props:{type:'primary'},
                        on:{
                            click:t.formCommit.bind(null,formData,formKey)
                        }
                    })
                if(t.hideSubmitButton){
                    submitButton = null
                }
                //设置按钮
                formItems.push(createElement('el-form-item',{
                        props:{},
                        style:{'width':t.labelInline?'auto':'100%'},
                    },[cancelButton,cleanButton,submitButton]));

                //创建Form
                let parentTap = null;
                //根据当前表单环境设置样式
                if(this.$parent.$parent && this.$parent.$parent.$vnode){
                    parentTap = this.$parent.$parent.$vnode.componentOptions.tag
                }
                let formClass = '';
                if(parentTap == 'bb-form-item'){
                    formClass = 'border';
                }
                if(t.grid){
                    formClass = formClass + ' grid';
                }
                return createElement('el-form',{
                    props:{
                        model:formData,
                        labelWidth:t.labelWidth,
                        inline:t.labelInline,
                        'label-position':t.labelPosition,
                        size: t.size
                    },on:{
                        submit:"return false;"
                    },ref:"form_"+formKey,
                    class:formClass,
                    key:formKey
                },formItems);
            },
            //显示和隐藏的uuid数组
            hideAndShowFormItem:function(showArray,hideArray){
                let t=this;
                if(showArray instanceof Array && hideArray instanceof Array){
                    showArray.forEach(function(uuid){
                        t.$refs[uuid].itemShow();
                    });
                    hideArray.forEach(function(uuid){
                        t.$refs[uuid].itemHide();
                    });
                }
            },
            clean: function () {
                this.formData = {};
            },
            formCommit:function(eleFormData,key){
                var t = this;
                const realKey = typeof key != 'number'?0:key;
                let formData = typeof eleFormData == 'undefined'?t.formData:eleFormData;
                t.$refs["form_"+realKey].validate(function(valid){
                    if(valid){
                        t.$emit('commit', formData);
                        t.commitFormData = _TY_Tool.deepClone(formData);
                        if(!t.buttonConfig || !t.buttonConfig.action){
                           t.$emit('input', formData); 
                        }
                        /*buttonConfig
                            提交按钮的配置
                            此处需要用bb-button重构*/
                        Util.resolveButton(t.buttonConfig,_TY_Tool.buildTplParams(t,{
                                'row-data':t.parentData['row-data'],
                                'getData':t.getData
                            })).then(()=>{
                            //清空表单项
                            t.$emit('input', t.initValue||{});
                            formData = t.initValue||{};
                        }).catch(()=>{
                            t.$emit('input', formData);
                        });
                    }
                });
            },
            afterCommit:function(button){
                const t = this;
                if(button.goUrl){
                    const url = _TY_Tool.tpl(button.goUrl, _TY_Tool.buildTplParams(t));
                    t.$router.push(url);
                }
            },
            //获取表单项
            getFields: function () {
                var t = this;
                if (t.dsFields) {
                    Util.getDSData(t.dsFields, _TY_Tool.buildTplParams(t,{'row-data':t.parentData['row-data']}), function (map) {
                        t.realFields = map[0].value;
                    }, function (code, msg) {
                    });
                }
            },
            //获取表单值
            getData: function () {
                var t = this;
                if (t.ds) {
                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t,{'row-data':t.parentData['row-data']}), function (map) {
                        t.formData = map[0].value;
                        t.$emit("afterLoadData",t.formData,t);
                    }, function (code, msg) {
                    });
                }
            },
            cancelCommit:function(){
                const t = this;
                t.$emit('cancel',t.formData);
            },
            //清空表单没有提示框
            clearFormWithoutConfirm:function(){
                const t = this;
                t.formData = {};
                let _refs = t.$refs;
                for(let i in _refs){
                    if(i.startsWith('form-item_')){
                        _refs[i].clearFormItem();
                    }
                }
            },
            //清空表单
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
                    t.clearFormWithoutConfirm();
                    // t.formCommit();
                }).catch((err)=>{
                    console.log('err:',err);
                })
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //外部交互动态设置表单值
            setFormData:function(...args){
                const t = this;
                if(args[0]&&args[0] instanceof Array && args[0].length>0&&args[0][0]&&args[0][0].hasOwnProperty('value')&&args[0][0].value){
                    //如果是一个 ds返回的map对象
                    t.formData = Object.assign({},t.formData,args[0][0].value);
                    return;
                }
                args.forEach((val,key)=>{
                    if(val.type == 'custom'){
                        t.formData = Object.assign({},t.formData,val.arguments);
                    }
                })
            },
            //外部刷新表单项
            setFields:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        Util.getDSData(val.arguments, _TY_Tool.buildTplParams(t,{'row-data':t.parentData['row-data']}), function (map) {
                            t.realFields = map[0].value;
                        }, function (code, msg) {
                        });
                    }  
                })
            },
            //复制表单
            copy:function(){
                const t = this;
                const newContent = _TY_Tool.copyContent(t.content);
                t.contentGroup.push(newContent);
            },
            //删除表单
            remove:function(key){
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
                    //删除表单
                    if(t.contentGroup.length == 1){
                        return;
                    }
                    t.contentGroup.splice(key,1);
                    //清空该项表单数据
                    if(Array.isArray(t.formData) && t.formData[key]){
                        t.formData.splice(key,1);
                    }
                }).catch((err)=>{
                    console.log('err:',err);
                })
            },
            //根据数据格式初始化 表单content数组  
            getContentGroup:function(){
                const t = this;
                if(Array.isArray(t.formData)){
                    t.formData.forEach((val,index)=>{
                        t.copy();
                    })
                }
            }
        }
    }
</script>

<style lang="less">
    .form-item{
        /*margin-bottom: 5%;*/
    }
    .form-item-hidden{
        display: none;
    }
    .grid{
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .border{
        border:1px dashed #ccc;
        padding: 5px 0 5px 5px;
    }
    .groupItem{
        position: relative;
        .remove{
            color:#333333;
            position: absolute;
            right: 0px;
            top: -20px;
            opacity:0;
        }
        &:hover{
            .remove{
                opacity:1;
                transition: opacity .5s;
            }
        }
    }
</style>