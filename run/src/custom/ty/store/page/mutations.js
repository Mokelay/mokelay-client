import * as types from './../mutation-types';
import Vue from 'vue';


export default {
    [types.GET_PAGE](state, data) {
        Object.assign(state.pageKeys, data);
    },
    [types.ADD_PAGE](state, data) {
        state.pageKeys = {
            name: '',
            alias: '',
            description: '',
            layout: [],
            layoutType: '',
            createDate: ''
        };
        Object.assign(state.pageKeys, data);
    },
    [types.GET_LIST_BB](state, data) {
        const newArr = [];
        data.data.data_list.list.forEach(list => {
            newArr.push(list);
        });
        state.bbList.data = newArr;
    },
    [types.ADD_PBB](state, data) {
        //state.pbbList.data.push(data);
    },
    [types.DELATE_PBB](state, data) {
        //console.log('data_add:', data);
        //state.pbbList.data = data;
        //console.log('state.pbbList.data:', state.pbbList.data);
    },
    [types.GET_BB_INFO](state, data) {
        //console.log('data_add:', data);
        //state.pbbList.data = data;
        //console.log('state.pbbList.data:', state.pbbList.data);
    },
    [types.GET_BB_CHILD_INFO](state, data) {
        //console.log('data_add:', data);
        //state.pbbList.data = data;
        //console.log('state.pbbList.data:', state.pbbList.data);
    },
    [types.ADD_BATCH_PBBA](state, data) {
        //console.log('data_add:', data);
        //state.pbbList.data = data;
        //console.log('state.pbbList.data:', state.pbbList.data);
    },
    [types.GET_ATTR_BY_PBBID](state, data) {
        //state.pbbList.data = data;
    },
    [types.UPDATE_PAGE_LAYOUT](state, data) {
        //console.log('data_add:', data);
        //state.pbbList.data = data;
        //sconsole.log('state.pbbList.data:', state.pbbList.data);
    }
};
