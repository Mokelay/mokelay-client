import * as types from './../mutation-types';

export default {
    getPage({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/read-page", {
                    alias: params.alias,
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.GET_PAGE, data.data.data);
                        resolve(data.data.data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        addPage({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/add-page", {
                    name: params.name,
                    alias: params.alias,
                    template: params.template,
                    custom: params.custom,
                    customFile: params.customFile,
                    templatePageAlias: params.templatePageAlias,
                    description: params.description
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.ADD_PAGE, params);
                        resolve(params);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        getListBB({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/list-bb", {
                    type: !!params ? params.type : ''
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.GET_LIST_BB, data);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        addPbb({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/add_pbb", {
                    pageAlias: params.pageAlias,
                    buildingBlockAlias: params.buildingBlockAlias
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        params.unique_value = data.data.unique_value;
                        //更新pageKeys数据
                        commit(types.ADD_PBB, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        delatePbb({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/delete-pbb", {
                    id: params.id
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.DELATE_PBB, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        getBBinfo({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/list-bb-info", {
                    buildingBlockAlias: params.buildingBlockAlias
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.GET_BB_INFO, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        getBBChildinfo({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/list-adByBBAliasAndParentId", {
                    bbAlias: params.bbAlias,
                    parentId: params.parentId,
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.GET_BB_CHILD_INFO, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        addBatchPbba({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/add-batch-pbba", {
                    list_Param: params.list_Param
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.ADD_BATCH_PBBA, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        getAttrByPbbId({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/list-atByPbbId", {
                    pbbId: params.pbbId
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.GET_ATTR_BY_PBBID, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        updatePageLayout({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.post(_TY_ContentPath + "/update-page-layout", {
                    name: params.name,
                    alias: params.alias,
                    description: params.description,
                    layout: JSON.stringify(params.layout),
                    layoutType: params.layoutType
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        commit(types.UPDATE_PAGE_LAYOUT, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        getInteractivesLsit({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/update-page-layout", {
                    pbbId: params.pbbId
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        //commit(types.UPDATE_PAGE_LAYOUT, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        addInteractive({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/update-page-layout", {
                    pbbId: params.pbbId
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        //commit(types.UPDATE_PAGE_LAYOUT, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        deleteInteractive({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/update-page-layout", {
                    pbbId: params.pbbId
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        //commit(types.UPDATE_PAGE_LAYOUT, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        getMdByPbbId({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/list-md-by-pbb-id", {
                    pbbId: params.pbbId
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        //commit(types.UPDATE_PAGE_LAYOUT, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
        getEdByPbbId({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                _TY_Tool.get(_TY_ContentPath + "/list-ed-by-pbb-id", {
                    pbbId: params.pbbId
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        //commit(types.UPDATE_PAGE_LAYOUT, params);
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });
        },
};