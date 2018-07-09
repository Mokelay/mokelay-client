
<template>
    <div class="ty_bpm">
      <svg class="ty_bpm_svg_box">
        <bb-indep-svg v-for="(item,index) in p_lines" :svgData="item"></bb-indep-svg>
      </svg>
    <bb-indep-resize-box v-for="(item,index) in p_nodes" :activityData="item" @assistlinemousedown="assistlinemousedown"></bb-indep-resize-box>
    </div>
</template>

<script>
/**
 * 工作流组件
 * Author: CarlChen
 * Date: 2018/6/30
 */

  import BBIndepResizeBox from './bb-indep-resize-box';
  import BBIndepSvg from './bb-indep-svg';
 
  export default {
    name: 'bb-indep-bpm',
    components: {
      'bb-indep-resize-box':BBIndepResizeBox,
      'bb-indep-svg':BBIndepSvg
    },
    props: {
      /*
        数据结构:{
            uuid:'',
            type:'',
            icon:'ty-sj__tag',
            text:'测试',
            position:{
              x:0,
              y:0
            },
            size:{
              width:'3.5rem',
              height:'1.5rem'
            }
        }
      */
      nodes:{
        type: Array,
        default:function(){
          return [{
              uuid:'',
              type:'',
              icon:'ty-sj__tag',
              text:'开始',
              position:{
                x:'3.5714rem',
                y:'0.71425rem'
              },
              size:{
                width:'4.357rem',//120px
                height:'1.5rem'//42px
              }
            },
            {
              uuid:'',
              type:'',
              icon:'ty-sj__tag',
              text:'结束',
              position:{
                x:'3.5714rem',
                y:'4.425rem'
              },
              size:{
                width:'4.357rem',//120px
                height:'1.5rem'//42px
              }
            }]
        }
      },
      /*
        数据结构：{
          uuid:''
          type:''
          fromNodeUUID:''
          toNodeUUID:''
          fromPosition:{
            x:0,
            y:0
          },
          toPosition:{
            x:0,
            y:0
          },
          fromNodeDirection:'down'
          toNodeDirection:'up'
        }
      */
      lines:{
        type: Array,
        default:function(){
          return [{
              uuid:'',
              type:'',
              fromNodeUUID:'',
              toNodeUUID:'',
              fromPosition:{
                x:160,
                y:62
              },
              toPosition:{
                x:160,
                y:122
              },
              fromNodeDirection:'down',// 触发节点的什么方位 画线
              toNodeDirection:'up'
            }]
        }
      }
    },
    data() {
      return {
        p_nodes:this.nodes,//节点列表
        p_lines:this.lines,//线列表
        // activeLine:{},//当前正在被编辑的线
      };
    },
    watch:{
      nodes(val){
        if(val){
          this.p_nodes = val;
        }
      },
      lines(val){
        if(val){
          this.p_lines = val;
        }
      }
    },
    created: function () {

    },
    methods: {
      //添加节点
        addNode:function(){

        },
        //删除节点
        removeNode:function(){

        },
        //移动节点
        moveNode:function(){

        },
        //添加线
        addLine:function(){

        },
        //删除线
        removeLine:function(){

        },
        //辅助点点击事件，需要迁出连接线
        assistlinemousedown:function(e,direct,data){
          let t=this;
          let oDiv = e.srcElement;
          //相对原点
          const srcX = oDiv.offsetParent.offsetParent.getBoundingClientRect().left;
          const srcY = oDiv.offsetParent.offsetParent.getBoundingClientRect().top;
          //计算鼠标点击 的相对x，y值
          let fromX = e.clientX - srcX;
          let fromY = e.clientY - srcY;
          let newLine = {
            uuid:_TY_Tool.uuid(),
            type:'',
            fromNodeUUID:data.uuid,
            toNodeUUID:'',
            fromPosition:{
              x:fromX,
              y:fromY
            },
            toPosition:{
              x:fromX,
              y:fromY
            },
            fromNodeDirection:(direct||'down'),
            toNodeDirection:'up'//重点默认是向上的
          };
          //线添加到数组中
          t.p_lines.push(newLine);
          oDiv.offsetParent.offsetParent.onmousemove = function (e1) {
            let toX = e1.clientX - srcX;
            let toY = e1.clientY - srcY;
            //更新目标点
            t.p_lines[t.p_lines.length-1].toPosition = {
              x:toX,
              y:toY
            }
            //TODO 判断终点是否在某个节点的周围
          };
          oDiv.offsetParent.offsetParent.onmouseup = function (e2) {
              oDiv.offsetParent.offsetParent.onmousemove = null;
              oDiv.offsetParent.offsetParent.onmouseup = null;
              //TODO 计算是否留下这条线 ，判断终点是否在节点上，如果在，保留线，如果不在，删除线

          };


        }
    }
  }
</script>
<style scoped lang="less">
  .ty_bpm{
    position:relative;

    .ty_bpm_svg_box{
      position:absolute;
      width:100%;
      height:100%;
      left:0;
      top:0;
      overflow:hidden;
    }


  }


</style>