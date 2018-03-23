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
  */
  import Util from '../libs/util';
  import Vue from 'vue';
  var _PBB_PREFIX = "pbb_";

  export default {
    name: 'bb-page-edit',
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
            var element = createElement('bb-layout-seriation-edit', {ref:uuid,props:{content:this.content,horizontal:this.layoutObject['horizontal']}});
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
          var element = createElement('bb-layout-container-edit', {ref:uuid,props:props});
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
          var element = createElement('bb-layout-canvas-edit', {ref:uuid,props:props});
            pbbElementList.push(element);
        }
        //网格布局 grid
        //TODO

        default:
            //顺序排列布局 seriation
            var element = createElement('bb-layout-seriation-edit', {ref:uuid,props:{content:this.content},on:{
              onFocus:this.onFocus
            }});
            pbbElementList.push(element);
            break;
      }

      //页面级弹窗容器 所有的弹窗都新增在此div下
      const dialog = createElement('div',{attrs:{id:this.pageAlias + '_dialog'}},[]);
      pbbElementList.push(dialog);

      //返回页面内所有的内容
      return createElement('div',{},pbbElementList);
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
      }
    },
    data() {
      return {
        templatePageAlias:null,
        pbbs:[],
        customFile:null,
        layoutObject:null,
        content:null,
        ds:null
      };
    },
    created: function () {
      //把bb-page的全局对象注册到window下
      window._TY_Page_Data[this.pageAlias] = this;
      if(this.root){
        window._TY_Root = this;
      }
      this.loadData();
    },
    mounted:function(){
      this.$emit('mounted',this);
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
        var pageAlias = _TY_Tool.tpl(t.pageAlias, _TY_Tool.buildTplParams(t));
        //TODO 单接口调用
        Util.post(window._TY_ContentPath+"/load-page-data",{
          alias:pageAlias
        }).then(function(response){
          var data = response['data']['data'];
          var page = data['page'];
          var pbbList = data['pbb_list']['list'];
          var interactives = data['interactives']['list'];

          if(page['template']){
            //模板文件
            t.templatePageAlias = page['templatePageAlias'];
          }

          //存储当前页面ds信息
          t.ds = page.ds;

          //获取页面信息
          t.layoutObject = JSON.parse(page.layoutObject) || {};



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
                      uuid:interactive.id || _TY_Tool.uuid(),
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
                return createElement('bb-dialog',{props:{'isShow':true,content:t.diaContent},on:{
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
                  t.emit('ds-success',map);
                }, function (code, msg) {
                  //接口执行完毕
                  t.emit('ds-error',code);
              });
            }
          }
        })
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
      //完成编辑的积木数据回填
      afterEdit:function(content){
          const t = this;
          //t.realContent[t.nowEdit] = content;
          t.$set(t.content,t.nowEdit,content)
          t.$emit('afterEdit',t.content);
          t.$emit('change',t.content);
      }
    }
  }
</script>
<style scoped>
</style>