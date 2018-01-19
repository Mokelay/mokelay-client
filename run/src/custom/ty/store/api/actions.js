import * as types from './../mutation-types';

export default {

    addAndUpdateApi({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                let url = _TY_ContentPath + '/add-api';
                if (params.id) {
                    url = _TY_ContentPath + '/update-api';
                }
                _TY_Tool.post(url, {
                    id: params.id || '',
                    alias: params.alias,
                    name: params.name,
                    method: params.method,
                    description: params.description,
                    type: params.type,
                    category: params.category,
                    url: params.url,
                    authType: params.authType,
                    enable: params.enable
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        if (data.data && data.data.unique_value) {
                            params.id = data.data.unique_value;
                        }
                        commit(types.ADD_API, params);
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });
            });
        },

        deleteApi({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/delete-api", {
                    alias: params.alias,
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //清除state api数据
                        commit(types.CLEAR_STATE_API_CACHE, params);
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });
            });
        },

        getApiInfo({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/read-api-info", {
                    alias: params.alias,
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok && data.data) {
                        commit(types.GET_API_INFO, data);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },

        addApiLego({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/add-apiLego", {
                    apiAlias: params.apiAlias,
                    legoAlias: params.legoAlias,
                    index: params.index
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        params.id = data.data.unique_value;
                        commit(types.ADD_APILEGO, params);

                        _TY_Tool.post(_TY_ContentPath + "/list-fieldsDescribeByLego", {
                            legoAlias: params.legoAlias,
                        }).then(function(subResponse) {
                            let subData = subResponse.data;
                            if (subData.ok && subData.data) {
                                let ifd = subData['data']['ifd_list']['list'];
                                let ofd = subData['data']['ofd_list']['list'];
                                let inputFields = [];
                                let outputFields = [];
                                let saveInputFields = [];
                                let saveOutputFields = [];
                                let ifHasCommon = false; //所有的lego都有常用字段组
                                let ofHasCommon = false;
                                if (ifd) {
                                    for (let i = 0; i < ifd.length; i++) {
                                        const item = ifd[i];
                                        if (item.ift == 'common') {
                                            ifHasCommon = true;
                                        }
                                        let tmp = {
                                            name: item.name || '',
                                            fieldName: (item.multiple ? '' : item.fieldName), //这个字段很关键
                                            alias: item.fieldName || '',
                                            // fvt: '',
                                            ift: item.ift || 'common',
                                            apiLegoId: params.id,
                                            inputFieldDescribeId: item.id,
                                            fromApiLegoId: 0,
                                            requestParamName: item.fieldName || ''
                                        };
                                        inputFields.push(tmp);
                                        if (!item.multiple) {
                                            saveInputFields.push(tmp);
                                        }
                                    }
                                }
                                if (ofd) {
                                    for (let i = 0; i < ofd.length; i++) {
                                        const item = ofd[i];
                                        if (item.oft == 'common') {
                                            ofHasCommon = true;
                                        }
                                        let tmp = {
                                            name: item.name || '',
                                            fieldName: (item.multiple ? '' : item.fieldName),
                                            alias: item.fieldName || '',
                                            fvt: '',
                                            oft: item.oft || 'common',
                                            apiLegoId: params.id,
                                            outputFieldDescribeId: item.id,
                                            response: false
                                        };
                                        outputFields.push(tmp);
                                        if (!item.multiple) {
                                            saveOutputFields.push(tmp);
                                        }
                                    }
                                }
                                if (saveInputFields && saveInputFields.length > 0) {
                                    _TY_Tool.post(_TY_ContentPath + "/add-batch-inputfield", {
                                        list_Param: JSON.stringify(saveInputFields),
                                    }).then(function(response) {
                                        let data = response.data;
                                        if (data.ok) {
                                            //先存到数据库
                                            let idList = data['data']['list_unique_value'];
                                            let k = 0;
                                            for (let m = 0; m < inputFields.length; m++) {
                                                if (!inputFields[m].fieldName) {
                                                    k++;
                                                    continue;
                                                }
                                                inputFields[m].id = idList[m - k];
                                            }
                                            if (!ifHasCommon) {
                                                inputFields.push({
                                                    name: '',
                                                    fieldName: '',
                                                    alias: '',
                                                    ift: 'common',
                                                    apiLegoId: params.id,
                                                    inputFieldDescribeId: '',
                                                    fromApiLegoId: '',
                                                    requestParamName: ''
                                                });
                                            }
                                            commit(types.ADD_APILEGO_INPUTFIELD, {
                                                apiLegoId: params.id,
                                                inputFields: inputFields
                                            });
                                        } else {
                                            reject(data);
                                        }
                                    });
                                } else {
                                    if (!ifHasCommon) {
                                        inputFields.push({
                                            name: '',
                                            fieldName: '',
                                            alias: '',
                                            ift: 'common',
                                            apiLegoId: params.id,
                                            inputFieldDescribeId: '',
                                            fromApiLegoId: '',
                                            requestParamName: ''
                                        });
                                    }
                                    commit(types.ADD_APILEGO_INPUTFIELD, {
                                        apiLegoId: params.id,
                                        inputFields: inputFields
                                    });
                                }
                                if (saveOutputFields && saveOutputFields.length > 0) {
                                    _TY_Tool.post(_TY_ContentPath + "/add-batch-outputfield", {
                                        list_Param: JSON.stringify(saveOutputFields),
                                    }).then(function(response) {
                                        let data = response.data;
                                        if (data.ok) {
                                            //先存到数据库
                                            let idList = data['data']['list_unique_value'];
                                            let k = 0;
                                            for (let m = 0; m < outputFields.length; m++) {
                                                if (!outputFields[m].fieldName) {
                                                    k++;
                                                    continue;
                                                }
                                                outputFields[m].id = idList[m - k];
                                            }
                                            if (!ofHasCommon) {
                                                outputFields.push({
                                                    name: '',
                                                    fieldName: '',
                                                    alias: '',
                                                    fvt: '',
                                                    oft: 'common',
                                                    apiLegoId: params.id,
                                                    outputFieldDescribeId: '',
                                                    response: ''
                                                });
                                            }
                                            commit(types.ADD_APILEGO_OUTPUTFIELD, {
                                                apiLegoId: params.id,
                                                outputFields: outputFields
                                            });
                                        } else {
                                            reject(data);
                                        }
                                    });
                                } else {
                                    if (!ofHasCommon) {
                                        outputFields.push({
                                            name: '',
                                            fieldName: '',
                                            alias: '',
                                            fvt: '',
                                            oft: 'common',
                                            apiLegoId: params.id,
                                            outputFieldDescribeId: '',
                                            response: ''
                                        });
                                    }
                                    commit(types.ADD_APILEGO_OUTPUTFIELD, {
                                        apiLegoId: params.id,
                                        outputFields: outputFields
                                    });
                                }
                            } else {
                                reject(subData);
                            }
                        });
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });

            });
        },
        updateApiLego({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/update-apiLego", {
                    id: params.apiLegoId,
                    oiAlias: params.oiAlias
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        commit(types.UPDATE_APILEGO, params);
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        deleteApiLego({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/delete-apilego", {
                    apiLegoId: params.apiLegoId,
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        commit(types.DELETE_APILEGO, params);
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        addBatchInputField({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/add-batch-inputfield", {
                    list_Param: JSON.stringify(params.list),
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        let idList = data['data']['list_unique_value'];
                        for (let m = 0; m < idList.length; m++) {
                            params.list[m].id = idList[m];
                        }
                        commit(types.ADD_BATCH_INPUTFIELD, params)
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        addBatchOutputField({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/add-batch-outputfield", {
                    list_Param: JSON.stringify(params.list),
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        let idList = data['data']['list_unique_value'];
                        for (let m = 0; m < idList.length; m++) {
                            params.list[m].id = idList[m];
                        }
                        commit(types.ADD_BATCH_OUTPUTFIELD, params)
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        saveAndUpdateInputField({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                if (params.data.id) {
                    _TY_Tool.post(_TY_ContentPath + "/update-inputfield", params.data).then(function(response) {
                        let data = response.data;
                        if (data.ok) {
                            commit(types.UPDATE_APILEGO_INPUTFIELD, {
                                apiLegoId: params.apiLegoId,
                                inputFields: [params.data]
                            });
                            resolve(params);
                        } else {
                            reject(data);
                        }
                    });
                } else {
                    _TY_Tool.post(_TY_ContentPath + "/add-inputfield", params.data).then(function(response) {
                        let data = response.data;
                        if (data.ok) {
                            params.data.id = data.data.unique_value;
                            commit(types.ADD_APILEGO_INPUTFIELD, {
                                apiLegoId: params.apiLegoId,
                                inputFields: [params.data]
                            });
                            resolve(params);
                        } else {
                            reject(data);
                        }
                    });
                }
            });
        },
        saveAndUpdateOutputField({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                if (params.data.id) {
                    _TY_Tool.post(_TY_ContentPath + "/update-outputfield", params.data).then(function(response) {
                        let data = response.data;
                        if (data.ok) {
                            commit(types.UPDATE_APILEGO_OUTPUTFIELD, {
                                apiLegoId: params.apiLegoId,
                                outputFields: [params.data]
                            });
                            resolve(params);
                        } else {
                            reject(data);
                        }
                    });
                } else {
                    _TY_Tool.post(_TY_ContentPath + "/add-outputfield", params.data).then(function(response) {
                        let data = response.data;
                        if (data.ok) {
                            params.data.id = data.data.unique_value;
                            commit(types.ADD_APILEGO_OUTPUTFIELD, {
                                apiLegoId: params.apiLegoId,
                                outputFields: [params.data]
                            });
                            resolve(params);
                        } else {
                            reject(data);
                        }
                    });
                }
            });
        },
        getApiLegoInputFieldByApiLegoId({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/list-inputFieldsByApiLegoId", {
                    apiLegoId: params.apiLegoId,
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        let list = data['data']['data_list']['list'];
                        if (list && list.length > 0) {
                            let result = [];
                            for (let i = 0; i < list.length; i++) {
                                let input = list[i];
                                result.push(input);
                            }
                            commit(types.ADD_APILEGO_INPUTFIELD, {
                                apiLegoId: params.apiLegoId,
                                inputFields: result
                            });
                        }
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        getApiLegoOutputFieldByApiLegoId({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/list-outputFieldsByApiLegoId", {
                    apiLegoId: params.apiLegoId,
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        let list = data['data']['data_list']['list'];
                        if (list && list.length > 0) {
                            let result = [];
                            for (let i = 0; i < list.length; i++) {
                                let input = list[i];
                                result.push(input);
                            }
                            commit(types.ADD_APILEGO_OUTPUTFIELD, {
                                apiLegoId: params.apiLegoId,
                                outputFields: result
                            });
                        }
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        //只使用了多选字段组
        getLegoFieldDescription({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/list-fieldsDescribeByLego", {
                    legoAlias: params.legoAlias,
                }).then(function(subResponse) {
                    let subData = subResponse.data;
                    if (subData.ok && subData.data) {
                        let ifd = subData['data']['ifd_list']['list'];
                        let ofd = subData['data']['ofd_list']['list'];
                        let inputFields = [];
                        let outputFields = [];
                        let ifHasCommon = false;
                        let ofHasCommon = false;
                        if (ifd) {
                            for (let i = 0; i < ifd.length; i++) {
                                const item = ifd[i];
                                if (item.ift == 'common') {
                                    ifHasCommon = true;
                                }
                                if (item.multiple) {
                                    let tmp = {
                                        name: item.name || '',
                                        fieldName: '',
                                        alias: '',
                                        // fvt: '',
                                        ift: item.ift || '',
                                        apiLegoId: params.apiLegoId,
                                        inputFieldDescribeId: item.id,
                                        fromApiLegoId: 0,
                                        requestParamName: ''
                                    };
                                    inputFields.push(tmp);
                                }
                            }
                        }
                        if (ofd) {
                            for (let i = 0; i < ofd.length; i++) {
                                const item = ofd[i];
                                if (item.oft == 'ommon') {
                                    ofHasCommon = true;
                                }
                                if (item.multiple) {
                                    let tmp = {
                                        name: item.name || '',
                                        fieldName: '',
                                        alias: '',
                                        fvt: '',
                                        oft: item.oft || '',
                                        apiLegoId: params.apiLegoId,
                                        outputFieldDescribeId: item.id,
                                        response: false
                                    };
                                    outputFields.push(tmp);
                                }
                            }
                        }
                        if (!ifHasCommon) {
                            inputFields.push({
                                name: '',
                                fieldName: '',
                                alias: '',
                                // fvt: '',
                                ift: 'common',
                                apiLegoId: params.apiLegoId,
                                inputFieldDescribeId: '',
                                fromApiLegoId: 0,
                                requestParamName: ''
                            });
                        }
                        if (!ofHasCommon) {
                            outputFields.push({
                                name: '',
                                fieldName: '',
                                alias: '',
                                fvt: '',
                                oft: 'common',
                                apiLegoId: params.apiLegoId,
                                outputFieldDescribeId: '',
                                response: ''
                            });
                        }
                        if (inputFields && inputFields.length > 0) {
                            commit(types.ADD_APILEGO_INPUTFIELD, {
                                apiLegoId: params.apiLegoId,
                                inputFields: inputFields
                            });
                        }
                        if (outputFields && outputFields.length > 0) {
                            commit(types.ADD_APILEGO_OUTPUTFIELD, {
                                apiLegoId: params.apiLegoId,
                                outputFields: outputFields
                            });
                        }
                    } else {
                        reject(subData);
                    }
                });
            });
        },
        updateBatchApiLegoIndex({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/update-batch-api-lego-index", {
                    list_Param: JSON.stringify(params)
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        commit(types.UPDATE_BATCH_API_LEGO_INDEX, params);
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });
            });
        }


};