<template>
    <el-form :model="formData" label-width="100px" onsubmit="return false;" ref="editorForm">
        <el-form-item :label="field.name" v-for="field in fields" :key="field.attributeName"
                      :prop="field.attributeName"  :class="field.et"  :rules="field.rules" class="form-item" v-show="showItem(field)">

            <bb-hidden v-if="field.et == 'hide'" v-model="formData[field.attributeName]"></bb-hidden>
            <bb-input v-if="field.et == 'input'" :disabled="field.disabled" v-model="formData[field.attributeName]"></bb-input>
            <bb-input-number v-if="field.et == 'number'" :disabled="field.disabled" v-model="formData[field.attributeName]"></bb-input-number>
            <bb-textarea v-if="field.et == 'textarea'" :disabled="field.disabled" v-model="formData[field.attributeName]"></bb-textarea>

            <bb-editor-switch v-if="field.et == 'boolean'" v-model="formData[field.attributeName]"></bb-editor-switch>
            <bb-date-picker v-if="field.et == 'datetime'"
                            v-model="formData[field.attributeName]"
                            :option='field.option'></bb-date-picker>
            <bb-color-picker v-if="field.et == 'color'"
                             v-model="formData[field.attributeName]"></bb-color-picker>
            <bb-editor-array v-if="field.et == 'array'" :fields="field.children"
                             v-model="formData[field.attributeName]"></bb-editor-array>
            <bb-editor-object v-if="field.et == 'object'" :fields="field.children"
                    v-model="formData[field.attributeName]"></bb-editor-object>

            <bb-editor-code :ref="field.attributeName" v-if="field.et == 'code'" :language="field.lang" :width="field.width" :height="field.height" v-model="formData[field.attributeName]" ></bb-editor-code>
            <bb-editor-weditor :ref="field.attributeName" v-if="field.et == 'we'" v-model="formData[field.attributeName]" ></bb-editor-weditor>

            <bb-select v-if="field.et == 'select'" :ds="field.ds" :multiple="field.multiple" :textField="field.textField" :valueField="field.valueField" v-model="formData[field.attributeName]" :fields="field.fields" :options="field.options" @change="commonEvent($event,field.attributeName)"></bb-select>


            <bb-tag v-if="field.et == 'tag'" v-model="formData[field.attributeName]"></bb-tag>
            <bb-button v-if="field.et == 'button'"
                       v-model="formData[field.attributeName]"
                       :type="field.props.type"
                       :loading="field.props.loading"
                       :disabled="field.props.disabled"
            >{{field.name}}</bb-button>
           
            <bb-radio-group v-if="field.et == 'radio'" :options="field.options" v-model="formData[field.attributeName]"
                :ds="field.ds" :optionText="field.optionText" :optionValue="field.optionValue"
            ></bb-radio-group>

            <bb-checkbox-group v-if="field.et == 'checkbox'" :options="field.options" v-model="formData[field.attributeName]"
             :ds="field.ds" :optionText="field.optionText" :optionValue="field.optionValue"
             ></bb-checkbox-group>

            <bb-popup-selection v-if="field.et == 'popup-selection'" v-model="formData[field.attributeName]" :textField="field.props.textField" :valueField="field.props.valueField" :selectText="field.props.selectText" :popupGrid="field.props.popupGrid"></bb-popup-selection>

            <bb-ds-select v-if="field.et == 'ds-select'" v-model="formData[field.attributeName]"></bb-ds-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="setting">设置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>

    export default {
        name: 'bb-editor-object',
        props: {
            value: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            fields: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            rules: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        components: {
        },
        data() {
            return {
                formData: this.value
            }
        },
        watch: {
            value(val){
                this.formData=val;
            }
        },
        beforeCreate: function () {

        },
        created: function () {
            const t = this;
            if(t.fields){
                t.fields.forEach((val,key)=>{
                if(val.etData){
                    //t.value[val.attributeName] = val.etData;
                    t.fields[key].options = JSON.parse(val.etData);
                }
            });
            }
        },
        mounted: function () {
        },
        methods: {
            //表单在何种情况下会显示
            showItem:function(field){
                var showType = field['showType'];
                if(showType){
                    if(showType == 'value-matching'){
                        var showAttributeName = field['showAttributeName'];
                        var showAttributeValue = field['showAttributeValue'];
                        if(showAttributeName && showAttributeValue){
                            return showAttributeValue == this.formData[showAttributeName];
                        }
                    }
                }
                return true;
            },
            clean: function () {
                this.formData = {};
            },
            setting: function () {
                let t=this;
                this.$emit('input', this.formData);
                //this.$emit('adEditItem', this.formData);
                this.$refs['editorForm'].validate(function(valid){
                    if(valid){
                        t.$emit('commit', t.formData);
                    }
                });
            },
            controlForm: function(fn){
                fn.bind(this)("editorForm");
            },
            commonEvent(...args){
                //接收所有事件给父组件识别
                this.$emit('custom-event', {
                    args: args,
                    e: event
                });
            },
        }
    }
</script>

<style scoped>
    .hide {
        display: none;
    }
    .form-item{
        margin-bottom: 5%;
    }
</style>