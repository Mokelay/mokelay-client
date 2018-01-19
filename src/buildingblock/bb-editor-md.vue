<script>
    import Vue from 'vue';

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
            },
            uploadUrl: {//图片上传url
                type: String
            },
        },
        render: function (createElement) {
            let t = this;
            t.editorId = 'mdEditor_' + Math.floor((Math.random() * 100000));
            let mainDom = createElement(
                    'div',
                    {
                        attrs: {
                            id: t.editorId
                        }
                    },
                    []
            );
            t.loadLib();
            return mainDom;
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
        },
        beforeDestroy() {
        },
        methods: {
            loadLib(){
                let t = this;
                require.ensure(['mavon-editor', 'mavon-editor/dist/css/index.css'], function (require) {
                    require('mavon-editor/dist/css/index.css');
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
                                        t.$emit('input', data);
                                    },
                                    save: function (data, render) {
                                        t.$emit('save', data, render);
                                    },
                                    imgAdd:function(pos, $file){
                                        var formdata = new FormData();
                                        formdata.append('file', $file);
                                        let _uploadUrl='';
                                        let downloadUrl = '';
                                        if(t.uploadUrl){
                                            _uploadUrl = window._TY_Tool.tpl(t.uploadUrl,_TY_Tool.buildTplParams(t,{
                                                host:location.host
                                            }))
                                        }else{
                                            _uploadUrl=window._TY_APIHost+window._TY_ContentPath+'/ty-upload';
                                            downloadUrl=window._TY_APIHost+window._TY_ContentPath+'/ty-download';
                                        }
                                        window._TY_Tool.invoke({
                                            url: _uploadUrl,//完整的url,支持tpl操作，主要是为了访问同根域的接口地址
                                            method: 'post',
                                            data: formdata,
                                            headers: { 'Content-Type': 'multipart/form-data' },
                                        }).then((data) => {
                                            // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
                                            // $vm.$img2Url 详情见本页末尾
                                            let url = data.data.data.file;
                                            if(downloadUrl){
                                                //TY内置下载地址
                                                url = downloadUrl+"?file="+url;
                                            }
                                            mdEditor.componentInstance.$img2Url(pos, url);
                                        })
                                    }
                                },
                                ref: "mdEditor_"+Math.floor((Math.random() * 100000))
                            }, []);
                            return createElement('div', {
                                        class: 'bb-editor-md-content',
                                        style: {
                                            'z-index': 90,
                                            position: 'relative'
                                        }
                                    },
                                    [mdEditor]
                            )
                        }
                    }).$mount('#' + t.editorId);
                })
            }
        }
    }
</script>

<style scoped>

</style>