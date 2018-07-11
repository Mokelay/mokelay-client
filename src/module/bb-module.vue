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
      //外部传入content ，用来覆盖内部content
      content:{
        type:Object
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
        realModuleAlias: _TY_Tool.tpl(this.moduleAlias, _TY_Tool.buildTplParams(this))
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
                  });
              }, function (code, msg) {
              });
          }
      },
      //执行module某个积木的某个方法
      //execute:function(ele,method,args...){}
    }
  }
</script>
<style scoped>
</style>