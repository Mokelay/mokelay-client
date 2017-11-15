<template>
  <div>
      {{v}} <el-button v-if="showButton" type="primary" @click="generate">生成UUID</el-button>
  </div>
</template>

<script>
import Util from '../libs/util';

    export default {
        name: 'bb-uuid',
        props: {
            value:{
              type:[String,Number]
            },
            length:{
              type:Number
            },
            radix:{
              type:Number
            }
        },
        data() {
            return {
                v:this.value,
                showButton:true
            }
        },
        watch: {
            value(val){
                this.v = val;
            }
        },
        created: function () {
            if(!this.value){
                this.generate();
                this.showButton = true
            }else{
                this.showButton = false;
            }
        },
        mounted:function(){
        },
        methods: {
            generate:function(){
                var val = Util.uuid(this.length,this.radix);
                this.v = val;
                this.$emit('input',val);
            }
        }
    }
</script>