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
        //内容
        title:{
          type:String,
        },
        //提示消息
        info:{
          type:String
        },
        //跳转链接
        url:{
          type:String
        },  
        //动态数据
       /* fields:{
          type:Array,
          default:function(){
            return {
              badgeGroupData
            };
          }
        }*/
    },
   data(){ 
        return {
            realFields:[{
              "title":"111",
              "info":"20",
              "value":1,
              "url":""
            },{
              "title":"111",
              "info":"20",
              "value":2,
              "url":""
            }],
            activeKey:this.value
        }
      },
    computed:{
        
    },
    //事件click
    methods: {
        //点击事件
        onClick(key) {
          var t = this;
          t.activeKey = key;
        }
    }
}
</script>

