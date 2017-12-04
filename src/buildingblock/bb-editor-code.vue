<template>
    <div>
        <bb-button type="primary" class="m10" @click="submit">代码确认</bb-button>

    </div>
</template>

<script>
import 'codemirror/lib/codemirror.css';
    export default {
        name: 'bb-editor-code',
        components: {
        },
        props: {
            value:{
                type:String
            }
        },
        data() {
            return {
                codeObj : null
            }
        },
        watch: {
            value(val){
                var t = this;
                t.loadLib(function(){
                    t.codeObj.setValue(val || "");
                });
            }
        },
        created: function () {
        },
        mounted: function () {
            var t =this;
            t.loadLib(function(){});
        },
        methods: {
            loadLib: function(callback){
                var t = this;
                var v = t.value || "";
                if(!t. codeObj){
                    require.ensure(['codemirror/lib/codemirror','codemirror/mode/javascript/javascript'], function (require) {
                        var CodeMirror =  require("codemirror/lib/codemirror");
                        t.codeObj = CodeMirror(t.$el, {
                            lineNumbers: true,
                            value: v,
                            mode:  "javascript"
                        });
//                        t.codeObj.on("change",function(c){
//                            t.$emit("input",c.getValue());
//                        });
                        callback();
                    });
                }else{
                    // t.codeObj.setValue(v);
                    callback();
                }
            },
            submit(){
                let t=this;
                t.$emit("input",this.codeObj.getValue());
            }
        }
    }
</script>

<style scoped>
    .m10 {
        margin: 10px;
    }
</style>