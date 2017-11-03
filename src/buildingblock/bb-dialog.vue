<template>
    <el-dialog :title="title" :visible.sync="active" @close="closeFn" :size="size" :custom-class="className">
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
            }
        },
        data() {
        	return {
        		active: false
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
          }
        }
    }
</script>