<script>
  export default {
    name: 'bb',
    render: function (createElement) {
        const t = this;
        t.realConfig.value = t.value || null;
        return createElement(t.alias, {props: t.realConfig, on : Object.assign({},t.on,{change:t.change})});
    },
    props: {
        value:{
          type:[String,Array,Object,Number,Boolean]
        },
        alias:{
            type:String
        },
        //TODO 后面优化需要删除
        attributes:{
            type:Array
        },
        on:{
          type:Object
        },
        config:{
          type:[String,Object]
        },
        parentData:{
          type:Object
        }
    },
    data() {
      return {}
    },
    computed:{
        realConfig:function(){
            var realConfig = {};
            if(this.config){
              var config = this.config;
              realConfig = typeof config == 'string'?eval("("+config+")"):config;
              realConfig.parentData = this.parentData;
            }else{
              var attributes = this.attributes || [];
              for (var j in attributes) {
                var attribute = attributes[j];
                var attributeValue = null;
                if(attribute['dt'] == 'object' || attribute['dt'] == 'array'){
                  attributeValue = JSON.parse(attribute['attributeValue']);
                }else if(attribute['dt'] == 'int'){
                  attributeValue = parseInt(attribute['attributeValue']);
                }else{
                  attributeValue = attribute['attributeValue'];
                }

                realConfig[attribute['attributeName']] = attributeValue;
              }
            }

            return realConfig;
        }
    },
    created: function () {
    },
    methods: {
      refresh:function(){
      },
      loadData:function(){
      },
      change:function(val){
        this.$emit("change",val,this.parentData);
      }
    }
  }
</script>
<style>
</style>