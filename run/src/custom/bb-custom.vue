<script>
// 这个是统一加载定制化文件的VUE，默认统一在custom目录，参考bb-page中的加载定制化文件的做法
  export default {
    name:'bb-custom',
    render:function(createElement){
      if(this.cf){
        return createElement(this.cf,{
          props:{parentData:this.parentData}},[]);
      }else{
        return createElement("h1","请设置定制化文件路径");
      }
    },
    props: {
      customFile:{
        type:String
      },
      parentData:{
        type:Object
      }
    },
    data() {
      return {
        cf:null
      };
    },
    created:function(){
      var t= this;
      if(t.customFile){
        require.ensure([],function(require){
          let f = t.customFile;
          t.cf = require(`${f}`);
        });
      }
    },
    methods: {
    }
}
</script>

<style>
</style>