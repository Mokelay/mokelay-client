<script>
  /*实现功能
    1.通过bb-layout-seriation基础组件解析标准格式数据，渲染积木的属性，动画，交互
    2.兼容老格式数据
    3.标准格式数据
    {
      layoutObject:[],
      ds:[],
      content: [{ //页面内容
        uuid: '',
        alias: 'bb-layout-canvas', //布局类积木 || 普通积木
        aliasName: '自由式布局', //中文名称
        attributes: {}, //积木属性
        animation: [{ //动画
        }],
        interactives: [{ //触发交互
        }],
        layout: {} //积木布局
      }]
    }
  */
  import Util from '../libs/util';
  import Vue from 'vue';
  var _PBB_PREFIX = "pbb_";

  export default {
    name: 'bb-page',
    render: function (createElement) {
      var pbbElementList = [];
      //处理模板
      if(this.templatePageAlias){
        pbbElementList.push(createElement(
          'bb-page',
          {props:{pageAlias:this.templatePageAlias}}
        ));
      }

      //处理定制化文件
      if(this.customFile){
        pbbElementList.push(createElement('bb-custom',{props:{customFile:this.customFile}}));
      }

      var uuid = this.layoutObject&&this.layoutObject['uuid']?this.layoutObject['uuid'] : _TY_Tool.uuid();

      //根据布局类型展示不同布局
      switch(this.layoutType){
        case 'seriation':
        //顺序排列布局 seriation
            var element = createElement('bb-layout-seriation', {
              ref:uuid,
              props:{
                content:this.content,
                horizontal:this.layoutObject['horizontal'],
                platform:this.platform,
              }
            });
            pbbElementList.push(element);
            break;
        //容器布局 container
        case 'container':
        var props = {};
        if(this.content){
          //获取布局容器中的 内容
          props = {
            content:this.content,
            layoutObject:this.layoutObject
          }
          var element = createElement('bb-layout-container', {ref:uuid,props:props});
            pbbElementList.push(element);
        }
        break;
        //自由式布局 canvas
        case 'canvas':
        var props = {};
        if(this.content){
          //获取自由布局中的 内容
          props = {
            content:this.content,
            layoutObject:this.layoutObject
          }
          var element = createElement('bb-layout-canvas', {ref:uuid,props:props});
            pbbElementList.push(element);
        }
        break;
        //网格布局 grid
        //TODO

        default:
            //顺序排列布局 seriation
            var element = createElement('bb-layout-seriation', {ref:uuid,props:{content:this.content}});
            pbbElementList.push(element);
            break;
      }

      //页面级弹窗容器 所有的弹窗都新增在此div下
      const dialog = createElement('div',{attrs:{id:this.p_pageAlias + '_dialog'}},[]);
      pbbElementList.push(dialog);

      //返回页面内所有的内容
      const cssStyle = this.layoutObject?this.layoutObject.cssStyle:{};
      const pageBB = {
        layout:cssStyle
      };
      const pageStyle = _TY_Tool.setStyle(pageBB,this);
      return createElement('div',{style:pageStyle},pbbElementList);
    },
    props: {
      root:{
        type:Boolean,
        default:function(){
          return false;
        }
      },
      //支持模板
      pageAlias:{
        type: String
      },
      layoutStyle:{
        type: [Object,String],
        default:function(){
          return {
            width:'100%'
          }
        }
      },
      params:{
        type:[String,Object,Array]
      }
    },
    data() {
      return {
        p_pageAlias:this.pageAlias,//初始化pageAlias
        templatePageAlias:null,
        p_params:this.params,//初始化参数
        pbbs:[],
        customFile:null,
        layoutObject:null,
        content:null,
        platform:''//页面所属平台
      };
    },
    created: function () {
      //积木配置平台编辑状态
      window._TY_BB_Edit = false;
      //解析pageAlias 模板（如果是模板的话）
      this.p_pageAlias = _TY_Tool.tpl(this.pageAlias,_TY_Tool.buildTplParams(this));
      //把bb-page的全局对象注册到window下
      window._TY_Page_Data[this.p_pageAlias] = this;
      if(this.root){
        window._TY_Root = this;
        //统一注册微信
        if(_TY_Tool.isWX()){
          _TY_Tool.get_wx();
        }
        if(_TY_Tool.isPC()){
          // 针对PC端  基准值更正
          document.body.style.fontSize = "18px";
          document.documentElement.style.fontSize = '28px';
        }
      }
      this.loadData();
    },
    mounted:function(){
      const t=this;
      setTimeout(function(){
        t.$emit('mounted',t);
      },0);
      window.onresize = () => {
            return (() => {
              if(_TY_Tool.isPC()){
                // 针对PC端  基准值更正
                document.body.style.fontSize = "18px";
                document.documentElement.style.fontSize = '28px';
              }
            })()
        }
    },
    beforeDestroy:function(){
      let t=this;
      if(t.root){
        t.closeDialog();
      }
    },
    methods: {
      //修改页面的title属性 metadata
      resetPageTitle:function(pageName,layoutObject){
        let t=this;
        const appAlias = t.$route.params.appAlias||'';
        const pageAlias = t.$route.params.pageAlias||'';
        Util.get(window._TY_ContentPath+"/ty_read_app_name_and_company_name",{
          appAlias:appAlias,
          pageAlias:pageAlias
        }).then(function(response){
          var data = response['data']['data'];
          const appName = data['name'];
          const companyName = data['companyName'];
          let pageTitle = '';
          //从全局变量中获取到页面title
          if(layoutObject){
            const _obj = JSON.parse(layoutObject);
            if(_obj&&_obj['pageTitle']){
              pageTitle = _obj['pageTitle'];
            }
          }
          if(pageTitle){
              document.title = _TY_Tool.tpl(pageTitle,_TY_Tool.buildTplParams(t,{
                pageName:pageName,
                appName:appName,
                companyName:companyName
              }));
          }else{
            if(companyName){
              // pageName + appName + 公司名
              document.title = (pageName||"首页")+"-"+(appName||'')+"-"+(companyName||'');  
            }else{
              document.title = pageName||"首页";
            }
          }
        });
      },
      refresh:function(){
        this.loadData();
      },
      loadData:function(){
        var pass = this.p_pageAlias && this.p_pageAlias.length >0;
        if(!pass){
          return;
        }
        //调用ajax获取PBBS数据
        var t =this;
        var pageAlias = this.p_pageAlias;
        //TODO 单接口调用
        Util.post(window._TY_ContentPath+"/load-page-data",{
          alias:pageAlias
        }).then(function(response){
          var data = response['data']['data'];
          var page = data['page'];
          var pbbList = data['pbb_list']['list'];
          var interactives = data['interactives']?data['interactives']['list']:[];
          //如果是根页面，修改页面的title
          if(t.root){
            t.resetPageTitle(page.name,page.layoutObject);
          }
          if(page['template']){
            //模板文件
            t.templatePageAlias = page['templatePageAlias'];
          }
          //设置平台
          if(page['platform']){
            t.platform = page['platform'];
          }

          //获取页面信息
          t.layoutObject = JSON.parse(page.layoutObject) || {};

          //初始化Window
          t.initWindow();

          //指定布局类型
          t.layoutType = page.layoutType;

          //判断是否定制化
          if(page['custom']){
            //加载定制化文件的配置
            t.customFile = page['customFile'];
          }

          //配置UI
          //var pbbs = [];
          var contentArr = [];
          if(page.content){
            //积木内容 content
            try{
              t.content = JSON.parse(page.content);
            } catch(e){
              t.content = eval(page.content);
            }
          }else{
            //积木内容 content
            let content = [];
            pbbList.forEach(function(_pbb){
              var _pbbId = _pbb['id'];
              var attributes = _pbb['attributes'];
              if(attributes && typeof attributes == "string"){
                attributes = JSON.parse(attributes);
              }
              var contentItem = {
                alias: _pbb['alias'],
                aliasName:'',
                attributes:attributes,
                uuid:_pbb['id'],
                interactives:[],
                animation:[],
                layout:null
              }
              interactives.forEach((interactive,key)=>{//添加交互
                if(interactive.pbbId == _pbbId){
                  const newInteractive = {       //触发交互
                      uuid:interactive.id || _TY_Tool.uuid(3,8),
                      fromContentEvent:interactive['triggerEventName'],
                      executeType:interactive['executeType'],         //执行类型(预定义方法 trigger_method,
                      executeScript:interactive['executeScript'],
                      executeContentUUID:interactive['executePbbId'],  //执行积木的UUID executeType = trigger_method
                      executeBBMethodName:interactive['executeBBMethodName'],
                      executeContentMethodName:interactive['executeBBMethodName'],
                      containerMethodName:interactive['containerMethodName']
                  }
                  contentItem['interactives'].push(newInteractive);
                }
              })
              contentArr.push(contentItem);
            });
            t.content = contentArr;
            //根据layout中的位置对content重新排序
            if(page.layout){
              t.content = [];
              JSON.parse(page.layout).forEach((val,key)=>{
                contentArr.forEach((value,index)=>{
                    if(parseInt(val[0]) == value.uuid){
                      t.content.splice(val[1],0,value);
                    }
                })
              })
            }
          }
        }).catch(function (error) {
          t.$notify.error({
            title: '错误',
            message: error.message+"\n"+error.stack});
        });
      },
      //页面卸载
      unload:function(){
        //触发页面卸载事件
        this.$emit('after-unload', this);
      },
      loadChildBB(){
        let t=this;
        return _TY_Tool.loadChildBB(t);
      },
      closeDialog:function(){
        let t=this;
        if(t._dialog){
          t._dialog.$children[0].closeDialog();
          t._dialog = null;
        }
      },
      /*页面弹窗方法
        eventArg: 积木触发事件时所带的原始参数
        content:[{ //页面内容 由交互配置参数得来
          uuid: '',
          alias: 'bb-layout-canvas', //布局类积木 || 普通积木
          aliasName: '自由式布局', //中文名称
          attributes: {}, //积木属性
          animation: [{ //动画
          }],
          interactives: [{ //触发交互
          }],
          layout: {} //积木布局
        }]
      */
      openDialog:function(...args){
        const t = this;
        //content需要args传过来的参数，实在想不到其他办法，只能放在全局变量里,然后接口从window。_TY_Root对象中区获取
        _TY_Root._TY_args = args;
        args.forEach((val,key)=>{
          if(val.type == 'custom'){
            let dialogArgs = val.arguments;
            if(typeof(dialogArgs)==='object'&&!(dialogArgs instanceof Array)&&dialogArgs.hasOwnProperty('content')){
              //说明不是数组，可能是一个bb-dialog的属性对象
              t.dialogProp = Object.assign({},{
                'isShow':true,
                closeOnClickModal:false
              },dialogArgs);
            }else{
              t.dialogProp = {
                'isShow':true,
                content:dialogArgs,
                closeOnClickModal:false
              }
            }
          }
        })
        if(!t.dialogKeys){
          t.dialogKeys = [_TY_Tool.uuid()];
        }else{
          t.dialogKeys.push(_TY_Tool.uuid());
        }

        var _dialog = new Vue({
            router: t.$router,
            render: function(createElement){
                return createElement('bb-indep-dialog',{
                  props:t.dialogProp,on:{
                  "update:isShow":(val)=>{
                    if(!val){
                      //关闭弹窗销毁DOM中的当前弹窗节点
                      setTimeout(function(){
                        //如果有多个dialog，清除后面那个，只有一个就全清
                        let dialogDom = document.getElementById(t.p_pageAlias + '_dialog').getElementsByClassName("el-dialog__wrapper");
                        if(dialogDom.length>1){
                          let removeDom = dialogDom[dialogDom.length-1];
                          removeDom.parentNode.removeChild(removeDom);//删除最后一个节点
                        }else{
                          document.getElementById(t.p_pageAlias + '_dialog').innerHTML = '';
                        }
                        if(t.dialogKeys.length>0){
                          delete t.$refs[t.dialogKeys[t.dialogKeys.length-1]];
                        }
                      },0);
                    }
                  },
                }},[]);
            }
        }).$mount();
        //将弹窗实例化对象挂载到当前bb-page下
        document.getElementById(t.p_pageAlias + '_dialog').appendChild(_dialog.$el);
        t._dialog = _dialog;
        //为了解决容器类积木  获取不到 弹窗中的子积木，方案待定
        t.$refs[t.dialogKeys[t.dialogKeys.length-1]] = _dialog; //把bb-form 设置到$refs中
      },
      /*交互ds解析
        ds:{
          api:"/list-data",
          category:'config',//ds选择器 不是type字段而是category字段
          method:"post",
          inputs:[
              {paramName:'a',valueType:"constant",constant:123},
              {paramName:'b',valueType:"inputValueObj",valueKey:"bb",variable:"pageSize"},
              {paramName:'c',valueType:"inputValueObj",valueKey:"router",variable:"page"},
              {paramName:'d',valueType:"inputValueObj",valueKey:"row-data",variable:"alias"},
          ],
          outputs:[
              {dataKey:"tableData",valueKey:"data-list-1"},
              {dataKey:"obj",valueKey:"data-obj-1",handle:"${buzzCode}"}
          ]
        }
      */
      executeDS:function(...args){
        const t =this;
        args.forEach((val,key)=>{
          if(val.type == 'custom'){
            var ds = val.arguments;
            if (ds) {
              _TY_Tool.getDSData(ds, _TY_Tool.buildTplParams(t,{
                args:args
              }), function (map) {
                  //接口执行完毕  传一个ds过去，可以区别是哪个接口调用返回的事件
                  t.$emit('ds-success',map,ds.api);
                }, function (code, msg) {
                  //接口执行完毕
                  t.$emit('ds-error',code,ds.api);
              });
            }
          }
        })
      },
      /**
        重定向跳转
      **/
      redirect:function(...args){
        const t =this;
        args.forEach((val,key)=>{
          if(val.type == 'custom'){
            var pathTpl = val.arguments;
            if (pathTpl) {
                if(pathTpl==='reload'){
                  location.reload();
                }
                const path = _TY_Tool.tpl(pathTpl.pathTpl,_TY_Tool.buildTplParams(t,{
                  args:args
                }));
                if(path.indexOf('http')==0){
                  location.href=path;
                }else{
                  t.$router.push(path);
                }
            }
          }
        })
      },

      //初始化Window相关业务
      initWindow: function(){
        const t =this;
        //获取页面beTask任务
        t.runTask();
        //关闭提示配置
        if(t.layoutObject['closingPrompt']){
          window.onbeforeunload = function(){
            event.returnValue = "";
          };
        }else{
          window.onbeforeunload = null;
        }
      },

      /*解析页面task
        beTask:[{
          uuid:'12334' 任务标识
          type:'once' || 'interval', 单此或则轮询
          ds:{}, 接口的ds
          time:1000   间隔时间
        }]
      */
      runTask:function(){
        const t = this;
        if(t.layoutObject.beTask){
          t.layoutObject.beTask.forEach((val,key)=>{
            t.taskObj = {};
            switch(val.type){
              case 'once':
                t.getDSDate(val.ds);
                break;
              case 'interval':
                t.taskObj[val.uuid] = setInterval(()=>{t.getDSDate(val.ds)},val.time);
                break
            }
          })
        }
      },
      getDSDate:function(ds){
        const t = this;
        if (ds) {
          _TY_Tool.getDSData(ds, _TY_Tool.buildTplParams(t), function (map) {
              //接口执行完毕
              t.$emit('after-betask-excute-success',map);
            }, function (code, msg) {
              //接口执行完毕
              t.$emit('after-betask-excute-err',code);
          });
        }
      },
      //停止定时器 uuid 需要停止的task的uuid
      stopTask:function(uuid){
        const t = this;
        clearInterval(t.taskObj[uuid]);
      },
      //系统通知
      notification:function(...args){
        const t = this;
        args.forEach((val,key)=>{
          if(val.type == 'custom'){
            t.$notify({
              title: val.arguments.title,
              message: val.arguments.message
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
</style>