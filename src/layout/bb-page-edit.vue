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
    4.保存并返回整个页面的数据
    {
      layoutObject：{},
      ds:[],
      content:[]
    }




  支持iframe 区域编辑：

    /*配置层与iframe之间的交互逻辑
    渲染逻辑
      1.子页面渲染完毕  遍历所有积木的宽高 并 通过 postMessage 给到父级页面
      2.父页面bb-page-edit 读取积木的宽高并渲染编辑框到相应位置

    //渲染编辑框
    message={
      type:"layout",
      data:[{
        uuid:123,
        alias:"bb-input",
        editLayout:{  //编辑框的布局样式
          width:100,
          height:100
        }
      }]
    }

    交互逻辑 
      1.父页面bb-page-edit 捕获编辑动作 通过 document.getElementById('iframe').contentWindow.postMessage(message, "http://ty.dev.rs.com:8080/#/home_ln"),通知 子页面更新
      2.子页面在bb-page中 添加对postMessage的监听 接收并更新被编辑积木

    积木添加
    message = {
      type:"add",
      data:"bbAlias"
    }

    积木删除
    message = {
      type:"remove",
      data:{ //当前被删除积木的content
        uuid: '',
        alias: 'bb-layout-canvas', //布局类积木 || 普通积木
        aliasName: '自由式布局', //中文名称
        attributes: {}, //积木属性
        animation: [{ //动画
        }],
        interactives: [{ //触发交互
        }],
        layout: {} //积木布局
      } 
    }

    积木排序
    message = {
      type:"sort",
      data:[{ //排序后页面的contents
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

    积木编辑
    message = {
      type:"change",
      data:{   //当前被编辑积木的content
        uuid: '',
        alias: 'bb-layout-canvas', //布局类积木 || 普通积木
        aliasName: '自由式布局', //中文名称
        attributes: {}, //积木属性
        animation: [{ //动画
        }],
        interactives: [{ //触发交互
        }],
        layout: {} //积木布局
      } 
    }

    积木聚焦
    message = {
      type:"onFocus",
      data:{   //当前被编辑积木的content
        uuid: '',
        alias: 'bb-layout-canvas', //布局类积木 || 普通积木
        aliasName: '自由式布局', //中文名称
        attributes: {}, //积木属性
        animation: [{ //动画
        }],
        interactives: [{ //触发交互
        }],
        layout: {} //积木布局
      } 
    }

    积木失焦
    message = {
      type:"onBlur",
      data:{   //当前被编辑积木的content
        uuid: '',
        alias: 'bb-layout-canvas', //布局类积木 || 普通积木
        aliasName: '自由式布局', //中文名称
        attributes: {}, //积木属性
        animation: [{ //动画
        }],
        interactives: [{ //触发交互
        }],
        layout: {} //积木布局
      } 
    }

    积木复制
    message = {
      type:"copy",
      data:[{   //当前被编辑积木的content
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

  import bbcustom from '../../run/src/custom/bb-custom.vue';
  import bblayoutseriationedit from './bb-layout-seriation-edit.vue';
  import bblayoutcontaineredit from './bb-layout-container-edit.vue';
  import bblayoutcanvasedit from './bb-layout-canvas-edit.vue';
  import bbindepiframe from '../buildingblock/independent/bb-indep-iframe.vue';

  export default {
    name: 'bb-page-edit',
    components:{
        "bb-custom":bbcustom,
        "bb-layout-seriation-edit":bblayoutseriationedit,
        "bb-layout-container-edit":bblayoutcontaineredit,
        "bb-layout-canvas-edit":bblayoutcanvasedit,
        "bb-indep-iframe":bbindepiframe
    },
    render: function (createElement) {
      //如果有嵌套页面地址 则 按iframe渲染  否则正常渲染
      if(this.realIframeSrc && this.realIframeSrc != window.location.href){
        return createElement('bb-indep-iframe',{props:{src:this.realIframeSrc},on:{
          onFocus:this.onFocus,
          onBlur:this.onBlur,
          change:this.change
        }},[]);
      }
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
      this.layoutType = this.layoutType?this.layoutType:'seriation';
      switch(this.layoutType){
        case 'seriation':
        //顺序排列布局 seriation
            var element = createElement('bb-layout-seriation-edit', {
              key:this.key,
              ref:uuid,
              props:{
                platform:this.platform,
                content:this.content,
                horizontal:this.layoutObject?this.layoutObject['horizontal'] : false
              },on:{
              onFocus:this.onFocus,
              onBlur:this.onBlur,
              change:this.change
            }});
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
          var element = createElement('bb-layout-container-edit', {key:this.key,ref:uuid,props:props,on:{
              onFocus:this.onFocus,
              onBlur:this.onBlur,
              change:this.change
            }});
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
          var element = createElement('bb-layout-canvas-edit', {key:this.key,ref:uuid,props:props,on:{
              onFocus:this.onFocus,
              onBlur:this.onBlur,
              change:this.change
            }});
            pbbElementList.push(element);
        }
        //网格布局 grid
        //TODO
      }

      //页面级弹窗容器 所有的弹窗都新增在此div下
      const dialog = createElement('div',{attrs:{id:this.realPageAlias + '_dialog'}},[]);
      pbbElementList.push(dialog);

      //返回页面内所有的内容
      const cssStyle = this.layoutObject?this.layoutObject.cssStyle:{};
      const pageBB = {
        layout:cssStyle
      };
      const pageStyle = _TY_Tool.setStyle(pageBB,this);
      return createElement('div',{style:pageStyle},[pbbElementList]);
    },
    props: {
      root:{
        type:Boolean,
        default:function(){
          return false;
        }
      },
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
      },
      //嵌套页面地址  不填写则按正常积木渲染
      iframeSrc:{
        type:String,
        default:`${window.location.origin}/#/ty-bb-config-iframe?pageAlias=<%=bb.$route.query.pageAlias%>`
      }
    },
    data() {
      return {
        templatePageAlias:null,
        pbbs:[],
        customFile:null,
        layoutObject:null,
        content:null,
        ds:null,
        platform:'',//页面所属平台
        realIframeSrc:_TY_Tool.tpl(this.iframeSrc, _TY_Tool.buildTplParams(this))
      };
    },
    watch:{
      content:{
        handler:(val,oldVal)=>{

        },
        deep:true
      },
      layoutObject:{
        handler:(val,oldVal)=>{

        },
        deep:true
      }
    },
    created: function () { 
      //积木配置平台编辑状态
      window._TY_BB_Edit = true;
      this.realPageAlias = _TY_Tool.tpl(this.pageAlias, _TY_Tool.buildTplParams(this));
      //把bb-page的全局对象注册到window下
      window._TY_Page_Data[this.realPageAlias] = this;
      if(this.root){
        window._TY_Root = this;
        //统一注册微信
        if(_TY_Tool.isWX() && !_TY_Tool.wx){
          _TY_Tool.get_wx();
        }
      }
      this.loadData();
    },
    mounted:function(){
      const t = this;
      t.$emit('mounted',t);
      window.addEventListener('message',function(e){
        t.doMessage(e);
      },false);
    },
    destroyed:function(){

    },
    methods: {
      refresh:function(){
        this.loadData();
      },
      loadData:function(){
        var pass = this.pageAlias && this.pageAlias.length >0;
        if(!pass){
          return;
        }
        //调用ajax获取PBBS数据
        var t = this;
        var pageAlias = t.realPageAlias;
        //TODO 单接口调用
        Util.post(window._TY_ContentPath+"/load-page-data",{
          alias:pageAlias
        }).then(function(response){
          var data = response['data']['data'];
          var page = data['page'];
          var pbbList = data['pbb_list']['list'];
          var interactives = data['interactives']?data['interactives']['list']:[];

          if(page['template']){
            //模板文件
            t.templatePageAlias = page['templatePageAlias'];
          }
          //设置平台
          if(page['platform']){
            t.platform = page['platform'];
          }

          //存储当前页面ds信息
          t.ds = JSON.parse(page.ds) || [];

          //存储当前页面应用信息
          t.appAlias = page.appAlias;

          //获取页面信息
          t.layoutObject = JSON.parse(page.layoutObject) || {};
          t.layoutObject.title = t.layoutObject.title?t.layoutObject.title : page.name;

          //初始化Window
          t.initWindow();
          
          //获取页面beTask任务
          t.runTask();
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
        args.forEach((val,key)=>{
          if(val.type == 'custom'){
            t.diaContent = val.arguments;
          }
        })
        var _dialog = new Vue({
            router: t.$router,
            render: function(createElement){
                return createElement('bb-indep-dialog',{props:{'isShow':true,content:t.diaContent},on:{
                  "update:isShow":(val)=>{
                    if(!val){
                      //关闭弹窗销毁DOM中的当前弹窗节点
                      document.getElementById(t.pageAlias + '_dialog').innerHTML = '';
                    }
                  },
                }},[]);
            }
        }).$mount();
        //将弹窗实例化对象挂载到当前bb-page下
        document.getElementById(t.pageAlias + '_dialog').appendChild(_dialog.$el);
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
              _TY_Tool.getDSData(ds, _TY_Tool.buildTplParams(t), function (map) {
                  //接口执行完毕
                  t.$emit('ds-success',map);
                }, function (code, msg) {
                  //接口执行完毕
                  t.$emit('ds-error',code);
              });
            }
          }
        })
      },
      /*积木新增方法 对外
          @bbAlias:积木别名
          @bbName:积木名称
      */
      add:function(bbName,bbAlias){
          const t = this;
          t.key = _TY_Tool.uuid();
          const layout = {
              // bgColor: "",             //背景颜色
              rotate: 0,               //旋转
              // transparency: 1,         //透明度
              // zIndex: 0,               //层级
              size: {width: 200, height: 200},//大小
              position: {x: 100, y: 300},     //位置
              // border: {                //边框
              //     style: "",           //边框样式
              //     color: "",           //边框颜色
              //     size: "",            //边框尺寸
              //     radian: "",          //边框弧度
              //     margin: ""           //边距
              // },
              // shadow: {                //阴影
              //     color: "",           //阴影颜色
              //     size: "",            //阴影大小
              //     direction: '',       //阴影方向
              //     vague: ''            //阴影模糊
              // }
          };
          _TY_Tool.post(_TY_ContentPath+"/read-bb",{
              bbAlias:bbAlias
          }).then(function(response){
            if(response.data.ok){
                //初始化新增加的积木
                const newBB = {
                    uuid:_TY_Tool.uuid(16),
                    type:response.data.data.data.type,
                    alias:bbAlias,
                    aliasName:bbName,
                    attributes:{},
                    animation:[],
                    interactives:[],
                    layout:{}
                }
                if(response.data.data.data.defaultProps){
                  newBB.attributes = JSON.parse(response.data.data.data.defaultProps);
                }
                if(t.layoutType == 'canvas'){
                  newBB.layout = layout;
                }
                document.getElementById('child').contentWindow.postMessage({
                  type:"add",
                  data:newBB
                }, t.realIframeSrc);
                t.content = t.content?t.content:[];
                t.content.push(newBB);
                //返回新的积木数组
                t.$emit('add',t.content);
                t.$emit('change',t.content);
            }else{
              t.$message.error(response.data.message);
            }
          });
      },
      /*积木选中状态 
        @contentItem选中的积木对象{uuid:'',alias:'',aliasName:'',animation:[],interactive:[],layout:{}}
        @index:当前积木在数组中的位置
      */
      onFocus:function(contentItem,index){
          const t = this;
          t.nowEdit = index;
          t.$emit('onFocus',contentItem);
      },
      onBlur:function(){
          const t = this;
          t.$emit('onBlur');
      },
      //完成编辑的积木数据回填
      afterEdit:function(contentItem){
          const t = this;
          t.key = _TY_Tool.uuid(16);
          const newContent = t.content;
          contentItem.onFocus = true;
          t.$set(newContent,t.nowEdit,contentItem);
          t.content = newContent;
          t.$emit('afterEdit',t.content);
          t.$emit('change',t.content);
          t.postMessageFn("change",contentItem);
          document.getElementById('child').contentWindow.postMessage({
            type:"change",
            data:contentItem
          }, 'http://localhost:5000/#/wmj-h5');
      },
      //提交当前页面配置
      updatePage:function(){
        const  t = this;
        const newPage = {
          layoutObject:t.layoutObject,
          ds:t.ds,
          content:t.content
        };
        t.$emit('update',newPage);
      },
      //更新layoutObject
      setLayoutObject:function(layoutObject){
        const  t = this;
        t.layoutObject = layoutObject;
      },
      //积木数据发生变动
      change:function(content){
        const t = this;
        t.key = _TY_Tool.uuid(16);
        if(Array.isArray(content)){
          t.content = content;
        }else{
          t.content.forEach((ele,key)=>{
            if(ele.uuid == content.uuid){
              t.$set(t.content,key,content)
            }
          })
        }
        t.$emit('change',t.content);
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
      },
      /*回退
        url 跳转地址  不传则回退
      */
      goBack(...args){
        let url;
        args.forEach((val,key)=>{
          if(val.type == 'custom'){
            url = val.arguments;
          }
        });
        if(url){
          history.go(url);
        }else{
          history.back(-1);
        }
      },
      postMessageFn:function(type,data){
        const t = this;
        document.getElementById('child').contentWindow.postMessage({
          type:type,
          data:data
        }, t.realIframeSrc);
      },
      doMessage(e){
        const t =this;
        const data = e.data;
        switch(data.type){
          case "change":
            t.change(data.data);
            break;
           case "add":
            t.$set(t.content,t.content.length,data.data);
            // t.add(data.data);
            break;
          case "sort":
            t.change(data.data);
            break;
          case "remove":
            t.change(data.data);
            break;
          case "parentPage":
            _TY_Root.parentPage = data.data
            break;
        }
      }
    },
  }
</script>
<style scoped>
</style>