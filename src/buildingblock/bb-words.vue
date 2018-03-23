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
      //文字内容，支持模板<%=params%>
      text: {
        type: [String,Number]
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
      },
      //动态数据源获取文字内容
      textDs:{
        type:Object
      },
      //自动刷新时间间隔
      intervalTime:{
        type:Number
      }
    },
    data() {
      return {
        content:null,
        realText:this.value || this.text,
        realTagAttributes:null,
        external:{}
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
        if(data[0]){
          t.realText = data[0];
        }
      },
    }
  }
</script>
<style>
</style>