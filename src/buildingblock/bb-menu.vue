<script>
  import Util from '../libs/util.js';

  export default {
    name:'bb-menu',
    render:function(createElement){
      var t = this;
      if(t.shouldUpdate && t.items){
        t.menuList = t.createMenu(createElement,t.items);
      }
      return createElement(
          'el-menu',
          {props:{mode:t.horizontal,router:t.router,'default-active':t.defaultActive,'unique-opened':false,collapse:t.collapse,'default-openeds':t.defaultOpeneds}},
          t.menuList
      );
    },
    props: {
      fields: {
        type: Array,
        default: function () {
          return []
        }
      },
      horizontal:{
        type:String,
        default:"horizontal"
      },
      childName:{
        type:String,
        default:'children'
      },
      ds:{
        type:Object,
        default:function(){
          return null
        }
      },
      titleField:{
        type:String,
        default:'title'
      },
      urlField:{
        type:String,
        default:'url'
      },
      collapse:{
        type:Boolean,
        default:false
      },
      defaultOpeneds:{
        type: Array,
        default: function () {
          return null
        }
      }
    },
    data() {
      return {
        router:true,
        items:this.fields,
        newMenu:true,
        menuList:[],
        shouldUpdate:true
      };
    },
    watch: {
        fields:{
          handler:function(val,oldVal){
            this.shouldUpdate = true;
            this.items = val;
          },
          deep:true
        }
    },
    computed:{
        defaultActive:function(){
            return this.$route.fullPath;
        }
    },
    components:{},
    created: function () {
          this.getData();
        },
    methods: {
      getData: function () {
        var t = this;
          if (this.ds && this.ds.api) {
              Util.getDSData(t.ds, {"bb": t, "router": t.$route.params}, function (map) {
                  var newArr = [];
                  map.forEach(function (item) {
                          var list = item['value']['list'];
                          for (var i in list) {
                              var ele = list[i];
                              let button = {
                                title:ele[t.titleField],
                                url:ele[t.urlField]
                              }
                              newArr.push(button);
                          }
                      });
                  t.shouldUpdate = true;
                  t.items = newArr;
              }, function (code, msg) {
              });
          }
      },
      createMenu:function(createElement,items){
        var t = this;
        var newEle = '';
        var newArr = []
        items.forEach((item,key)=>{
          if(item[t.childName] && item[t.childName].length > 0){
            newArr.push(t.createSubmenu(createElement,item));
          }else{
            newArr.push(t.createMenuItem(createElement,item));
          }
        });
        t.shouldUpdate = false;
        return newArr
      },
      createMenuItem:function(createElement,item){
        var t = this;
        var titleEle = createElement('span',{slot:"title"},[item.title,createElement('bb-badge',{props:{value:item.value},ref:item['url'],class:'bb-menu-badge'},[])]);
        var templateChild = item.icon?createElement('i',{class:'el-icon-'+item.icon},[]):'';
        return createElement('el-menu-item',
            {props:{index:item.url,key:item.url,route:{path:item.url}},title:item.title,class:item.class,on:{
              click:function(){
                t.$emit('click')
                if(item.value && item.clickHide){
                  t.$refs[item['url']].hide();
                }
              }
            }},
            [templateChild,titleEle]);
      },
      createSubmenu:function(createElement,item){
        var t = this;
        var child = []
        var icon = item.icon?createElement('i',{class:'el-icon-'+item.icon},[]):'';
        var title = createElement('span',{slot:"title"},[item.title]);
        var groupSpan = createElement('span',{slot:"title"},[item.title,createElement('bb-badge',{props:{value:item.value},ref:item['url'],class:'bb-menu-badge'},[])]);
        return createElement(
              'el-submenu',
              {props:{index:item.url,key:item.url,route:{path:item.url}},on:{
                click:function(){
                  t.$emit('click')
                  if(item.value && item.clickHide){
                    t.$refs[item['url']].hide();
                  }
                }
              }},
              [createElement('template',{slot:"title"},[icon,title,createElement('bb-badge',{props:{value:item.value},ref:item['url'],class:'bb-menu-badge'},[])]),createElement('el-menu-item-group',{},[t.createMenu(createElement,item[t.childName])])]
            );
      }
    },
  }
</script>
<style lang='less'>
.bb-menu-badge .el-badge__content{
  right: -5px !important;
}
</style>