<script>
  import Util from '../libs/util.js';

  export default {
    name:'bb-words',
    render:function(createElement){
      var t = this;

      return createElement(
          t.tagName,
          {
            style:{fontSize:t.fontSize,fontFamily:t.fontFamily,color:t.fontColor,textAlign:t.textAlign,lineHeight:t.lineHeight},
            attrs:t.realTagAttributes
          },
          t.content
      );
    },
    props: {
      value:{
        type:String
      },
      text: {
        type: String
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
      },
      tagAttributes:{
        type:[Object,String]
      }
    },
    data() {
      return {
        content:null,
        realText:this.value || this.text,
        realTagAttributes:null
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
      getStorage:function(){
          const t = this;
          let data = {};
          if(t.valueKey == 'sessionStorage'){
            data = JSON.parse(sessionStorage.getItem(t.sessionKey));
          }
          if(t.valueKey == 'localStorage'){
            data = JSON.parse(localStorage.getItem(t.sessionKey));
          }
          return data;
      },
      //解析模板
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
              data = this.getStorage();
              break;
          }
          t.getText(data);
          t.getTagAttributes(data);
      },
      //获取标签文字
      getText:function(data){
        const t = this;
        if(t.templateProp){
          t.templateProp.forEach((item,key)=>{
            if(item.alias == t.text){
              t.realText = item.name
            }
          })
        }
        const words = t.realText?t.realText:'';
        t.content = Util.tpl(words,data)
      },
      //获取标签属性
      getTagAttributes:function(data){
        const t = this;
        if(t.tagAttributes){
          const tagAttributes = typeof t.tagAttributes == 'string'?eval("("+t.tagAttributes+")"):t.tagAttributes;
          t.realTagAttributes = {};
          Object.keys(tagAttributes).forEach((val,key)=>{
            t.realTagAttributes[val] = Util.tpl(tagAttributes[val],data);
          })
        }
      }
    }
  }
</script>
<style>
</style>