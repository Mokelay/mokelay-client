<template>
    <el-dialog :title="title" :visible.sync="active" @close="closeFn" :width="realWidth" :custom-class="className" :append-to-body="appendToBody" :modal-append-to-body="modalAppendToBody" :fullscreen="fullscreen" :modal="modal">
        <slot></slot>
    </el-dialog>
</template>

<script>

    export default {
        name: 'bb-dialog',
        props: {
            title: {
                type: String,
                default: ""
            },
            size: {
                type: String,
                default: "small"
            },
            isShow: {
                type: Boolean,
                default: false
            },
	        className: {
            	  type: String,
                default: ""
            },
            appendToBody:{
                type:Boolean
            },
            modalAppendToBody:{
                type:Boolean
            },
            width:{
                type:String
            },
            modal:{
                type:Boolean
            },
            fullscreen:{
                type:Boolean
            }
        },
        data() {
        	return {
        		active: false
          }
        },
        computed: {
            realWidth:function(){
                const t = this;
                let width = "50%"
                switch(t.size){
                    case "tiny":
                        width = "25%";
                        break;
                    case "small":
                        width = "50%";
                        break;
                    case "large":
                        width = "75%";
                        break;
                    case "full":
                        width = "100%";
                        break;
                }
                if(t.width){
                    width = t.width
                }
                return width
            }
        },
        watch: {
            isShow: function (val, oldVal) {
                this.active = val;
            }
        },
        mounted() {
        	this.active = this.isShow;
        },
        methods: {
	        closeFn() {
                this.$emit('closeDia');
                this.$emit('update:isShow', false)
            }
        }
    }
</script>