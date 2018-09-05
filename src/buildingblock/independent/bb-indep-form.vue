<script>
    import AsyncValidator from 'async-validator';
    export default {
        name: 'bb-indep-form',
        components: {
        },
        props: {
            /*表单值 支持v-model*/
            value:{
                type:Object
            },
            //动态表单值
            formDataDs:{
                type:Object
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
                type:Array,
                default:function(){
                    return [{                      //页面内容
                        uuid:'1',
                        alias:'bb-vant-search',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'a'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    },{                      //页面内容
                        uuid:'2',
                        alias:'bb-vant-field-number',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'b'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    },{                      //页面内容
                        uuid:'3',
                        alias:'bb-vant-field',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'c'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    },{                      //页面内容
                        uuid:'4',
                        alias:'bb-vant-radio-group',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'d'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    },{                      //页面内容
                        uuid:'5',
                        alias:'bb-vant-password-input',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'e'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    }];
                }
            },
            //提交ds
            commitDs:{
                type:Object
            },
            //其他属性设置
            option:{
                type:Object,
                default:function(){
                    return {
                        itemStyle:{
                            display:"block",
                            border:{                //边框
                                margin:"5px 0"           //外边距
                            },
                        },
                        labelStyle:{
                            display: "inline-block",
                            size:{
                                width:"80px"
                            },
                            font:{
                                size:"12px",
                            }
                        },
                        messageStyle:{
                            display:"flex",
                            border:{
                                margin:"0 5px"
                            },
                            font:{
                                size:"12px",
                                color:"#f56c6c",
                            }
                        }
                    };
                }
            }
        },
        data() {
            return {
                formData:this.value || {},
                realContent:this.content,
                //验证信息
                validateMessageObj:{},
                shouldRender:true
            };
        },
        render: function(createElement){
            const t = this;
            const bbList = t.renderContent(createElement);
            return createElement('form',{props:{},attrs:{action:''},class:"bb-indep-form"},bbList);
        },
        computed:{
        },
        watch: {
            validateMessageObj(){
            },
        },
        created: function () {
            let t = this;
            t.getData();
        },
        mounted:function(){
            let t = this;
            t.$emit("mounted",t);
        },
        methods: {
            onSearch(){

            },
            onCancel(){

            },
            renderContent(createElement){
                const t = this;
                t.shouldRender = false;
                let newContent = [];
                //不分组的表单项
                let normalItems = [];
                //分组的表单项
                let groups = {};
                //最终返回的实例化对象数组
                let bbList = [];
                if(t.realContent[0].alias == "bb-layout-seriation" || t.realContent[0].alias.indexOf("vant") != -1){
                    let newContent = [];
                    t.realContent.forEach((ele,key)=>{
                        const content = _TY_Tool.deepClone(ele);
                        //每个formItem 都有一个 input事件，实现v-model
                        const FormItemInteractive = {
                            uuid:_TY_Tool.uuid(),
                            fromContentEvent:'input',
                            executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                            containerMethodName:'defaultVmodel'
                        };
                        content["interactives"] = content["interactives"]?content["interactives"].concat([FormItemInteractive]):[FormItemInteractive];
                        //对应字段名称
                        const attributeName = content["attributes"]["attributeName"];
                        //给表单项赋值
                        content["attributes"]["value"] = t.formData[attributeName];
                        newContent.push(content);
                    });
                    const bbList = _TY_Tool.bbRender(newContent, createElement, t);
                    return bbList;
                }
                t.realContent.forEach((ele,key)=>{
                    let content = _TY_Tool.deepClone(ele);
                    if(content.attributes.show == undefined){
                        content.attributes.show = true;
                    }
                    if(!content || !content.attributes.show){
                        return true;
                    }
                    //每个formItem 都有一个 input事件，实现v-model
                    const FormItemInteractive = {
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'input',
                        executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                        containerMethodName:'defaultVmodel'
                    };
                    //onBlur表单验证
                    const blurValidate = {
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'blur',
                        executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                        containerMethodName:'blurValidate'
                    };
                    //onchange表单验证
                    const changeValidate = {
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'change',
                        executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                        containerMethodName:'changeValidate'
                    };
                    content["interactives"] = content["interactives"]?content["interactives"].concat([FormItemInteractive]):[FormItemInteractive];
                    content["interactives"].push(blurValidate);
                    content["interactives"].push(changeValidate);
                    //对应字段名称
                    const attributeName = content["attributes"]["attributeName"];
                    //给表单项赋值
                    content["attributes"]["value"] = t.formData[attributeName];
                    const itemStyle = _TY_Tool.setStyle({layout:t.option.itemStyle},t);
                    const labelStyle = _TY_Tool.setStyle({layout:t.option.labelStyle},t);
                    const messageStyle = _TY_Tool.setStyle({layout:t.option.messageStyle},t);

                    const rules = content.attributes.rules;
                    let required = false;
                    if(rules && rules.length){
                        rules.forEach((rule,index)=>{
                            required = rule.required
                        })
                    }
                    let label = createElement("span",{style:labelStyle,class:required?"form-item__label":""},[content.aliasName]);
                    const validateMessage = createElement("span",{style:messageStyle},[t.validateMessageObj[content.attributes.attributeName]]);
                    if(content.attributes.hideLabel){
                        label = ""
                    }
                    const formEditor = _TY_Tool.bbRender([content], createElement, t);
                    const formItem = createElement("span",{style:itemStyle},[label,formEditor,validateMessage]);
                    if(content['group']){
                        const groupName = content['group'];
                        if(groups[groupName]){
                            groups[groupName].push(formItem);
                        }else{
                            groups[groupName] = [];
                            groups[groupName].push(formItem);
                        }
                    }else{
                        normalItems.push(formItem);
                    }
                    //newContent.push(content);
                });
                bbList = bbList.concat(normalItems);
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
                    bbList.push(group_content);
                });
                return bbList;
            },
            //动态获取卡片内容
            getData(){
                const t = this;
                if (t.formDataDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.formDataDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            let _value = {};
                            if(item['value']&&item['value']['currentRecords']){
                                _value = item['value']['currentRecords'];
                                const totalPage = item['value']['totalPages'];
                                if(t.page>=totalPage){
                                    t.end=true;
                                }else{
                                    t.end=false;
                                }
                            }else if(item['value']&&item['value']['list']){
                                _value = item['value']['list'];    
                            }else{
                                _value = item['value'];
                            }
                            t.formData = _value;
                            t.$emit("afterLoadData",t);
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            /* defaultVmodel  bb-form实现createElement中的v-model
                由于createElement中暂时没有找到实现v-model的方式，
                defaultVmodel配合input事件实现v-model功能.
                表单中的编辑器输入时都会默认触发该方法.
                @val:积木触发事件时传给方法的参数[data,data2....],例如linkage(data)
                @t:当前容器积木
                @bb:触发事件的积木
            */
            defaultVmodel(val,...params){
                const t = this;
                params.forEach((param,key)=>{
                    if(param.alias){
                        const attributeName = param.attributes.attributeName;
                        t.formData[attributeName] = val
                        t.validate("input",attributeName)
                    }
                })
                this.$emit('input',t.formData);
                this.$emit('change',t.formData);
            },
            //外部获取表单值
            getFormData(){
                return this.formData;
            },
            //提交表单
            commit(){
                const t = this;
                if (t.commitDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.commitDs, _TY_Tool.buildTplParams(t), function (data) {
                        t.$emit("commitSuccess",data);
                    }, function (code, msg) {
                        t.loading = false;
                        t.$emit("commitFail");
                    });
                }
            },
            //外部联动刷新表单
            linkage(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            },
            //表单验证
            validate(trigger,attributeName,callback = function(){}) {
                const t = this;
                this.validateDisabled = false;
                var rules = this.getFilteredRule(trigger,attributeName);
                if ((!rules || rules.length === 0) && this.required === undefined) {
                    callback();
                    return true;
                }
                this.validateState = 'validating';
                var descriptor = {};
                if (rules && rules.length > 0) {
                    rules.forEach(rule => {
                        delete rule.trigger;
                    });
                }
                descriptor[attributeName] = rules;
                var validator = new AsyncValidator(descriptor);
                var model = {};
                model[attributeName] = t.formData[attributeName] || null;
                validator.validate(model, { firstFields: true }, (errors, fields) => {
                    var itemName = attributeName
                    t.validateMessageObj[itemName] = errors ? errors[0].message : '';
                    t.validateMessageObj = Object.assign({},t.validateMessageObj);
                    callback(t.validateMessageObj[itemName]);
                });
              },
            clearValidate() {
                this.validateState = '';
                this.validateMessage = '';
                this.validateDisabled = false;
            },
            getRules(attributeName) {
                var selfRules = [];
                this.realContent.forEach((content,key)=>{
                    if(content.attributes.attributeName == attributeName){
                        selfRules = content.attributes.rules || [];
                    }
                });
                return [].concat(selfRules);
            },
            getFilteredRule(trigger,attributeName) {
                var rules = this.getRules(attributeName);
                return rules.filter(rule => {
                    return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
                });
            },
            blurValidate(val,...params) {
                const t = this;
                params.forEach((param,key)=>{
                    if(param.alias){
                        const attributeName = param.attributes.attributeName;
                        t.formData[attributeName] = val
                        t.validate("blur",attributeName)
                    }
                })
            },
            changeValidate(val,...params) {
                const t = this;
                params.forEach((param,key)=>{
                    if(param.alias){
                        const attributeName = param.attributes.attributeName;
                        t.formData[attributeName] = val;
                        t.validate("change",attributeName)
                    }
                })
            },
            //整个表单校验
            validateAllForm(scope,callback) {
                const t = this;
                const rowKey = Object.keys(scope.row);
                if (!rowKey.length) {
                    console.warn('请按先填写当前行');
                    //return;
                }
                let promise;
                let valid = true;
                let count = 0;
                const columns = scope.store.states.columns;
                columns.forEach((column,index)=>{
                    const newScope = {
                        $index:scope.$index,
                        column:column,
                        row:scope.row,
                        Store:scope.store,
                        _self:scope._self
                    };
                    t.validate('blur',newScope,errors => {
                        console.log('errors:',errors);
                        if (errors) {
                            valid = false;
                        }
                    });
                });
                if (typeof callback === 'function') {
                    callback(valid);
                }
                if (promise) {
                    return promise;
                }
            },
            //显示和隐藏的表单字段
            hideAndShowFormItem:function(showArray,hideArray){
                let t=this;
                if(showArray instanceof Array && hideArray instanceof Array){
                    showArray.forEach(function(attributeName){
                        t.realContent.forEach((ele,key)=>{
                            if(attributeName == ele.attributes.attributeName){
                                ele.attributes.show = true;
                            }
                        })
                    });
                    hideArray.forEach(function(attributeName){
                        t.realContent.forEach((ele,key)=>{
                            if(attributeName == ele.attributes.attributeName){
                                ele.attributes.show = false;
                            }
                        })
                    });
                }
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
        }
    }
</script>

<style lang='less' scoped>
    .bb-indep-form{
        .form-item__label:before{
            content: "*";
            color: #f56c6c;
            margin-right: 4px;
        }
    }
</style>