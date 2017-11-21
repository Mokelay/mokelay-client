<script>
  import Util from '../libs/util.js';

  export default {
    name:'bb-words',
    render:function(createElement){
      var t = this;
      return createElement(
          t.tagName,
          {style:{fontSize:t.fontSize,fontFamily:t.fontFamily,color:t.fontColor,textAlign:t.textAlign,lineHeight:t.lineHeight}},
          t.content
      );
    },
    props: {
      value:{
        type:String
      },
      text: {
        type: String,
        default:'文字组件支持模板'
      },
      tagName:{
        type:String,
        default:'p'
      },
      fontSize:{
        type:String,
      },
      fontFamily:{
        type:String,
      },
      fontColor:{
        type:String,
      },
      textAlign:{
        type:String,
      },
      lineHeight:{
        type:String,
      },
      valueKey:{
        type:String,
      },
      sessionKey:{
        type:String,
      },
      parentParams:{
        type:[String,Array,Object,Number,Boolean]
      },
      templateProp:{
        type:Array,
      }
    },
    data() {
      return {
        content:null,
        realText:this.value || this.text
      };
    },
    created: function () {
        this.tansferTpl();
    },
    watch:{
      realText(val){
        this.tansferTpl();
      },
      value: {
        handler: function (val, oldVal) {
          this.realText = val;
        },
        deep: true
      },
      text(val){
        this.tansferTpl();
      },
      parentParams(val){
        this.tansferTpl();
      }
    },
    methods: {
      getSessionStorage:function(){
          const t = this;
          let data = {};
          if(t.valueKey == 'sessionStorage'){
            data = JSON.parse(sessionStorage.getItem(t.sessionKey));
          }
          return data;
      },
      tansferTpl:function(){
          const t = this;
          let data = t;
          switch(t.valueKey){
            case 'bb':
              data = t;
              break;
            case 'router':
              data = this.$router.param;
              break;
            case 'row-data':
              data = this.parentParams;
              break;
            default:
              data = this.getSessionStorage();
              break;
          }
          if(t.templateProp){
            t.getText();
          }
          t.content = Util.tpl(t.realText,data)
      },
      getText:function(){
        const t = this;
        t.templateProp.forEach((item,key)=>{
          if(item.alias == t.text){
            t.realText = item.name
          }
        })
      }
    }
  }
</script>
<style>
</style>