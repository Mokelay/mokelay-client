
<template>
    <div class="ty_bpm" @click="contentClick">
      <svg class="ty_bpm_svg_box">
        <bb-indep-svg v-for="(item,index) in p_lines" :ref="'line-'+item.uuid" :uuid="item.uuid" @click="svgClick" :svgData="item"></bb-indep-svg>
      </svg>
      <bb-indep-resize-box v-for="(item,index) in p_nodes" :ref="'node-'+item.uuid" :uuid="item.uuid" :activityData="item" @assistlinemousedown="assistlinemousedown" @dragMove="boxDragMove(arguments,item,index)" @dragDown="boxDragDown(item,index)" @dragUp="boxDragUp(item,index)"></bb-indep-resize-box>
    </div>
</template>

<script>
/**
 * 工作流组件
 * Author: CarlChen
 * Date: 2018/6/30
 */

  //获取页面基准值，有时可能会变
  let REM_BASE = 28;
  window.setTimeout(()=>{
    //取rem 基准值，得flexible.js 设置完了之后 才能渠道正确的值
    REM_BASE = document.documentElement.style['font-size']?Number(document.documentElement.style['font-size'].replace('px','')):28;
  },1000);
  //需要折线的标志长度
  const BASE_ASSIST = 28;//px

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
              uuid:'bpm_start',
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
              uuid:'bpm_end',
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
              uuid:'default_line',
              type:'',
              fromNodeUUID:'bpm_start',
              toNodeUUID:'bpm_end',
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
        selectedLineUUid:'',//选中的uuid
        // activeLine:{},//当前正在被编辑的线
      };
    },
    computed:{
      
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
        addNode:function(...args){
          let t=this;
          let buzzAdd = false;//是否是巴斯添加
          args.forEach((val,key)=>{
              if(val.type == 'custom' && val.arguments){
                //如果有巴斯直接返回了数据
                t.p_nodes.push(val.arguments);
                buzzAdd = true;
              }
          })
          if(!buzzAdd){
            //不是巴斯添加,添加一个默认的节点
            t.p_nodes.push({
              uuid:_TY_Tool.uuid(),
              type:'',
              icon:'ty-sj__tag',
              text:'新增节点',
              position:{
                x:'0',
                y:'0'
              },
              size:{
                width:'4.357rem',//120px
                height:'1.5rem'//42px
              }
            });
          }
        },
        //删除节点 交互 参数位置传一个要删除的节点uuid
        removeNode:function(...args){
          let t=this;
          args.forEach((val,key)=>{
              if(val.type == 'custom' && val.arguments && typeof(val.arguments)==='string'){
                //y要删除的uuid
                const uuid = val.arguments; 
                //删除节点
                let nodeIndex = t.p_nodes.length;
                while(nodeIndex--){
                  if(t.p_nodes[nodeIndex].uuid == uuid){
                    t.p_nodes.splice(nodeIndex,1);
                    break;
                  }
                }
                let lineIndex = t.p_lines.length;
                while(lineIndex--){
                  if(t.p_lines[lineIndex].fromNodeUUID == uuid || t.p_lines[lineIndex].toNodeUUID == uuid){
                    t.p_lines.splice(lineIndex,1);
                  }
                }
              }
          })
        },
        //移动节点
        moveNode:function(){

        },
        //添加线
        addLine:function(){

        },
        //删除线
        removeLine:function(...args){
          let t=this;
          let uuid = t.selectedLineUUid;
          //交互参数传过来
          args.forEach((val,key)=>{
            if(val.type == 'custom' && val.arguments && typeof(val.arguments)==='string'){
              uuid = val.arguments;
            }
          });
          //或者直接选中删除
          if(uuid){
            t.p_lines.forEach((item,index)=>{
              if(uuid == item.uuid){
                t.p_lines.splice(index,1);
                return false;
              }
            });
          }
        },
        //线的点击事件
        svgClick:function(e,svg){
          let t=this;
          const uuid = e.target.getAttribute('uuid');
          t.selectedLineUUid= uuid;
          //取消其他选中
          t._cancelAllLineAndSelectedCurrent(uuid);
        },
        //整个编辑区域点击事件
        contentClick:function(e){
          let t=this;
          const classList = e.target.classList.value;
          if(classList.indexOf('ty_bpm_svg_box')>=0){
            //取消线选中
            t.selectedLineUUid = '';
            t._cancelAllLineSelected();
            //取消节点选中
            t._cancelAllNodeSelected();
          }else if(classList.indexOf('activity_content')>=0){
            const clickNode = e.target.offsetParent;
            const uuid = clickNode.getAttribute('uuid');
            t._cancelAllNodeAndSelectedCurrent(uuid);
          }else if(classList.indexOf('activity_item_label')>=0 || classList.indexOf('activity_item_icon')>=0){
            const clickNode = e.target.offsetParent.offsetParent;
            const uuid = clickNode.getAttribute('uuid');
            t._cancelAllNodeAndSelectedCurrent(uuid);
          }
        },
        //取消所有选中，仅选中当前 线
        _cancelAllLineAndSelectedCurrent:function(uuid){
          let t=this;
            t._cancelAllLineSelected();
            let _ref = t.$refs['line-'+uuid];
            if(_ref&&_ref[0]){
              _ref[0].is_active = true;
            }
        },
        //取消所有选中，仅选中当前 节点
        _cancelAllNodeAndSelectedCurrent:function(uuid){
          let t=this;
          //取消节点选中
            t._cancelAllNodeSelected();
            let _ref = t.$refs['node-'+uuid];
            if(_ref&&_ref[0]){
              _ref[0].is_active = true;
            }
        },
        //取消所有线选中
        _cancelAllLineSelected:function(){
          const t=this;
          t.p_lines.forEach((line,index)=>{
            let _ref = t.$refs['line-'+line.uuid];
            if(_ref&&_ref[0]){
              _ref[0].is_active = false;
            }
          });
        },
        //取消所有节点选中
        _cancelAllNodeSelected:function(){
          const t =this;
          t.p_nodes.forEach((node,index)=>{
            let _ref = t.$refs['node-'+node.uuid];
            if(_ref&&_ref[0]){
              _ref[0].is_active = false;
            }
          });
        },
        //节点开始拖动的事件 和下面的dragMove 一起用
        /*
          需要临时参数
          tempFromX,
          tempFromY,
          tempToX,
          tempToY
        */
        boxDragDown:function(item,index){
          let t=this;
          t.p_lines.forEach((line,key)=>{
            line.tempFromX = line.fromPosition.x,
            line.tempFromY = line.fromPosition.y,
            line.tempToX = line.toPosition.x,
            line.tempToY = line.toPosition.y
          });
        },
        //节点拖动事件
        boxDragMove:function(args,item,index){
          let t=this;
          const disW = args[0];
          const disH = args[1];
          //查找所有 和该节点相连的线，起点或终点位置变化
          t.p_lines.forEach((line,key)=>{
            if(line.fromNodeUUID == item.uuid){
              //如果是出发点
              line.fromPosition = {
                x:line.tempFromX+disW,
                y:line.tempFromY+disH
              }
            }
            //可能出发点和终点都是自己 所以不用else if
            if(line.toNodeUUID == item.uuid){
              //如果是终点
              line.toPosition = {
                x:line.tempToX+disW,
                y:line.tempToY+disH
              }
            }
          });
        },
        //节点拖动鼠标up事件
        boxDragUp:function(item,index){
          let t=this;
          t.p_lines.forEach((line,key)=>{
            delete line.tempFromX;
            delete line.tempFromY;
            delete line.tempToX;
            delete line.tempToY;
          });
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
            toNodeDirection:(t._findOppositeDirect(direct)||'up')//终点默认是向上的
          };
          //线添加到数组中
          t.p_lines.push(newLine);
          let deleteLine = true;//是否删除线，没有接到节点上就删除。

          let box = oDiv.offsetParent.offsetParent;

          box.onmousemove = function (e1) {
            let toX = e1.clientX - srcX;
            let toY = e1.clientY - srcY;
            
            let info = t._findTargetNode(toX,toY);
            if(!info){
              //如果没有在节点中
              //更新目标点
              t.p_lines[t.p_lines.length-1].toPosition = {
                x:toX,
                y:toY
              }
              t.p_lines[t.p_lines.length-1].toNodeDirection = t._findOppositeDirect(direct);
              t.p_lines[t.p_lines.length-1].toNodeUUID='';
              deleteLine = true;
            }else{
              t.p_lines[t.p_lines.length-1].toPosition = {
                x:info.targetX,
                y:info.targetY
              }
              t.p_lines[t.p_lines.length-1].toNodeDirection = info.direct;
              t.p_lines[t.p_lines.length-1].toNodeUUID=info.uuid;
              deleteLine =false;
            }
          };
          box.onmouseup = function (e2) {
              box.onmousemove = null;
              box.onmouseup = null;
              // 计算是否留下这条线 ，判断终点是否在节点上，如果在，保留线，如果不在，删除线
              if(deleteLine){
                t.p_lines.splice(t.p_lines.length-1,1);
              }
          };
        },
        /**
            根据鼠标拖动的点，判断是否拖到了节点上
            {
              targetX:12,
              targetY:12,
              uuid:'xxx',
              direct:'left'
            }
        */
        _findTargetNode:function(toX,toY){
          let t=this;
          let result  = null;
          t.nodes.forEach((node,index)=>{
            if(result){
              //有值，结束循环
              return false;
            }
            result = t._checkPointInNode(node,toX,toY);
          });
          console.log('target:',result);
          return result;
        },
        //判断坐标是否在节点中
        _checkPointInNode:function(node,x,y){
          let t=this;
          const sx = t._transferRemAndPxStringToPxNumber(node.position.x);
          const sy = t._transferRemAndPxStringToPxNumber(node.position.y);
          const w = t._transferRemAndPxStringToPxNumber(node.size.width);
          const h = t._transferRemAndPxStringToPxNumber(node.size.height);
          const dis = BASE_ASSIST/2;//距离节点14px距离时，开始吸附

          console.log("x:"+x+"----y:"+y+"----sx:"+sx+"----sy:"+sy+"----w:"+w+"----h:"+h+"----dis:"+dis);
          //判断坐标是否在左边区域
          if(t._checkPointInArea(x,y,sx-dis,sy-dis,sx,sy+h+dis)){
            return {
              targetX:sx,
              targetY:sy+h/2,
              direct:'left',
              uuid:node.uuid
            };
          }
          //判断坐标是否在下边区域
          if(t._checkPointInArea(x,y,sx,sy+h/2,sx+w,sy+h+dis)){
            return {
              targetX:sx+w/2,
              targetY:sy+h,
              direct:'down',
              uuid:node.uuid
            };
          }
          //判断坐标是否在右边区域
          if(t._checkPointInArea(x,y,sx+w,sy-dis,sx+w+dis,sy+h+dis)){
            return {
              targetX:sx+w,
              targetY:sy+h/2,
              direct:'right',
              uuid:node.uuid
            };
          }
          //判断坐标是否在上边区域
          if(t._checkPointInArea(x,y,sx,sy-dis,sx+w,sy+h/2)){
            return {
              targetX:sx+w/2,
              targetY:sy,
              direct:'up',
              uuid:node.uuid
            };
          }
          return null;
        },
        //判断点是否在一定区域
        _checkPointInArea:function(x,y,fromX,fromY,toX,toY){
          let t=this;
          if(x>fromX && x <toX && y>fromY && y<toY){
            return true;
          }
          return false;
        },
        //将rem或者px的string转换成px 的number
        _transferRemAndPxStringToPxNumber:function(val){
          let t=this;
          if(!val){
            return 0;
          }
          if(typeof val ==='number'){
            return val;
          }
          if(val.indexOf('rem')>=0){
            return Number(val.replace('rem','')) * REM_BASE;
          }else if(val.indexOf('REM')>=0){
            return Number(val.replace('REM','')) * REM_BASE;
          }else if(val.indexOf('px')>=0){
            return Number(val.replace('px',''));
          }else if(val.indexOf('PX')>=0){
            return Number(val.replace('PX',''));
          }
        },
        //查到相对的方向
        _findOppositeDirect:function(direct){
          let t=this;
          if(direct === 'down'){
            return 'up';
          }else if(direct === 'up'){
            return 'down';
          }else if(direct === 'left'){
            return 'right';
          }else if(direct === 'right'){
            return 'left';
          }
        },
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