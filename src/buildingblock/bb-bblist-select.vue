<template>
    <div>
        <bb-select :ds="selectDs" :textField="textField" :valueField="valueField" v-model="selectValue" @change='change'></bb-select>
    </div>
</template>

<script>
    export default {
        name: 'bb-bblist-select',
        props: {
            value:{
                type:[Array,String]
            }
        },

        data() {
            return {
                selectDs:{
                    api: "/list-bb",
                    method: "post",
                    inputs: [],
                    outputs: [
                        {dataKey: "items", valueKey: "data_list"}
                    ]
                },
                selectValue:this.value,
                textField:'name',
                valueField:'alias'
            }
        },
        watch: {
            value(val){
                this.selectValue = val;
                this.$emit("input",val);
            },
            table(val){
                this.$emit("input",val);
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            change:function(val){
              this.$emit('input',val)
              this.$emit('change',val)
            }
        }
    }
</script>