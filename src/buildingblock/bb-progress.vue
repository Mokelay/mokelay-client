<template>
  <el-progress :percentage="percentageData"></el-progress>
</template>
<script>
  export default {
    name: 'bb-progress',
    props: {
      percentage:{
        type: [String,Number]
      }
    },
    data() {
      return {
        percentageData:0
      };
    },
    watch:{
      percentage(val){
        console.log('percentage:',val);
        this.percentageData = val;
      }
    }
  }
</script>
<style scoped>

</style>