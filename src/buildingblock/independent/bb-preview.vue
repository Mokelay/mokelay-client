<template>
  <div class="bb-preview">
    <p class="title">{{title}}</p>
    <div class='bb-preview-item' v-for="(bbItem,index) in value.content" :id="bbItem.uuid" :key="index">
        <bb :alias="bbItem.alias" :key="timestamp" :config="bbItem.attributes" :style="bbItem.style"></bb>
    </div>
  </div>
</template>
<script>

  import bb from './bb.vue';

    export default {
        name: 'bb-preview',
      components:{
          "bb":bb
      },
        props: {
            value:{
                type:[String,Object]
            }
        },
        data() {
            const t = this;
            return{
                title: '',
                realValue:[],
                timestamp:null
            }
        },
        watch: {
            'value.content'(val){
                const t = this;
                t.getTimeKey();
                val.forEach((ele,index)=>{
                    t.$set(t.realValue,index,ele);
                })
            },
            'value.layoutObject'(val){
                this.title =  val.title
            }
        },
        created(){
            const t = this;
            t.title = t.value.layoutObject.title;
            t.value.content.forEach((ele,index)=>{
                t.$set(t.realValue,index,ele);
            })
            t.getTimeKey();
        },
        methods: {
          getTimeKey:function(){
              this.timestamp = Date.parse(new Date());
          }
        }    
    }
</script>
<style lang="less" scoped>
</style>