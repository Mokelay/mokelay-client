<script>
  export default {
    name: 'bb-div',
    render: function (createElement) {
        const t = this;
        return createElement(t.tag,{
                class:t.clazz,
                style:t.cssStyle,
                on:{
                    click:function(){
                        t.$emit('click');
                    }
                }
            },_TY_Tool.bbRender(t.content,createElement,t));
    },
    props: {
    	tag:{
    		type:String,
    		default:'div'
    	},
    	content:{
    		type:Array
    	},
       	clazz:{
       		type:[Array,String]
       	},
       	cssStyle:{
       		type:Object
       	},
        params:{
          type:Object
        }
    },
    data() {
      return {}
    },
    computed:{
        
    },
    created: function () {
    },
    methods: {
      
    }
  }
</script>
<style>
</style>