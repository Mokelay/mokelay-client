<template>
  <vant-tree-select
    :items="items"
    :main-active-index="mainActiveIndexDefault"
    :active-id="activeIdDefault"
    @navclick="onNavClick"
    @itemclick="onItemClick"
  />
</template>
<script>  


import TreeSelect from 'vant/lib/tree-select';
import 'vant/lib/tree-select/style';

export default {
    name:"bb-vant-tree-select",
    components:{
        "vant-tree-select":TreeSelect,
    },
    props:{
        //分类显示所需的数据
        items:{
            type:Array,
            default:function(){
                return [
                    {
                        text:"All city",
                        children:[
                            {
                                text:"wenzhou",
                                id:1003
                            },{
                                text:"hangzhou",
                                id:1002
                            },{
                  text:"wuxi",
                  id:1001
                }
                        ]
                    },
            {
              text:"zhejiang",
              children:[
                {
                  text:"wenzhou",
                  id:2002
                },{
                  text:"hangzhou",
                  id:2001
                }
              ]
            },
            {
              text:"jiangsu",
              children:[
                {
                  text:"wuxi",
                  id:3002
                },{
                  text:"changzhou",
                  id:3001
                }
              ]
            },

            ]
            }
        },
        //左侧导航高亮的索引
        mainActiveIndex:{
            type:Number,
            default:0
        },
        //右侧选择项，高亮的数据id
        activeId:{
            type:[String,Number],
        	default:1001
        }
      
    },
   data(){ 
        return{
           mainActiveIndexDefault:this.mainActiveIndex,
           activeIdDefault:this.activeId,
        }
      },
    watch:{
        
      },    
    methods: {
       onNavClick(index) {
            //debugger
          this.mainActiveIndexDefault = index;
        },
        onItemClick(data) {
            //debugger
          this.activeIdDefault = data.id;
        } 
    }
  }
</script>

