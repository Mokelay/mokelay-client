<script>
  import Util from '../libs/util';

/**
 * 模块
 * <p/>
 * 1. 模块是由多个积木构建
 * 2. 模块支持横排竖排两种排版(1.0版本)
 * 3. 模块的属性来自积木的属性
 * 4. 模块的方法来自积木的方法
 * 5. 模块的事件来自积木的事件
 * 6. 偏应用类设计
 * <p/>
 * Author: CarlChen
 * Date: 2018/1/25
 */
 
  export default {
    name: 'bb-module',
    render: function (createElement) {
    },
    props: {
      //从后端获取content数据并且渲染
      moduleAlias:{
        type: String,
        default:"test"
      },
      /*module属性配置
        [{
          targetBBuuid:"",         //目标积木
          attributeName:"",        //属性名称
          attributeValue:"",       //属性值
        }]
      */
      attributes:{
        type:Array,
      },
      /*其他属性设置
        {
            horizontal:false 水平排列
        }
      */
      option:{
        type:Object,
        default:function(){
          return {
            horizontal:false
          }
        }
      }
    },
    data() {
      return {
        //每次使用都生成独立uuid
        realContent:_TY_Tool.copyContent(this.content),
        //支持模板 可以 根据不同条件切换不同的模块名称
        realModuleAlias: _TY_Tool.tpl(this.moduleAlias, _TY_Tool.buildTplParams(this)),
        realAttributes:this.attributes,
        realMethods:this.methods,
        realEvents:this.events,
        on:{}
      };
    },
    created: function () {
      this.getData();

    },
    render:function(createElement){
      const t = this;
      const children = _TY_Tool.bbRender(t.realContent,createElement,t)
      //支持水平排列控制
      // const module = createElement("bb-layout-seriation",{props:{content:t.realContent,horizontal:t.option.horizontal},on:t.on},[]);
      const module = createElement("div",{props:{content:t.realContent,horizontal:t.option.horizontal},on:t.on},[children]);
      return module;
    },
    methods: {
      /*通过别名获取某块数据
        methods 方法配置
          [{
            methodName:"",        //方法名称
            code:code,              //方法对应function
          }]
        events 事件配置
          [{
            targetBBuuid:"",       //目标积木
            targetEvent:"",        //目标事件
            eventName:""           //输出事件名称
          }]
      */
      getData: function () {
          const t = this;
          const dataDs = {
                api:"/ty_read_module",
                category:'config',//ds选择器 不是type字段而是category字段
                method:"get",
                inputs:[{paramName:'alias',valueType:"template",variable:t.realModuleAlias}],
                outputs:[{dataKey:"data",valueKey:"data"}]
          };
          if (dataDs) {
              _TY_Tool.getDSData(dataDs, _TY_Tool.buildTplParams(t), function (map) {
                  map.forEach((val,key)=>{
                      t.realContent = val.value.content;
                      t.realAttributes = val.value.attributes;
                      t.renderAttributes();
                      t.realMethods = val.value.methods;
                      t.renderMethods();
                      t.realEvents = val.value.events;
                      t.renderEvents();
                  });
              }, function (code, msg) {
              });
          }
      },
      //渲染属性
      renderAttributes(){
        const t = this;
        t.realAttributes.forEach((attribute,key)=>{
          t.realContent.forEach((content,index)=>{
            if(content.uuid == attribute.targetBBuuid){
              const value = typeof attribute.attributeValue == "string"?JSON.parse(attribute.attributeValue):attribute.attributeValue;
              content.attributes[attribute.attributeName] = value;
            }
          })
        });
      },
      //渲染方法
      renderMethods(){
        const t = this;
        t.realMethods.forEach((method,key)=>{
          t[method.methodName] = function(){
            eval(method.code);
          }
        })
      },
      //渲染事件
      renderEvents(){
        const t = this;
        t.realEvents.forEach((event,key)=>{
          t.realContent.forEach((content,index)=>{
            if(content.uuid == event.targetBBuuid){
              t.on[event.eventName] = (...params)=>{
                t.$emit(event.eventName,params);
              };
              // t.on[event.targetEvent] = (...params)=>{

              //   t.$emit(event.eventName,params);
              // };
              content.interactives.push({             //触发交互
                uuid:_TY_Tool.uuid(),
                fromContentEvent:event.targetEvent,
                executeType:'custom_script',
                executeArgument:{eventName:event.eventName},
                executeScript:'bb-moudle-event'
              })
            }
          });
        })
      }
      //执行module某个积木的某个方法
      //execute:function(ele,method,args...){}
    }
  }
</script>
<style scoped>
</style>