<template>
    <div>
        <div id="mdEditor">
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import 'mavon-editor/dist/css/index.css'

    export default {
        name: 'bb-editor-md',
        components: {},
        props: {
            value: {//只存储原始值
                type: String
            },
            placeholder: '',//提示文本
            editable: {//是否可编辑
                type: Boolean,
                default: true
            },
            codeStyle: {//编辑器主题
                type: String,
                default: 'code-github'
            }
        },
        data() {
            return {};
        },
        watch: {},
        computed: {},
        beforeCreate: function () {
        },
        created: function () {
        },
        mounted: function () {
            let t = this;
            t.loadLib();
        },
        beforeDestroy() {

        },
        methods: {
            loadLib(){
                let t = this;
                require.ensure(['mavon-editor'], function (require) {
                    var mavonEditor = require('mavon-editor')
                    var _mdEditor = new Vue({
                        router: t.$router,
                        components: {
                            'mavon-editor': mavonEditor.mavonEditor
                        },
                        render: function (createElement) {
                            const mdEditor = createElement('mavon-editor', {
                                props: {
                                    value: t.value,
                                    placeholder: t.placeholder,
                                    editable: t.editable,
                                    code_style: t.codeStyle
                                },
                                on: {
                                    change: function (data, render) {
                                        console.log("data=" + data);
                                        t.$emit('input', data);
                                    },
                                    save: function (data, render) {
                                        console.log("render=" + render);
                                        t.$emit('save', data, render);
                                    }
                                },
                                ref: "mdEditor"
                            }, []);
                            return createElement('div', {class: 'bb-editor-md-content'}, [mdEditor])
                        }
                    }).$mount('#mdEditor');

                })

            }
        }
    }
</script>

<style scoped>


</style>