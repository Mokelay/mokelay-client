<template>
  <bb-page :pageAlias="$route.params.pageAlias" ref="Page_Ref_Root" :key="key" :root="true"></bb-page>
</template>

<script>
  export default {
      data() {
        return {};
      },
    computed: {
      key() {//解决router指向同一个component，页面不刷新的问题
        return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
      }
    },
      methods: {
      }
    }
</script>

<style>
</style>