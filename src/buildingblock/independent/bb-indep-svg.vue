
  <script>
    //画线都是已px为单位

    //获取页面基准值，有时可能会变
    // let REM_BASE = 28;
    // window.setTimeout(()=>{
    //   //取rem 基准值
    //   REM_BASE = document.documentElement.style['font-size']?Number(document.documentElement.style['font-size'].replace('px','')):28;
    // },1000);
    //需要折线的标志长度
    const BASE_ASSIST = 28;//px

    //方向定义   up、down、left、right

    export default {
      name: 'bb-indep-svg',
      render: function (createElement) {
        let t=this;
        const lineInstance = t.renderLine(createElement);
        const polygonInstance = t.renderPolygon(createElement);
        return createElement('svg',{

        },[lineInstance,polygonInstance]);
      },
      props: {
        //是否不要外层的svg标签,画图的时候有多条线，外层svg标签在组件中添加
        removeSvg:{
          type:Boolean,
          default:false
        },
        //节点数据   content表示节点点击后  可以展示的表单；data表示业务数据
        svgData:{
          type:Object,
          default:function(){
            return {
              uuid:'',
              type:'',
              fromNodeUUID:'',
              toNodeUUID:'',
              fromPosition:{
                x:50,
                y:30
              },
              toPosition:{
                x:100,
                y:220
              },
              fromNodeDirection:'left',// 触发节点的什么方位 画线
              toNodeDirection:'up'
            }
          }
        }
      },
      data() {
        return {
          p_svgData:this.svgData,
          is_active:false,//是否选中
          linePath:'',//path 的d参数值  M261,212 L 261 262 
          polygonPoint:'',//三角箭头的点阵 261,270 257,262 265,262
        };
      },
      watch:{
        svgData(val){
          this.p_svgData = val;
        }
      },
      created: function () {

      },
      methods: {
        svgResize:function(){
          const t = this;
        },
        //画线
        renderLine:function(createElement){
          let t=this;
          const d = t.buildPath();
          return createElement('path',{
            attrs:{
              fill:'white',
              'fill-opacity':'0',
              stroke:'rgb(75, 155, 237)',
              'stroke-width':'1',
              d:d
            }
          },[]);
        },
        //画箭头
        renderPolygon:function(createElement){
          let t=this;
          const polygon = t.buildPolygon();
          return createElement('polygon',{
            attrs:{
              fill:'rgb(75, 155, 237)',
              'fill-opacity':'1',
              stroke:'rgb(75, 155, 237)',
              'stroke-width':'1',
              points:polygon
            }
          },[]);
        },
        //构建 三角箭头点阵
        buildPolygon:function(){
          let t=this;
          const points = t._buildAllPoint();
          const lastPoint = points[points.length-1];
          const toDirection = t.p_svgData.toNodeDirection;//目标点方向
          let resultPath = lastPoint.x+","+lastPoint.y+" ";
          const oppositeDirect = t._findOppositeDirect(toDirection);
          //构造一个8*8的小方形
          if(oppositeDirect==='down'){
            //第二个点和第三个点
            resultPath = resultPath+ (lastPoint.x-3) + ","+(lastPoint.y-7)+" ";
            resultPath = resultPath+ (lastPoint.x+3) + ","+(lastPoint.y-7)+" ";
          }else if(oppositeDirect === 'up'){
            resultPath = resultPath+ (lastPoint.x-3) + ","+(lastPoint.y+7)+" ";
            resultPath = resultPath+ (lastPoint.x+3) + ","+(lastPoint.y+7)+" ";
          }else if (oppositeDirect === 'left'){
            resultPath = resultPath+ (lastPoint.x+7) + ","+(lastPoint.y-3)+" ";
            resultPath = resultPath+ (lastPoint.x+7) + ","+(lastPoint.y+3)+" ";
          }else if (oppositeDirect === 'right'){
            resultPath = resultPath+ (lastPoint.x-7) + ","+(lastPoint.y-3)+" ";
            resultPath = resultPath+ (lastPoint.x-7) + ","+(lastPoint.y+3)+" ";
          }
          // t.polygonPoint = resultPath;
          return resultPath;
        },
        //根据原始点和目标点，画线
        buildPath:function(){
          let t=this;
          const points = t._buildAllPoint();
          let resultPath = '';
          points.forEach((item,index)=>{
            if(index==0){
              //起点
              resultPath =resultPath + 'M'+item.x+","+item.y+" "; 
            }else{
              resultPath = resultPath + 'L'+item.x+" "+item.y+" ";
            }
          });
          // t.linePath = resultPath;
          return resultPath;
        },
        //构建所有的点集合
        _buildAllPoint:function(){
          let t=this;
          const fromDirection = t.p_svgData.fromNodeDirection;//起始点方向
          const toDirection = t.p_svgData.toNodeDirection;//目标点方向
          const fromPoint = t.p_svgData.fromPosition;//起始点
          const toPoint = t.p_svgData.toPosition;//目标点
          let pointArray = [fromPoint];//起始点
          let startPoint = fromPoint;//开始点
          let endPoint = toPoint;//结束点
          let fromHasAssist = false;//原点是否有延长线
          let toHasAssist = false;//终点是否有延长线
          if(t._checkNeedAssist(fromDirection,fromPoint,toPoint)){
            //判断起点是否需要BASE_ASSIST px 长度的延长线，用于隔开box
            startPoint = t._calculateNextPoint(fromDirection,fromPoint,{width:BASE_ASSIST,height:BASE_ASSIST});//计算开始点
            pointArray.push(startPoint);
            fromHasAssist = true;
          }
          //计算重点 是否需要延长
          if(t._checkNeedAssist(toDirection,toPoint,fromPoint)){
            endPoint = t._calculateNextPoint(toDirection,toPoint,{width:BASE_ASSIST,height:BASE_ASSIST});
            toHasAssist = true;
          }
          //计算开始点和结束点 的方向
          let startDirect = 'left';//开始点方向默认为left
          let endDirect = 'left';//结束点方向
          //开始点
          if(fromHasAssist){
            //结束点相对开始点的方向 ['left','up']
            let startToEndDirect = t._calculateDirect(startPoint,endPoint);
            if(startToEndDirect.indexOf(fromDirection)>=0){
              startToEndDirect.splice(startToEndDirect.indexOf(fromDirection),1)
              startDirect = startToEndDirect[0];
            }else if(startToEndDirect.indexOf(t._findOppositeDirect(fromDirection))>=0){
              startToEndDirect.splice(startToEndDirect.indexOf(t._findOppositeDirect(fromDirection)),1)
              startDirect = startToEndDirect[0];
            }
          }else{
            //如果没有加延长线，方向和原始方向一致
            startDirect = fromDirection;
          }
          //结束点
          if(toHasAssist){
             //开始点相对结束点的方向 ['left','up']
            let endToStartDirect = t._calculateDirect(endPoint,startPoint);
            if(endToStartDirect.indexOf(toDirection)>=0){
              endToStartDirect.splice(endToStartDirect.indexOf(toDirection),1)
              endDirect = endToStartDirect[0];
            }else if(endToStartDirect.indexOf(t._findOppositeDirect(toDirection))>=0){
              endToStartDirect.splice(endToStartDirect.indexOf(t._findOppositeDirect(toDirection)),1)
              endDirect = endToStartDirect[0];
            }
          }else{
            endDirect = toDirection;
          }
          const middlePoint = t._calculateMiddlePoint(startPoint,endPoint,startDirect,endDirect);
          pointArray = pointArray.concat(middlePoint);
          if(toHasAssist){
            //如果目标点有延长点
            pointArray.push(endPoint);
          }
          pointArray.push(toPoint);
          return pointArray;
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
        //计算中间点 []
        _calculateMiddlePoint:function(start,end,startDirect,endDirect){
          let t=this;
          const result = [];
          const disW = end.x - start.x;
          const disH = end.y - start.y;
          const disWAbs = Math.abs(disW);//长度绝对值
          //上面已经去除了  延长线相交的情况，如果startDirect和endDirect不是相对的话，只有一个中间点，相对则有两个中间点
          if(startDirect==='down'){
            if(endDirect==='up'){
              //两个中间点
              //不需要考虑结束点在开始点的左边还是右边
              result.push({
                x:start.x,
                y:start.y+(disH/2)
              });
              result.push({
                x:end.x,
                y:end.y-(disH/2)
              });
              return result;
            }else if(endDirect==='left'||endDirect==='right'){
              //一个中间点
              return [{
                x:start.x,
                y:end.y
              }]
            }//没有相同的down方向
          }else if(startDirect==='up'){
            if(endDirect==='down'){
              //两个中间点
              result.push({
                x:start.x,
                y:start.y+(disH/2)
              });
              result.push({
                x:end.x,
                y:end.y-(disH/2)
              });
              return result;
            }else if(endDirect==='left'||endDirect==='right'){
              //一个中间点
              return [{
                x:start.x,
                y:end.y
              }]
            }else if(startDirect === 'left'){
              if(endDirect === 'right'){
                 //两个中间点
                result.push({
                  x:start.x+(disW/2),
                  y:start.y
                });
                result.push({
                  x:end.x-(disW/2),
                  y:end.y
                });
                return result;
              }else if(endDirect === 'up' || endDirect === 'down'){
                //一个中间点
                return [{
                  x:end.x,
                  y:start.y
                }]
              }
            }else if(startDirect === 'right'){
              if(endDirect === 'left'){
                //两个中间点
                result.push({
                  x:start.x+(disW/2),
                  y:start.y
                });
                result.push({
                  x:end.x-(disW/2),
                  y:end.y
                });
                return result;
              }else if(endDirect === 'up' || endDirect === 'down'){
                //一个中间点
                return [{
                  x:end.x,
                  y:start.y
                }]
              }
            }
          }
        },
        //计算开始和结束点方向
        _calculateDirect:function(start,end){
          let t=this;
          if(start.x<=end.x && start.y <= end.y){
            return ['down','right'];
          }else if(start.x<=end.x && start.y >= end.y){
            return ['up','right'];
          }else if(start.x>=end.x && start.y >= end.y){
            return ['up','left'];
          }else if(start.x>=end.x && start.y <= end.y){
            return ['down','left'];
          }
        },
        //计算下一个点
        _calculateNextPoint:function(direct,fromPoint,size){
          let t=this;
          if(direct === 'down'){
            return {x:fromPoint.x,y:fromPoint.y+size.height};
          }else if(direct === 'up'){
            return {x:fromPoint.x,y:fromPoint.y-size.height};
          }else if(direct === 'left'){
            return {x:(fromPoint.x-size.width),y:fromPoint.y};
          }else if(direct === 'right'){
            return {x:(fromPoint.x+size.width),y:fromPoint.y};
          }
        },
        //判断是否需要折线 ,起始点和目标点都是这个方法校验
        _checkNeedAssist:function(direction,fromPoint,toPoint){
          let t=this;
          if(direction==='up'&&(toPoint.y-fromPoint.y)>BASE_ASSIST){
            return true;
          }else if(direction==='down'&&(fromPoint.y-toPoint.y)>BASE_ASSIST){
            return true;
          }else if(direction==='right'&&(fromPoint.x-toPoint.x)>BASE_ASSIST){
            return true;
          }else if(direction==='left'&&(toPoint.x-fromPoint.x)>BASE_ASSIST){
            return true;
          }
          return false;
        },
       

      }
    }
  </script>

  <style lang="less" scoped>
     
  </style>