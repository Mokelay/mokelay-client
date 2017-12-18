<script>
  import Util from '../libs/util';

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

      //处理配置UI
      var t = this;
      var pbbs = this.pbbs;
      for (var i in pbbs) {
          var pbb = pbbs[i];
          var props = pbb['attributes'] || {};
          var on = {};
          //onInteractiveFn 存储所有事件的方法
          t.onInteractiveFn = t.onInteractiveFn?t.onInteractiveFn:{};
          var interactives = pbb['interactives'] || [];
          for (var j in interactives) {
              var interactive = interactives[j];
              var executePbbId = interactive['executePbbId'];
              var executeBBMethodName = interactive['executeBBMethodName'];
              on[interactive['triggerEventName']] = t.publicEmmit.bind(t,interactive['triggerEventName']);
              //给相同事件的创建方法数组
              t.onInteractiveFn[interactive['triggerEventName']] = t.onInteractiveFn[interactive['triggerEventName']]?t.onInteractiveFn[interactive['triggerEventName']]:[];
              var fn = t.$refs[_PBB_PREFIX+executePbbId]?t.$refs[_PBB_PREFIX+executePbbId][executeBBMethodName] : null;
              if(fn){
                t.onInteractiveFn[interactive['triggerEventName']].push(fn)
              }
          }
          var element = createElement(pbb['bbAlias'], {ref:_PBB_PREFIX+pbb['id'], props:props, on:on});
          var colElement = createElement('el-col', {props:{span:24},style:t.layoutStyle},[element]);
          var rowElement = createElement('el-row', {props:{gutter:20}},[colElement]);
          pbbElementList.push(rowElement);
      }
      return createElement(
          'div',
          {},
          pbbElementList
        );
    },
    props: {
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
      }
    },
    data() {
      return {
        templatePageAlias:null,
        pbbs:[],
        customFile:null
      };
    },
    created: function () {
      this.loadData();
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
        var t =this;
        var pageAlias = this.pageAlias;
        //TODO 单接口调用
        Util.post(window._TY_ContentPath+"/load-page-data",{
          alias:pageAlias
        }).then(function(response){
          var data = response['data']['data'];
          var page = data['page'];
          var pbbList = data['pbb_list']['list'];
          var interactives = data['interactives']['list'];

          //模板文件
          t.templatePageAlias = page['templatePageAlias'];

          //判断是否定制化
          if(page['custom']){
            //加载定制化文件的配置
            t.customFile = page['customFile'];
          }

          //配置UI
          var pbbs = [];
          pbbList.forEach(function(_pbb){
//            _pbb = _pbb['data'];

            var _pbbId = _pbb['id'];
            var attributes = _pbb['attributes'];
            if(attributes && typeof attributes == "string"){
              attributes = JSON.parse(attributes);
            }
            var pbb = {
              bbAlias: _pbb['alias'],
              attributes:attributes,
              id:_pbb['id'],
              interactives:[]
            };

            interactives.forEach((item,key)=>{//添加交互
              if(item.pbbId == _pbbId){
                pbb['interactives'].push(item);
              }
            })
            pbbs.push(pbb);
          });
          let newPbbs = pbbs;
          //根据layout中的位置对pbbs重新排序
          if(page.layout){
            newPbbs = [];
            JSON.parse(page.layout).forEach((val,key)=>{
              pbbs.forEach((value,index)=>{
                  if(parseInt(val[0]) == value.id){
                    newPbbs.splice(val[1],0,value);
                  }
              })
            })
          }
          t.pbbs = newPbbs;
        }).catch(function (error) {
          t.$notify.error({
            title: '错误',
            message: error.message+"\n"+error.stack});
        });
      },
      /*公共方法处理绑定事件
        interactive:当前触发事件名称
        linkageParams:事件出发时传递给fn的参数
      */
      publicEmmit:function(interactive,...linkageParams){
        var t = this;
        var fnArr = t.onInteractiveFn[interactive];
        fnArr.forEach((fn,key)=>{
          fn(...linkageParams);
        })
      }
    }
  }
</script>
<style scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
</style>