<template>
  <div>
      {{v}} <el-button type="primary" @click="generate">生成UUID</el-button>
  </div>
</template>

<script>
import Util from '../libs/util';

    export default {
        name: 'bb-uuid',
        props: {
            value:{
              type:String
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
                v:this.value
            }
        },
        watch: {
            value(val){
                this.v = val;
            }
        },
        created: function () {
            if(!this.value){
                this.generate()
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