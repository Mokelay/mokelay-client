<script>

    export default {
        name: 'bb-canvas-template',
        props: {
            content:{
                type: Object
            }
        },
        data() {
            return {
                result: []
            }
        },
        render: function (createElement) {
            const t = this;
            const bbList = t.renderBB(createElement);
            //控制水平排列
            return createElement('div', {}, bbList);
        },
        methods: {
            renderBB: function (createElement) {
                const t = this;
                const bbList = _TY_Tool.bbRender(t.result.concat(t.content), createElement, t);
                //水平排列垂直排列控制
                bbList.forEach((bbEle, index) => {
                    const bbItem = createElement('div', {}, [bbEle]);
                    bbList.splice(index, 1, bbItem);
                });
                return bbList;
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);
            }
        }
    }
</script>
<style scoped>

</style>