<template>
    <el-form :model="formData" label-width="80px">
        <div v-for="field in p_fields" :key="field.attributeName">
            <el-form-item :label="field.name" :class="field.et" :attr-name="field.attributeName">
                <input v-if="field.et == 'hide'" type="hidden" v-model="formData[field.attributeName]"/>

                <el-input v-if="field.et == 'input'" v-model="formData[field.attributeName]"
                          @change="commonEvent($event,field.attributeName)" :attr-name="field.attributeName"></el-input>

                <el-input-number v-if="field.et == 'number'" v-model="formData[field.attributeName]"
                                 @change="commonEvent($event,field.attributeName)"
                                 :attr-name="field.attributeName"></el-input-number>
                <el-switch v-if="field.et == 'boolean'" active-text="是" inactive-text="否"
                           v-model="formData[field.attributeName]" :attr-name="field.attributeName"></el-switch>
                <el-date-picker v-if="field.et == 'datetime'" v-model="formData[field.attributeName]"
                                :attr-name="field.attributeName" type="datetime"
                                placeholder="选择日期时间"></el-date-picker>
                <el-color-picker v-if="field.et == 'color'" v-model="formData[field.attributeName]"
                                 :attr-name="field.attributeName"></el-color-picker>
                <bb-editor-array v-if="field.et == 'array'" :fields="field.children"
                                 v-model="formData[field.attributeName]"></bb-editor-array>

                <el-input type="textarea" v-if="field.et == 'textarea'"
                          v-model="formData[field.attributeName]" :attr-name="field.attributeName"></el-input>
                <el-select v-if="field.et == 'select'" v-model="formData[field.attributeName]"
                           @change="commonEvent($event,field.attributeName)"
                           placeholder="请选择">
                    <el-option
                            v-for="item in field.options"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value"
                            :attr-name="field.attributeName">
                    </el-option>
                </el-select>

                <bb-editor-field-tree-select v-if="field.et == 'fieldtree'" v-model="formData[field.attributeName]"
                                             :oi-alias="field.oiAlias"
                                             @tree-commit="commonEvent($event,field.attributeName)"
                                             :attr-name="field.attributeName"></bb-editor-field-tree-select>

            </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button type="primary" v-if="formData.id" @click="_delete">删除</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import bbEditorFieldtreeSelect from "./bb-editor-field-tree-select";

    export default {
        name: 'bb-editor-field-form',
        props: {
            fieldObject: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            fields: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                formData: this.fieldObject,
                p_fields: this.fields
            }
        },
        components: {
            'bb-editor-field-tree-select': bbEditorFieldtreeSelect,
        },
        watch: {
            fieldObject: function (val) {
                this.formData = val;
            },
            fields: function (val) {
                this.p_fields = val;
            }
        },
        beforeCreate: function () {
        },
        created: function () {

        },
        mounted: function () {
        },
        methods: {
            clean: function () {
                this.formData = {};
            },
            submit: function () {
                this.$emit('commit', this.formData);
            },
            commonEvent(...args){
                //接收所有事件给父组件识别
                this.$emit('custom-event', {
                    args: args,
                    e: event
                });
            },
            _delete(){
                this.$emit('delete-field', this.formData);
            }

        }
    }
</script>

<style scoped>

    .hide {
        display: none;
    }
</style>