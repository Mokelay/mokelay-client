<script>
  export default {
    name: 'bb',
    render: function (createElement) {
        return createElement(this.alias, {props: this.props});
    },
    props: {
        alias:{
            type:String
        },
        attributes:{
            type:Array
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
        props:function(){
            var props = {};
            if(this.config){
              var config = this.config;
              props = typeof config == 'string'?eval("("+config+")"):config;
              props.parentData = this.parentData;
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

                props[attribute['attributeName']] = attributeValue;
              }
            }

            return props;
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