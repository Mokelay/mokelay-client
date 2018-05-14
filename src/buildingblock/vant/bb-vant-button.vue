<template>
  <van-button type="primary">默认按钮</van-button>
</template>

<script>
import Button from 'vant/lib/button';
import 'vant/lib/button/style';

    export default {
        name: 'bb-vant-button',
        components: {
          "van-button":Button
        },
        props: {},
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