<template>
  <div>{{hello}}</div>
</template>

<script>
    export default {
        name: 'bb-hello-world',
        props: {
            hello:{
              type:String,
              default:'Hello world'
            }
        },
        data() {
            return {
            };
        },
        methods: {
        }
    }
</script>

<style scoped>
</style>