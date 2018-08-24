<template>
    <bb-indep-dialog :isShow="showDialog" :closeOnClickOverlay="true">
        <div ref="pdf" id="pdf">
        </div>
    </bb-indep-dialog>
</template>
<script>
 
export default {
    name: 'bb-pdf',
    props: {
        value: {
            //pdf路径  支持模板
            type: String,
            default: ''
        },
        lazy: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            valueBase:this.value,
            showDialog:false
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
            setTimeout(()=>{
                const pdf = r => require.ensure([], () => r(require('vue-pdf')), 'vue-pdf');
                let Vue = require('vue').default;
                var vm = new Vue({
                    render:function (createElement) {
                        const t = this;
                        return createElement("pdf",{props:{src:url}});
                    },
                    components: {
                        pdf
                    },
                    data() {
                        return {
                            currentPage: 0,
                            pageCount: 0,
                        }
                    }
                }).$mount('#pdf');
            },0);
        }
    }
}
</script>
 
<style scoped>
</style>
