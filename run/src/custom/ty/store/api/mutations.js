import * as types from './../mutation-types';
import Vue from 'vue';


export default {


    [types.CLEAR_STATE_API_CACHE](state, data){
        state.currentApiLego = {
            id: '',
            apiAlias: '',
            legoAlias: '',
            oiAlias: '',
            index: '',
            attributes: ''
        };
        state.api = {
            id: '',
            enable: '',
            name: '',
            alias: '',
            apiLego: []
        };
    },
    [types.SET_CURRENT_APILEGO](state, data){
        Object.assign(state.currentApiLego, data);
    },
    [types.ADD_API] (state, api) {
        //初始化api
        state.api = {
            id: '',
            enable: '',
            name: '',
            alias: '',
            apiLego: []
        };
        Object.assign(state.api, api);
    },

    [types.GET_API_INFO] (state, apiInfo) {
        //初始化api
        state.api = {
            id: '',
            enable: '',
            name: '',
            alias: '',
            apiLego: []
        };
        const api = apiInfo['data']['data'];
        const apiLegoList = apiInfo['data']['data_list']['list'];//apiLegoList[i]['data']
        Object.assign(state.api, api);
        for (let i = 0; i < apiLegoList.length; i++) {
            const len = state.api.apiLego.length;
            if (len == 0) {
                state.api.apiLego.splice(1, 0, []);
                for (let k in apiLegoList[i]) {
                    Vue.set(state.api.apiLego[0], k, apiLegoList[i][k]);
                }
            } else {
                state.api.apiLego.splice(len + 1, 0, apiLegoList[i]);
            }
        }
    },

    [types.ADD_APILEGO] (state, data) {
        let len = state.api.apiLego.length;
        //设置当前apiLego
        Object.assign(state.currentApiLego, data);
        if (len == 0) {
            state.api.apiLego.splice(1, 0, []);
            for (let i in data) {
                Vue.set(state.api.apiLego[0], i, data[i]);
            }
        } else {
            state.api.apiLego.splice(len + 1, 0, data);
        }
    },
    [types.DELETE_APILEGO] (state, data) {
        let len = state.api.apiLego.length;
        let apiLego = state.api.apiLego;
        //设置当前apiLego
        for (let i = 0; i < len; i++) {
            let item = apiLego[i];
            if (item.id == data.apiLegoId) {
                state.api.apiLego.splice(i, 1);//删除i节点
                break;//不支持批量删除
            }
        }
    },
    //添加input字段
    [types.ADD_APILEGO_INPUTFIELD] (state, data) {
        var legos = state.api.apiLego;
        for (let i = 0; i < legos.length; i++) {
            var item = legos[i];
            if (item.id == data.apiLegoId) {
                for (let j = 0; j < data.inputFields.length; j++) {
                    let inputField = data.inputFields[j];
                    if (inputField.ift == 'read') {
                        if (!item.readInputFields) {
                            Vue.set(state.api.apiLego[i], "readInputFields", []);
                        }
                        let len = item.readInputFields.length;
                        state.api.apiLego[i].readInputFields.splice(len + j, 0, inputField);
                    } else if (inputField.ift == 'condition') {
                        if (!item.conditionInputFields) {
                            Vue.set(state.api.apiLego[i], "conditionInputFields", []);
                        }
                        let len = item.conditionInputFields.length;
                        state.api.apiLego[i].conditionInputFields.splice(len + j, 0, inputField);
                    } else if (inputField.ift == 'create') {
                        if (!item.createInputFields) {
                            Vue.set(state.api.apiLego[i], "createInputFields", []);
                        }
                        let len = item.createInputFields.length;
                        state.api.apiLego[i].createInputFields.splice(len + j, 0, inputField);
                    } else if (inputField.ift == 'update') {
                        if (!item.updateInputFields) {
                            Vue.set(state.api.apiLego[i], "updateInputFields", []);
                        }
                        let len = item.updateInputFields.length;
                        state.api.apiLego[i].updateInputFields.splice(len + j, 0, inputField);
                    } else if(inputField.ift == 'cache'){
                        //在没有响应式的时候，添加响应式
                        if (!item.cacheInputFields) {
                            Vue.set(state.api.apiLego[i], "cacheInputFields", []);
                        }
                        let len = item.cacheInputFields.length;
                        state.api.apiLego[i].cacheInputFields.splice(len + j, 0, inputField);
                    }else {
                        //在没有响应式的时候，添加响应式
                        if (!item.commonInputFields) {
                            Vue.set(state.api.apiLego[i], "commonInputFields", []);
                        }
                        let len = item.commonInputFields.length;
                        state.api.apiLego[i].commonInputFields.splice(len + j, 0, inputField);
                    }
                }
                break;
            }
        }

    },
    //添加output字段
    [types.ADD_APILEGO_OUTPUTFIELD] (state, data) {
        var legos = state.api.apiLego;
        for (let i = 0; i < legos.length; i++) {
            var item = legos[i];
            if (item.id == data.apiLegoId) {
                for (let j = 0; j < data.outputFields.length; j++) {
                    let outputField = data.outputFields[j];
                    if (outputField.oft == 'read') {
                        if (!item.readOutputFields) {
                            Vue.set(state.api.apiLego[i], "readOutputFields", []);
                        }
                        let len = item.readOutputFields.length;
                        state.api.apiLego[i].readOutputFields.splice(len + j, 0, outputField);
                    } else if (outputField.oft == 'condition') {
                        if (!item.conditionOutputFields) {
                            Vue.set(state.api.apiLego[i], "conditionOutputFields", []);
                        }
                        let len = item.conditionOutputFields.length;
                        state.api.apiLego[i].conditionOutputFields.splice(len + j, 0, outputField);
                    } else if (outputField.oft == 'create') {
                        if (!item.createOutputFields) {
                            Vue.set(state.api.apiLego[i], "createOutputFields", []);
                        }
                        let len = item.createOutputFields.length;
                        state.api.apiLego[i].createOutputFields.splice(len + j, 0, outputField);
                    } else if (outputField.oft == 'update') {
                        if (!item.updateOutputFields) {
                            Vue.set(state.api.apiLego[i], "updateOutputFields", []);
                        }
                        let len = item.updateOutputFields.length;
                        state.api.apiLego[i].updateOutputFields.splice(len + j, 0, outputField);
                    } else if(outputField.oft == 'cache'){
                        //在没有响应式的时候，添加响应式
                        if (!item.cacheOutputFields) {
                            Vue.set(state.api.apiLego[i], "cacheOutputFields", []);
                        }
                        let len = item.cacheOutputFields.length;
                        state.api.apiLego[i].cacheOutputFields.splice(len + j, 0, outputField);
                    } else {
                        //在没有响应式的时候，添加响应式
                        if (!item.commonOutputFields) {
                            Vue.set(state.api.apiLego[i], "commonOutputFields", []);
                        }
                        let len = item.commonOutputFields.length;
                        state.api.apiLego[i].commonOutputFields.splice(len + j, 0, outputField);
                    }
                }
                break;
            }
        }
    },

    //更新input字段
    [types.UPDATE_APILEGO_INPUTFIELD] (state, data) {
        var legos = state.api.apiLego;
        for (let i = 0; i < legos.length; i++) {
            var item = legos[i];
            if (item.id == data.apiLegoId) {
                for (let j = 0; j < data.inputFields.length; j++) {
                    let inputField = data.inputFields[j];
                    if (inputField.ift == 'read') {
                        if (item.readInputFields) {
                            let len = item.readInputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.readInputFields[m];
                                if (_f.id == inputField.id) {
                                    Object.assign(state.api.apiLego[i].readInputFields[m], inputField);
                                }
                            }
                        }
                    } else if (inputField.ift == 'condition') {
                        if (item.conditionInputFields) {
                            let len = item.conditionInputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.conditionInputFields[m];
                                if (_f.id == inputField.id) {
                                    Object.assign(state.api.apiLego[i].conditionInputFields[m], inputField);
                                }
                            }
                        }
                    } else if (inputField.ift == 'create') {
                        if (item.createInputFields) {
                            let len = item.createInputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.createInputFields[m];
                                if (_f.id == inputField.id) {
                                    Object.assign(state.api.apiLego[i].createInputFields[m], inputField);
                                }
                            }
                        }
                    } else if (inputField.ift == 'update') {
                        if (item.updateInputFields) {
                            let len = item.updateInputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.updateInputFields[m];
                                if (_f.id == inputField.id) {
                                    Object.assign(state.api.apiLego[i].updateInputFields[m], inputField);
                                }
                            }
                        }

                    } else if(inputField.ift == 'cache'){
                        //在没有响应式的时候，添加响应式
                        if (item.cacheInputFields) {
                            let len = item.cacheInputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.cacheInputFields[m];
                                if (_f.id == inputField.id) {
                                    Object.assign(state.api.apiLego[i].cacheInputFields[m], inputField);
                                }
                            }
                        }
                    } else {
                        //在没有响应式的时候，添加响应式
                        if (item.commonInputFields) {
                            let len = item.commonInputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.commonInputFields[m];
                                if (_f.id == inputField.id) {
                                    Object.assign(state.api.apiLego[i].commonInputFields[m], inputField);
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    },

    //更新output字段
    [types.UPDATE_APILEGO_OUTPUTFIELD] (state, data) {
        var legos = state.api.apiLego;
        for (let i = 0; i < legos.length; i++) {
            var item = legos[i];
            if (item.id == data.apiLegoId) {
                for (let j = 0; j < data.outputFields.length; j++) {
                    let outputField = data.outputFields[j];
                    if (outputField.oft == 'read') {
                        if (item.readOutputFields) {
                            let len = item.readOutputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.readOutputFields[m];
                                if (_f.id == outputField.id) {
                                    Object.assign(state.api.apiLego[i].readOutputFields[m], outputField);
                                }
                            }
                        }
                    } else if (outputField.oft == 'condition') {
                        if (item.conditionOutputFields) {
                            let len = item.conditionOutputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.conditionOutputFields[m];
                                if (_f.id == outputField.id) {
                                    Object.assign(state.api.apiLego[i].conditionOutputFields[m], outputField);
                                }
                            }
                        }
                    } else if (outputField.oft == 'create') {
                        if (item.createOutputFields) {
                            let len = item.createOutputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.createOutputFields[m];
                                if (_f.id == outputField.id) {
                                    Object.assign(state.api.apiLego[i].createOutputFields[m], outputField);
                                }
                            }
                        }
                    } else if (outputField.oft == 'update') {
                        if (item.updateOutputFields) {
                            let len = item.updateOutputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.updateOutputFields[m];
                                if (_f.id == outputField.id) {
                                    Object.assign(state.api.apiLego[i].updateOutputFields[m], outputField);
                                }
                            }
                        }
                    } else if(outputField.oft == 'cache'){
                        //在没有响应式的时候，添加响应式
                        if (item.cacheOutputFields) {
                            let len = item.cacheOutputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.cacheOutputFields[m];
                                if (_f.id == outputField.id) {
                                    Object.assign(state.api.apiLego[i].cacheOutputFields[m], outputField);
                                }
                            }
                        }
                    } else {
                        //在没有响应式的时候，添加响应式
                        if (item.commonOutputFields) {
                            let len = item.commonOutputFields.length;
                            for (let m = 0; m < len; m++) {
                                let _f = item.commonOutputFields[m];
                                if (_f.id == outputField.id) {
                                    Object.assign(state.api.apiLego[i].commonOutputFields[m], outputField);
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    },

    [types.UPDATE_APILEGO] (state, data) {
        var legos = state.api.apiLego;
        for (let i = 0; i < legos.length; i++) {
            let item = legos[i];
            if (item.id == data.apiLegoId) {
                Vue.set(item, 'oiAlias', data.oiAlias)
                break;
            }
        }
    },
    [types.ADD_BATCH_INPUTFIELD] (state, dataMap) {
        let type = dataMap.type;
        let data = dataMap.list;
        let legos = state.api.apiLego;
        let currentapiLego = state.currentApiLego;
        for (let i = 0; i < legos.length; i++) {
            let item = legos[i];
            if (item.id == currentapiLego.id) {
                // item.[type] = [];
                //有新增的话就删除之前的初始化字段
                if (data && data.length > 0) {
                    for (let m = 0; m < item[type].length; m++) {
                        if (!item[type][m].fieldName) {
                            item[type].splice(m, 1);
                            break;
                        }
                    }
                }
                for (let j = 0; j < data.length; j++) {
                    let len = item[type].length;
                    item[type].splice(len + j + 1, 0, data[j]);
                }
                //     [{
                //     id: 2,
                //     name: '字段2',
                //     apiLegoId: item.id,
                //     fieldName: '测试字段2',
                //     ct: '',
                //     ift: '',
                //     fvt: '',
                //     fromApiLegoId: '',
                //     alias: '',
                //     attributes: '',
                //     validate: '',
                //     connectorPath: '',
                //     dt: ''
                // }]
                break;
            }
        }
    },
    [types.ADD_BATCH_OUTPUTFIELD] (state, dataMap) {
        let type = dataMap.type;
        let data = dataMap.list;
        let legos = state.api.apiLego;
        let currentapiLego = state.currentApiLego;
        for (let i = 0; i < legos.length; i++) {
            let item = legos[i];
            if (item.id == currentapiLego.id) {
                // item.[type] = [];
                //有新增的话就删除之前的初始化字段
                if (data && data.length > 0) {
                    for (let m = 0; m < item[type].length; m++) {
                        if (!item[type][m].fieldName) {
                            item[type].splice(m, 1);
                            break;
                        }
                    }
                }
                for (let j = 0; j < data.length; j++) {
                    let len = item[type].length;
                    item[type].splice(len + j + 1, 0, data[j]);
                }
                break;
            }
        }
    },
    [types.DELETE_INPUTOUTFIELD] (state, dataMap) {
        const type = dataMap.type;
        const id = dataMap.id;
        const apiLegoId = dataMap.apiLegoId;
        let legos = state.api.apiLego;
        for (let i = 0; i < legos.length; i++) {
            let item = legos[i];
            if (item.id == apiLegoId) {
                //有新增的话就删除之前的初始化字段
                let fieldList = item[type];
                for (let k = 0; k < fieldList.length; k++) {
                    if (fieldList[k].id == id) {
                        fieldList.splice(k, 1);
                        break;
                    }
                }
                break;
            }
        }
    },
    [types.UPDATE_BATCH_API_LEGO_INDEX] (state, dataMap) {
        let apiLegos = state.api.apiLego;
        let newAl = [];
        debugger;
        for (let i in dataMap) {
            for (let j in apiLegos) {
                if (dataMap[i].id == apiLegos[j].id) {
                    apiLegos[j].index = dataMap[i].index;
                    newAl.push(apiLegos[j]);
                    break;
                }
            }
        }
        state.api.apiLego=newAl;
    }


};
