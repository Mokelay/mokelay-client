<template>
    <bb-indep-dialog class="bb-pdf" :isShow="showDialog" :closeOnClickOverlay="true" :showConfirmButton="false" :show-cancel-button="false" cancel-button-text="关闭">
        <div v-if="loading" class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
        <div ref="pdf" id="pdf"></div>
    </bb-indep-dialog>
</template>
<script>
 
export default {
    name: 'bb-pdf',
    props: {
        value: {
            //pdf路径  支持模板
            type: String,
            default: 'http://cdn.mozilla.net/pdfjs/tracemonkey.pdf'
        },
        lazy: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            valueBase:this.value,
            showDialog:false,
            currentPage: 1,
            pageCount: 1,
            loading:false
        };
    },
    created: function () {
    },
    mounted:function() {
        const t = this;
        t.valueBase = _TY_Tool.tpl(t.valueBase, _TY_Tool.buildTplParams(t));
        if(!t.lazy){
            t.getPdf(t.valueBase);
        }
    },
    methods: {
        getPdf(url){
            let t=this;
            //引入第三方vant 的dialog组件
            t.showDialog = true;
            t.loading = true;
            setTimeout(()=>{
                const pdf = r => require.ensure([], () => r(require('vue-pdf')), 'vue-pdf').defalut;
                // var loadingTask = pdf.createLoadingTask(url);
                let Vue = require('vue').default;
                var vm = new Vue({
                    render:function (createElement) {
                        const preButton = createElement("button",{props:{src:url,page:t.currentPage},on:{
                                "click":t.prePage
                            }},"上一页");
                        const pageNumber = createElement("span",{},[`${t.currentPage}/${t.pageCount}`]);
                        const nextButton = createElement("button",{props:{src:url,page:t.currentPage},on:{
                                "click":t.nextPage
                            }},"下一页");
                        const buttons = createElement("span",{class:"buttons"},[preButton,pageNumber,nextButton]);
                        const pdfElement = createElement("pdf",{props:{src:url,page:t.currentPage},on:{
                                "num-pages":($event)=>{t.pageCount = $event?$event:t.pageCount;},
                                "page-loaded":($event)=>{t.currentPage = $event;t.loading = false;}
                            }});
                        return createElement("div",{class:"pdf"},[pdfElement,buttons])
                    },
                    components: {
                        pdf
                    },
                    data() {
                        return {
                        }
                    },
                    mounted() {
                    },
                    methods:{
                    }
                }).$mount('#pdf');
            },0);
        },
        prePage(){
            const t = this;
            if(t.currentPage > 1){
                t.currentPage--;
            }
        },
        nextPage(){
            const t = this;
            if(t.currentPage < t.pageCount){
                t.currentPage++;
            }
        }
    }
}
</script>
 
<style lang="less">
    .bb-pdf-full-screen{
        width:100vw;
        height:100vh;
    }
    .bb-pdf{
        .pdf{
            max-height:90vh;
            overflow: auto;
        }
        .buttons{
            text-align:center;
            display:flex;
            &>span,&>button{
                flex:1;
            }
        }
        .spinner {
          margin: 100px auto;
          width: 50px;
          height: 60px;
          text-align: center;
          font-size: 10px;
        }
         
        .spinner > div {
          background-color: #67CF22;
          height: 100%;
          width: 6px;
          display: inline-block;
           
          -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
          animation: stretchdelay 1.2s infinite ease-in-out;
        }
         
        .spinner .rect2 {
          -webkit-animation-delay: -1.1s;
          animation-delay: -1.1s;
        }
         
        .spinner .rect3 {
          -webkit-animation-delay: -1.0s;
          animation-delay: -1.0s;
        }
         
        .spinner .rect4 {
          -webkit-animation-delay: -0.9s;
          animation-delay: -0.9s;
        }
         
        .spinner .rect5 {
          -webkit-animation-delay: -0.8s;
          animation-delay: -0.8s;
        }
         
        @-webkit-keyframes stretchdelay {
          0%, 40%, 100% { -webkit-transform: scaleY(0.4) } 
          20% { -webkit-transform: scaleY(1.0) }
        }
         
        @keyframes stretchdelay {
          0%, 40%, 100% {
            transform: scaleY(0.4);
            -webkit-transform: scaleY(0.4);
          }  20% {
            transform: scaleY(1.0);
            -webkit-transform: scaleY(1.0);
          }
        }
    }
</style>
