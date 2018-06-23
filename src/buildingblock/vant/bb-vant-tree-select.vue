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
        itemsArray:{
            type:Array,
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
        },
        //动态数据源
	    valueDs:{
	      type:Object,
	     },      
    },
   data(){ 
        return{
           items:this.itemsArray,
           mainActiveIndexDefault:this.mainActiveIndex,
           activeIdDefault:this.activeId,
        }
      },
    watch:{
        
      },
    mounted(){ 
	   this.getData();
	},    
    methods: {
       onNavClick(index) {
            //debugger
          this.mainActiveIndexDefault = index;
        },
        onItemClick(data) {
            //debugger
          this.activeIdDefault = data.id;
        },
        //获取数据
        getData() {
            const t = this;
            if (t.valueDs) {
                Util.getDSData(t.valueDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        t.realFields = value;
                    });
                }, function (code, msg) {
                });
            }
        }, 
        change:function(val){
        	this.$emit("change",val);
        	this.$emit("input",val);
        },
        //外部修改数据的方法
        setItem:function(val){
        	this.itemsArray = val;
        },
        setItem:function(...params){
	        params.forEach((param,key)=>{
	          if(param.type == "custom"){
	            this.items = param;
	          }
	        });       		
    	}
        
    }
  }
</script>

