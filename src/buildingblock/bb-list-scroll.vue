<template>
    <el-scrollbar :viewStyle="viewStyle" class="scroll-list">
        <ol>
            <li v-for="(list,index) in data"><span v-if="showNumber">{{index+1}}、</span>{{list[keyprop]}}</li>
        </ol>
    </el-scrollbar>
</template>

<script>

    export default {
        name: 'bb-list-scroll',
        props: {
            title: {
                type: String,
                default: ""
            },
            keyprop: {
            	type: String
            },
            isShow: {
                type: Boolean,
                default: false
            },
            showNumber: {
            	  type: Boolean,
                default: false
            },
            data: {
            	  type: Array,
                default: function () {
                    return []
                }
            },
	          viewStyle: {
            	  type: Object,
                default: function(){
                    return {}
                }
            }
        },
        data() {
        	return {
        		active: false
          }
        },
   
    }
</script>

<style scoped lang="less">
    .scroll-list {
        &:after {
            content: '';
            position: absolute;
            width: 100%;
            bottom: 0;
            height: 35px;
            background: linear-gradient(to top, #fff, rgba(255, 255, 255, 0.3));
        }
        ol { padding-bottom: 25px; }
        li { color: #444444; }
        li + li {
            margin-top: 15px;
        }
    }
</style>