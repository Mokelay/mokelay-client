<script>
    export default {
        name: 'bb-read-bb',
        render:function(createElement){
            const t = this;
            const bbList = t.renderBB(createElement);
            return createElement('div',{},[bbList]);
        },
        props: {
            fields:{
                type:Array
            },
            value:{
                type:[String,Number]
            }
        },
        data() {
            return {
                valueBase: this.value,
            }
        },
        watch: {
            value(val){
                this.valueBase=val;
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            renderBB:function(createElement){
                const t = this;
                const bbList = [];
                if(t.fields){
                    t.fields.forEach((field,key)=>{
                        let etProps = typeof field['etProps'] == 'string'?eval("("+field['etProps']+")"):field['etProps'];
                        bbList.push(createElement(field['et'],{props:etProps},[]));
                    });
                }
                return bbList;
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>














