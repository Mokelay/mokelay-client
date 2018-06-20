<template>
  <vant-badge-group :activeKey="activeKey">
    <vant-badge
        v-for="(field,key) in realFields"
        :title="field.title"
        :info="field.info"
        :url="field.url"
        :value="activeKey"
        @click="onClick"
        :key="key"
    />
  </vant-badge-group>

</template>
<script>  

import BadgeGroup from 'vant/lib/badge-group';
import 'vant/lib/badge-group/style';
import Badge from 'vant/lib/badge';
import 'vant/lib/badge/style';

export default {
    name:"bb-vant-badge",
    components:{
        "vant-badge-group":BadgeGroup,
        "vant-badge":Badge
    },
    props:{
        value:{
          type:[String,Number]
        },
        //静态数据
        realFields:{
        	type:Array,
        }, 
      //动态数据
      valueDs:{
      	type:Object,
      },
    },
   data(){ 
        return {
            activeKey:this.value
        }
      },
    computed:{
        
    },
    mounted(){ 
	    this.getData();
	},
    //事件click
    methods: {
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
        //点击事件
        onClick(key) {
          this.activeKey = key;
          this.emit("click",key);
        }
    }
}
</script>

