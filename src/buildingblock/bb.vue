<script>
  export default {
    name: 'bb',
    render: function (createElement) {
        if(this.value){
          this.realConfig.value = this.value;
        }
        return createElement(this.alias, {props: this.realConfig, on : this.on,key:_TY_Tool.uuid()});
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
      }
    }
  }
</script>
<style>
</style>