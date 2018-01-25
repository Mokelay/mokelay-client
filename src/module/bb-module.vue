<script>
  import Util from '../libs/util';

/**
 * 模块
 * <p/>
 * 1. 模块是由多个积木构建
 * 2. 模块支持横排竖排两种排版(1.0版本)
 * 3. 模块的属性来自积木的属性
 * 4. 模块的方法来自积木的方法
 * 5. 模块的时间来自积木的事件
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
      alias:{
        type: String
      },
      props:{
        type:Object
      }
    },
    data() {
      return {
      };
    },
    created: function () {
    },
    methods: {
    }
  }
</script>
<style scoped>
</style>