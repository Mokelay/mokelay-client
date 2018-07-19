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
 * 方法配置
        [{
          methodName:"",        //方法名称
          code:code,              //方法对应function
        }]
      // methods:{
      //   type:Array
      // },
      事件配置
        [{
          targetBBuuid:"",       //目标积木
          targetEvent:"",        //目标事件
          eventName:""           //输出事件名称
        }]
      // events:{
      //   type:Array
      // },
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
      };
    },
    created: function () {
      this.getData();

    },
    render:function(createElement){
      const t = this;
      //支持水平排列控制
      const module = createElement("bb-layout-seriation",{props:{content:t.realContent,horizontal:t.option.horizontal}},[]);
      return module;
    },
    methods: {
      //通过别名获取某块数据
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
              content.attributes[attribute.attributeName] = attribute.attributeValue;
            }
          })
        });
      },
      //渲染方法
      renderMethods(){
        const t = this;
        t.realMethods.forEach((method,key)=>{
          t[method.methodName] = function(){
            _TY_Tool.loadBuzz(method.buzz, function(code) {
                eval(code);
            });
          }
        })
      },
      //渲染事件
      renderEvents(){
        const t = this;
        t.realEvents.forEach((event,key)=>{
          t.realContent.forEach((content,index)=>{
            if(content.uuid == event.targetBBuuid){
              content.interactives.push({             //触发交互
                uuid:_TY_Tool.uuid(),
                fromContentEvent:'',    //触发积木的事件,fromContentUUID为当前content的UUID
                executeType:'',         //执行类型(预定义方法 trigger_method,
                                        //自定义方法 custom_script,
                                        //容器类方法 container_method)
                executeScript:'',       //执行脚本 executeType = custom_script
                executeContentUUID:'',  //执行积木的UUID executeType = trigger_method
                executeContentMethodName:'',
                                        //执行积木的方法
                containerMethodName:''  //容器方法 executeType = container_method
              })
            }
          });
        })
      },
      emitEvent(eventName,params){
        this.$event(eventName,params)
      }

      //执行module某个积木的某个方法
      //execute:function(ele,method,args...){}
    }
  }
</script>
<style scoped>
</style>