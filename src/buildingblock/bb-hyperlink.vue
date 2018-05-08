<template>
    <div class="bb-hyperlink">
        <a :href="hrefV" :title="hoverContent" :style="styleObject" >{{contentV}}</a>
    </div>
</template>

<script>
    export default {
        name: 'bb-input-number',
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
            },
            // 超链接颜色
            hyperlinkColor:{
                type: String
            }
        },
        data() {
            return {
                contentV: this.contentValue || '请输入内容',
                hrefV: this.hrefValue,
                styleObject: {
                    'color': this.hyperlinkColor || '',
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
            
        }
    }
</script>