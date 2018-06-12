<template>
  <vant-picker
    :show-toolbar="showToolbar"
    :title="title"
    :columns="data"
    :loading="loading"
    :value-key="valueKey"
    :item-height="itemHeight"
    :confirm-button-text="cofirmButtomText"
    :cancel-button-text="cancelButtomText"
    :visible-item-count="visibleItemCount"
    @change="onChange"
  />
</template>
<script>  

import Picker from 'vant/lib/picker';
import 'vant/lib/picker/style';

export default {
    name:"bb-vant-picker",
    components:{
        "vant-picker":Picker,
    },
    props:{
      //是否显示顶部栏
      showToolbar:{
        type:Boolean,
        default:false
      },
      //顶部栏标题
      title:{
        type:String,
      },
      //是否显示加载状态
      loading:{
        type:Boolean,
        default:false
      },  
      //选项对象中，文字对应的key   
      valueKey:{
        type:String,
        default:"text"
      },
      //选项高度
      itemHeight:{
        type:Number,
        default:44
      },
      //确认按钮文字
      cofirmButtomText:{
        type:String,
        default:"确认"
      },
      //取消按钮文字
      cancelButtomText:{
        type:String,
        default:"取消"
      },
      //可见的选项个数
      visibleItemCount:{
        type:Number,
        default:5
      },
      //静态数据
      staticData:{
        type:[Array,String],
        default:function(){
          return [{
              text:"浙江",
              value:"1",
              children:[{
                text:"hangzhou",
                value:"code2"
              },{
                text:"wenzhou",
                value:"code3"
              }]
            },{
              text:"浙江2",
              value:"0",
              children:[{
                text:"hangzhou11",
                value:"code5"
              },{
                text:"wenzhou22",
                value:"code6"
              }]
            }]
        } 
      },
      //多层动态数据源,dsList[0] 表示第一层，dsList[1]表示第二层
      /**
        {
            api:"xxx",
            category:'config',//ds选择器 不是type字段而是category字段
            method:"get",
            inputs:[
                {paramName:'e',variable:"<%=route.query.param%>},
            ],
            outputs:[
                {dataKey:"tableData",valueKey:"data_list"},
            ]
        }
      */
      dsList:{
        type:Array
      }
    },

   data(){ 
        return{
            data:this.buildData(this.staticData)
        }
      },
    computed:{},
    watch:{},
    methods:{
      //构建数据到vant-picker能识别
      buildData:function(list){
          let t=this;
          if(!list || list.length<=0){
            return [];
          }
          let result = [];
          result.push({
            values:list
          });//第一层数据
          list.forEach((item,index)=>{
            if(index<=0){
              //第一层数据不需要处理了
              return true;
            }
            result.push({
              values:item.children
            });
          });
          return result;
        },
        //加载数据
/*        loadData:function(index,param){
          let t=this;
          if(!t.dsList||t.dsList.length<=0){
            return;
          }
          t.dsList.forEach((ds,_index)=>{
             if(index == _index){
             _TY_Tool.getDSData(ds,_TY_Tool.buildTplParams(t,{"itemVal":param}),functon(map){
                debugger;
                if(!index||index==0){
                   t.data=t.buildData(xxx);
                }else{
                  if(index<t.data.length){
                    t.data[index] = (t.buildData(xxx))[0];
                  }
                }
               
             });
 

              return false;
             }
          });
        }*/
        onChange(picker,values){
          picker.setColumnValues(1,values[0]['children']);
        },
    }
}
</script>