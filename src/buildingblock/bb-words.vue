<script>
  import Util from '../libs/util.js';
  const Themes = [{
    "text":"段落",
    "value":"p",
    "styleObj":{
      "tagName":"p",
      "fontSize":"1em",
      "fontColor":"#000",
      "textAlign":"left",
      "lineHeight":"1.45em"
    }
  },{
    "text":"标题一",
    "value":"h1",
    "styleObj":{
      "tagName":"h1",
      "fontSize":"2em",
      "fontColor":"#000",
      "textAlign":"left",
      "lineHeight":"1.45em"
    }
  },{
    "text":"标题二",
    "value":"h2",
    "styleObj":{
      "tagName":"h2",
      "fontSize":"1.5em",
      "fontColor":"#000",
      "textAlign":"left",
      "lineHeight":"1.45em"
    }
  },{
    "text":"标题三",
    "value":"h3",
    "styleObj":{
      "tagName":"h3",
      "fontSize":"1.17em",
      "fontColor":"#000",
      "textAlign":"left",
      "lineHeight":"1.45em"
    }
  },{
    "text":"标题四",
    "value":"h4",
    "styleObj":{
      "tagName":"h4",
      "fontSize":"1em",
      "fontColor":"#000",
      "textAlign":"left",
      "lineHeight":"1.45em"
    }
  },{
    "text":"标题五",
    "value":"h5",
    "styleObj":{
      "tagName":"h5",
      "fontSize":"0.83em",
      "fontColor":"#000",
      "textAlign":"left",
      "lineHeight":"1.45em"
    }
  },{
    "text":"标题六",
    "value":"h6",
    "styleObj":{
      "tagName":"h6",
      "fontSize":"0.67em",
      "fontColor":"#000",
      "textAlign":"left",
      "lineHeight":"1.45em"
    }
  },{
    "text":"加粗",
    "value":"b",
    "styleObj":{
      "tagName":"b",
      "fontSize":"1em",
      "fontColor":"#000",
      "textAlign":"left",
      "lineHeight":"1.45em"
    }
  }];
  export default {
    name:'bb-words',
    render:function(createElement){
      var t = this;

      return createElement(
          t.p_tagName,
          {
            style:{fontSize:t.p_fontSize,fontFamily:t.p_fontFamily,color:t.p_fontColor,textAlign:t.p_textAlign,lineHeight:t.p_lineHeight},
            attrs:t.realTagAttributes
          },
          t.content
      );
    },
    props: {
      value:{
        type:String
      },
      //文字内容，支持模板<%=params%>
      text: {
        type: [String,Number]
      },
      /**====dom相关属性====*/
      //主题，选择了主题，默认填充对应的dom相关属性样式
      theme:{
        type:String,
        default:'p'
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
      /**====dom相关属性 end====*/

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
      },
      //动态数据源获取文字内容
      textDs:{
        type:Object
      },
      //自动刷新时间间隔
      intervalTime:{
        type:Number
      },
      //外部参数的时候，需要展示的文本 模板配置
      linkageTpl:{
        type:String,
        default:''
      },
      //主题 主题见上面的常量，主要早积木世界中配置交互
      theme:{
        type:String
      }
    },
    data() {
      return {
        content:null,
        realText:this.value || this.text,
        realTagAttributes:null,
        external:{},
        p_tagName:this.tagName,
        p_fontSize:this.fontSize,
        p_fontFamily:this.fontFamily,
        p_fontColor:this.fontColor,
        p_textAlign:this.textAlign,
        p_lineHeight:this.lineHeight
      };
    },
    created: function () {
        this.autoRefresh();
    },
    mounted:function(){
        let t=this;  
        t.$emit('mounted',t.content);          
    },
    watch:{
      realText(val){
        this.autoRefresh();
      },
      value: {
        handler: function (val, oldVal) {
          this.realText = val;
        },
        deep: true
      },
      text(val){
        this.realText = val;
        this.autoRefresh();
      },
      parentParams(val){
        this.autoRefresh()
      }
    },
    methods: {
      //主题change 方法 主要用于交互
      changeTheme:function(...args){
        let t=this;
        if(args&&args.length>0&&args[0]){
            Themes.forEach(function(item,index){
              if(item.value==args[0]){
                t.p_tagName = item.styleObj.tagName;
                t.p_fontSize = item.styleObj.fontSize;
                t.p_fontColor = item.styleObj.fontColor;
                t.p_textAlign = item.styleObj.textAlign;
                t.p_lineHeight = item.styleObj.lineHeight;
                t.$emit("themeChange",item.styleObj);
                return false;//break
              }
            });
        }
      },
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
        t.getData();
        const words = t.realText?t.realText:'';
        t.content = _TY_Tool.tpl(words, _TY_Tool.buildTplParams(t));
        t.$emit('input',t.content);
        t.$emit('change',t.content);
      },
      //获取标签属性
      getTagAttributes:function(data){
        const t = this;
        if(t.tagAttributes){
          const tagAttributes = typeof t.tagAttributes == 'string'?eval("("+t.tagAttributes+")"):t.tagAttributes;
          t.realTagAttributes = {};
          Object.keys(tagAttributes).forEach((val,key)=>{
            t.realTagAttributes[val] = _TY_Tool.tpl(tagAttributes[val], _TY_Tool.buildTplParams(t));
          })
        }
      },
      //获取动态数据
      getData:function () {
        const t = this;
        if (t.textDs) {
            _TY_Tool.getDSData(t.textDs, _TY_Tool.buildTplParams(t), function (map) {
                map.forEach((val,key)=>{
                    t.realText = val.value;
                })
            }, function (code, msg) {
            });
        }
      },
      //定时刷新
      autoRefresh:function(){
        const t = this;
        if(t.intervalTime == undefined){
          t.tansferTpl();
        }else{
          if(!t.setTime){
            t.setTime = setInterval(t.tansferTpl,t.intervalTime);
          }
        }
      },
      //停止定时刷新
      stopFresh:function(){
        const t = this;
        clearInterval(t.setTime);
        t.setTime = null;
      },
      //外部联动 接收交互参数
      linkage:function(data){
        const t = this;
        t.external['linkage'] = data;
        if(data){
          t.realText = data;
        }
      },
       //外部联动 接收交互参数  上面方法的重载,如果有多个参数会走下面这个方法
      linkage:function(...data){
        const t = this;
        t.external['linkage'] = data;
        if(t.linkageTpl){
          t.realText=_TY_Tool.tpl(this.linkageTpl,_TY_Tool.buildTplParams(t));
        }else if(data[0]){
          t.realText = data[0];
        }
      },
    }
  }
</script>
<style>
</style>