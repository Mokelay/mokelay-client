<template>
    <van-address-edit
      :area-list="areaList"
      show-postal
      show-delete
      show-set-default
      show-search-result
      :search-result="searchResult"></van-address-edit>
</template>

<script>
import AddressEdit from 'vant/lib/address-edit';
import 'vant/lib/address-edit/style';

    export default {
        name: 'bb-vant-address-edit',
        components: {
          "van-address-edit":AddressEdit
        },
        props: {},
        data() {
            return {
                areaList:{},
                searchResult:[]
            };
        },
        methods: {
        }
    }
</script>

<style scoped>
</style>