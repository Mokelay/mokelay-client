<template>
	<div class='edit-attribute'>
		<bb-form :value="bbValue" :fields="bbEditFields" :settingButtonText="settingButtonText" @commit="commit"></bb-form>
	</div>
</template>
<script>
    export default {
        name: 'bb-edit-attribute',
        props: {
            bbValue:{
                type:[Object,String]
            },
            bbEditFields:{
                type:Array
            }
        },
        data() {return{

        }},
        computed: {},
        watch: {},
        methods: {
            commit:function(formData){
                const t = this;
                t.$emit('commit',formData);
            }
        }    
    }
</script>
<style lang="less" scoped>
    .edit-attribute{
        padding: 11px;
        padding-bottom: 0;
    }
</style>