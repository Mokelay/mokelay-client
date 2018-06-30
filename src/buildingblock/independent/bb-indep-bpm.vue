<script>
  import Util from '../libs/util';

/**
 * 工作流组件
 * Author: CarlChen
 * Date: 2018/6/30
 */
 
  export default {
    name: 'bb-indep-bpm',
    render: function (createElement) {
    },
    props: {
      /*
        数据结构:{
            uuid
            type
            icon
            text
            position
            size
        }
      */
      nodes:{
        type: Array
      },
      /*
        数据结构：{
          uuid
          type
          fromNodeUUID
          toNodeUUID
        }
      */
      lines:{
        type: Array
      }
    },
    data() {
      return {
      };
    },
    created: function () {
    },
    methods: {
        addNode:function(){},
        removeNode:function(),
        moveNode:function(),
        addLine:function(){},
        removeLine:function(){}
    }
  }
</script>
<style scoped>
</style>