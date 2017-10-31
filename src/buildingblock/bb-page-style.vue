<template>
    <div :style="pageStyle"></div>
</template>

<script>
    import Util from '../libs/util.js'

    export default {
        name: 'bb-select',
        props: {
            backgroundImage:{
              type: String,
              default:''
            },
            backgroundSize:{
              type: String,
              default:''
            },
            backgroundRepeat:{
              type: String,
              default:''
            },
            backgroundPosition:{
              type: String,
              default:''
            },
            backgroundColor:{
              type: String,
              default:''
            },
            width:{
              type: String,
              default:''
            },
            height:{
              type: String,
              default:''
            },
            width:{
              type: String,
              default:''
            },
            maxHeight:{
              type: String,
              default:''
            },
            maxWidth:{
              type: String,
              default:''
            },
            display:{
              type: String,
              default:''
            },
            border:{
              type: String,
              default:''
            }
        },
        data() {
            return {
              pageStyle:{
                backgroundImage:""
              }
            }
        },
        watch:{
        },
        created: function () {
        },
        methods: {

        }
    }
</script>