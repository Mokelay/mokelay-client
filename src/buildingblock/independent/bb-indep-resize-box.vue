
  <script>

    //获取页面基准值，有时可能会变
    let REM_BASE = 28;
    window.setTimeout(()=>{
      //取rem 基准值
      REM_BASE = document.documentElement.style['font-size']?Number(document.documentElement.style['font-size'].replace('px','')):28;
    },1000);
    

    export default {
      name: 'bb-indep-resize-box',
      render: function (createElement) {
        let t=this;

        const contentInstance = t.renderContent(createElement);
        const resizeInstance = t.renderResize(createElement);
        const assistlineInstance = t.renderAssistline(createElement);

        return createElement('div',{
          class:"activity_instance",
          domProps:{
            'data-uuid':t.p_activityData.uuid
          },
          style:{
            left:t.p_activityData.position.x,
            top:t.p_activityData.position.y,
            width:t.p_activityData.size.width,
            height:t.p_activityData.size.height
          },
          on:{
            mousedown:function(e){
              // 鼠标按下，计算当前元素距离可视区的距离
              let oDiv = e.srcElement;
              //resize按钮不拖动
              if(oDiv.classList.value.indexOf('resize')>=0 || oDiv.classList.value.indexOf('assistline')>=0){
                return;
              }
              while(oDiv.classList.value.indexOf('activity_instance')<0){
                oDiv = oDiv.offsetParent;
              }
              //计算事件dom 的相对x，y值
              let srcX = (e.clientX - oDiv.offsetParent.getBoundingClientRect().left) - (e.clientX-oDiv.getBoundingClientRect().left);
              let srcY = (e.clientY - oDiv.offsetParent.getBoundingClientRect().top) - (e.clientY-oDiv.getBoundingClientRect().top);

              let disX = e.clientX;
              let disY = e.clientY;
              oDiv.offsetParent.onmousemove = function (e1) {
                  // 通过事件委托，计算移动的距离
                  let left = srcX + (e1.clientX - disX);
                  let top = srcY + (e1.clientY - disY);
                  t.drag({x: ((left/REM_BASE) + 'rem'), y: ((top/REM_BASE) + 'rem')});
              };
              oDiv.offsetParent.onmouseup = function (e) {
                  oDiv.offsetParent.onmousemove = null;
                  oDiv.offsetParent.onmouseup = null;
                  //抛出事件
                  t.$emit('change',t.p_activityData);
              };
            }
          }
        },[contentInstance].concat(resizeInstance,assistlineInstance));
      },
      props: {
        //是否可改变大小
        resize:{
          type:Boolean,
          default:true
        },
        //节点数据   content表示节点点击后  可以展示的表单；data表示业务数据
        activityData:{
          type:Object,
          default:function(){
            return {
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
            };
          }
        }
       
      },
      data() {
        return {
          p_activityData:this.activityData
        };
      },
      created: function () {

      },
      methods: {
        drag:function(_position){
          console.log(_position);
          const t = this;
          t.p_activityData.position = {x: _position.x, y: _position.y};
        },
        //渲染box 中间的内容
        renderContent:function(createElement){
          let t=this;
          const iconInstance = createElement('i',{
            class:"activity_item_icon iconfont "+t.p_activityData.icon
          },[]);
          const textInstance = createElement('span',{
            class:"activity_item_label",
            domProps:{
              innerHTML:t.p_activityData.text||''
            }
          },[]);
          return createElement('div',{
            class:"activity_content",
            style:{
              cursor:'move'
            }
          },[iconInstance,textInstance]);
        },
        //渲染可变大小node
        renderResize:function(createElement){
          let t=this;
          const result = [];
          ['topleft','topright','bottomleft','bottomright'].forEach((item)=>{
            result.push(createElement('div',{
              class:"resize resize_"+item
            },[]));
          });
          return result;
        },
        //渲染引线节点
        renderAssistline:function(createElement){
           const result = [];
          ['left','right','up','down'].forEach((item)=>{
            result.push(createElement('div',{
              class:"assistline assistline_"+item
            },[]));
          });
          return result;
        }

      }
    }
  </script>

  <style lang="less" scoped>
      .activity_instance{
        position: absolute;
        resize: none;
        overflow: visible;
        min-width: 4.357rem;
        cursor: move;
        padding: .35714rem 0;
        background-color: #fff;
        border: .035714rem solid #37abfd;
        border-radius: .10714rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        border-radius:.10714rem;
        &:hover{
          box-shadow:0 0 .17857rem rgba(75,155,237,.5);
        }
        &.activity_selected{
          z-index:2;
        }
        .activity_content{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            z-index: 10;
            overflow: visible;
          .activity_item_icon{
            border: none;
            margin-right: .17857rem;
            background-repeat: no-repeat;
            background-size: contain;
            z-index: inherit;
            font-family: icomoon;
            font-size: .571428rem;
            color: #4997d6;
            width: .714285rem;
            font-size: .5rem;
          }
          .activity_item_label{
            display: inline-block;
            max-width: 100%;
            margin-left: -0.535714rem;
            padding-left: .714285rem;
            max-height: 1.42857rem;
            color: black;
            font-size: .464285rem;
            text-align: left;
            line-height: .714285rem;
            position: relative;
            z-index: inherit;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .resize{
          z-index: 9999;
          position: absolute;
          border: .035714rem solid gray;
          width: .214285rem;
          height: .214285rem;
          background-color: #7fff00;
          display: none;
        }
        .resize_topleft{
          top: -0.1785714rem;
          cursor: nw-resize;
          left: 0;
          margin-left: -0.10714rem;
        }
        .resize_topright{
          top: -0.1785714rem;
          cursor: ne-resize;
          left: 100%;
          margin-left: -0.10714rem;
        }
        .resize_bottomleft{
          left: -0.1785714rem;
          cursor: sw-resize;
          top: 100%;
          margin-top: -0.10714rem;
        }
        .resize_bottomright{
          right: -0.1785714rem;
          cursor: se-resize;
          top: 100%;
          margin-top: -0.10714rem;
        }
        .assistline{
          z-index: 9999;
          position: absolute;
          border: .035714rem solid red;
          cursor: crosshair;
          width: .285714rem;
          height: .285714rem;
          border-radius: 50%;
          background-color: #fff;
          display: none;
        }
        .assistline_left{
          left: -0.1785714rem;
          top: 50%;
          margin-top: -0.1428571rem;
        }
        .assistline_right{
          right: -0.1428571rem;
          top: 50%;
          margin-top: -0.1428571rem;
        }
        .assistline_up{
          top: -0.1428571rem;
          left: 50%;
          margin-left: -0.1428571rem;
        }
        .assistline_down{
          bottom: -0.1428571rem;
          left: 50%;
          margin-left: -0.1428571rem;
        }
        
      }
  </style>