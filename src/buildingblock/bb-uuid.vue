<template>
  <div>
      {{v}} <el-button type="primary" @click="generate">生成UUID</el-button>
  </div>
</template>

<script>
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
                v:null
            }
        },
        watch: {
            value(val){
                this.v = val;
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            generate:function(){
                var uuid = function(len, radix) {
                  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
                  var uuid = [], i;
                  radix = radix || chars.length;
                  
                  if (len) {
                   for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
                  } else {
                   var r;
                   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                   uuid[14] = '4';
                   for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                     r = 0 | Math.random()*16;
                     uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                   }
                  }
                  
                  return uuid.join('');
                }

                var val = uuid(this.length,this.radix);
                this.v = val;
                this.$emit('input',val);
            }
        }
    }
</script>