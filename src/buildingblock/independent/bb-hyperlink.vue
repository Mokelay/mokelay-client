<template>
        <a :href="hrefV" @click="aClick" :title="hoverContent" :style="styleObject" >{{contentV}}</a>
</template>

<script>
    export default {
        name: 'bb-hyperlink',
        props: {
            // 文字内容
            contentValue:{
                type: String
            },
            // href地址
            hrefValue:{
                type: String
            },
            // 鼠标移入展示内容
            hoverContent:{
                type: String
            }
        },
        data() {
            return {
                contentV: this.contentValue || '请输入内容',
                hrefV: this.hrefValue,
                styleObject: {
                    'text-decoration': 'none'
                }
            }
        },
        mounted: function(){
            let urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;

            if(!urlReg.test(this.hrefV)){
                this.hrefV = "javascript:void(0);";
            }
        },
        methods: {
            /**
                从外部改变超链接的内容，文案和跳转地址 
                arguments:{
                    text:"文案",
                    href:"跳转地址"
                }
            */
            fillContent:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        t.contentV = val.arguments.text;
                        t.hrefV = val.arguments.href;
                    }
                })
            },
            aClick:function(){
                let t=this;
                t.$emit("click",t);
            }
        }
    }
</script>