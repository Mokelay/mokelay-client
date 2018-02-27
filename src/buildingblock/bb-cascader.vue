<template>
    <div>
      <el-cascader
        :placeholder="placeholder"
        :options="optionData"
        :filterable="filterable"
        :change-on-select="changeOnSelect"
        :show-all-levels="showAllLevels"
        @active-item-change="handleItemChange"
        @change="handleChange"
        :props="casProps"
        v-model="selectedOptions"
      ></el-cascader>
    </div>
</template>

<script>
    export default {
        name: 'bb-cascader',
        props: {
          value:{
            type:[Number,String]
          },
          placeholder:{
              type:String,
              default:'请选择'
          },
          //是否可以选择任意一级
          changeOnSelect:{
            type:Boolean,
            default:false
          },
          //是否支持第一级搜索
          filterable:{
            type:Boolean,
            default:false
          },
          //是否显示完整路径
          showAllLevels:{
            type:Boolean,
            default:true
          },
          /**
           静态选项  用json来控制比较好点
            [{
              value: 'zhinan',
              label: '指南',
              children: [{
                value: 'shejiyuanze',
                label: '设计原则',
                children:[]
              }]
            }]
           **/
          staticOptions:{
            type:String,
            default:"[]"
          },
          /**
              {
                value: 'value',
                label: 'label',
                children: 'children'
              }
          **/
          casProps:{
            type:Object,
            default:function(){
              return {
                value: 'value',
                label: 'label',
                children: 'children'
              };
            }
          },
          /**
            dsList级联数据获取方式，ds表示通过接口获取; method表示通过容器方法获取
            dsList:[{
              type:'ds',                            //级联数据获取方式  接口获取
              index:1,                              //级联第几层接口，比如第一层数据的获取接口   换用数组长度来表示
              ds:{                                //ds配置
                "api": "xxx",
                "category": "config",
                "method": "get",
                "inputs": [{
                    "paramName": "id",
                    "valueType": "inputValueObj",
                    "valueKey": "row-data",
                    "variable": "id"
                }],
                "outputs": [{
                    "dataKey": "formData",
                    "valueKey": "data"
                }]
              }
            },{
              type:'method',                        //级联数据获取方式  接口获取
              index:2,                              //级联第几层接口，比如第一层数据的获取接口  
             // uuid:'xxx',                         //需要执行方法的积木uuid  根据uuid获取vue对象，然后调用方法，
              method:'loadChildBB',                //获取数据的方法名
              props:{                               //方法返回字段和级联选择器的字段对应（字段名转换）
                value:'uuid',
                label:'bbAlias',
                children:'children'
              }
            }]
          **/
          dsList:{
            type:Array,
            default:function(){
              return [];
            }
          }
        },
        data() {
            return {
                optionData:(JSON.parse(this.staticOptions)||[]),
                selectedOptions:[]
            }
        },
        watch:{},
        created: function () {
          let t=this;
        },
        mounted:function(){
        },
        methods: {
            //单级选项改变后触发, 远程获取下级数据
            handleItemChange(value){
              console.log('active item:', value);
              let t=this;
              const index = value.length+1;
              let param  = value.length>0?value[value.length-1]:'';//取级联选择的最后那个值
              setTimeout(_ => {
                // 只有changeOnSelect 为false时，handleItemChange 才会起作用，参考级联选择器属性注释
                if(!t.changeOnSelect&&t.dsList&&t.dsList.length>0){
                  //有动态请求数据的配置
                  t.getNextData(index,param);
                }
              }, 300);
            },
            //选项改变后触发事件
            handleChange(value){
              console.log('active:', value);
              let t=this;
              const index = value.length+1;
              let param  = value.length>0?value[value.length-1]:'';//取级联选择的最后那个值
              if(t.changeOnSelect&&t.dsList&&t.dsList.length>0){
                  //有动态请求数据的配置
                  t.getNextData(index,param);
              }
              //向上提供change事件
              t.$emit('change',value);
              t.$emit('input',value);
            },
            //获取下一级数据，动态获取下一级数据时有效
            getNextData(index,param){
               let t=this;
               if(t.dsList&&t.dsList.length>0){
                  for(let i=0;i<t.dsList.length;i++){
                    let item = t.dsList[i];
                    if(item.index&&item.index==index){
                        //有这一级数据来源配置
                        t._excuteNextOpt();
                        break;
                    }
                  }
               }
            },
            //获取下一级数据 param 为当前级选项值
            _excuteNextOpt(item,param){
              let t=this;
              const type = item.type;
              if(type=='ds'){
                //接口获取
                Util.getDSData(item.ds, _TY_Tool.buildTplParams(t,{'prev':param}), function (map) {
                        map.forEach((mapItem, key)=> {
                           t.__fillNextOptions(item,mapItem.value);
                           return;   //只有一层
                        });
                    }, function (code, msg) {
                    });
              }else if(type=='method'){
                //方法获取
                let method = item.method;
                let uuidVueObj = _TY_Tool.findBBByUuid(param);//直接从根路径去找这个uuid
                let list =[];
                if(uuidVueObj&&uuidVueObj!=null){
                    list = uuidVueObj[method]();
                }
                //填充下一级数据
                t.__fillNextOptions(item,list);
              }else{
                //目前没有涉及到
              }
            },
            //填充到下一级数组
            __fillNextOptions(item,list){
              let t=this;
              //需要改动的options下标值
              const index = item.index-1;
              const props = item.props;
              let result = [];
              if(list&&list.length>0){
                list.forEach(function(data,i){
                  let temp={};
                  if(props){
                    //有属性字段转换配置
                    if(props.value){
                      temp[t.casProps.value]=data[props.value];
                    }
                    if(props.label){
                      temp[t.casProps.label]=data[props.label];
                    }
                    if((props.children&&data[props.children])||(data.hasOwnProperty('isleaf')&&!data['isleaf'])){
                      //如果有  并且不是叶子节点
                      temp[t.casProps.children]=[];
                    }
                  }
                  result.push(Object.assign({},data,temp));
                });
              }
              if(t.optionData&&t.optionData.length>=index){
                t.optionData[index][t.casProps.children]=result;
              }
            }

        }
    }
</script>
<style scoped>
    
</style>