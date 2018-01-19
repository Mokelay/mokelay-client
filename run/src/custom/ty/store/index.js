import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

import apiMutations from './api/mutations'
import apiActions from './api/actions'

import pageMutations from './page/mutations'
import pageActions from './page/actions'


Vue.use(Vuex);

const state = {}

const apiState = {
    currentApiLego: {
        id: '',
        apiAlias: '',
        legoAlias: '',
        oiAlias: '',
        index: '',
        attributes: ''
    },
    api: {
        id: '',
        enable: '',
        name: '',
        alias: '',
        apiLego: []
    },//添加api时的对象
    inputFieldSelectList: []//添加字段时的选择列表
};
const apiModule = {
    state: apiState,
    mutations: apiMutations,
    actions: apiActions
};


const pageState = {
    pageKeys: {
        name: '',
        alias: '',
        description: '',
        layout:[],
        layoutType:''
    },
    bbList: {
        data:[]
    },
    pbbList: {
        data:[]
    },
    global: {},
};
const pageModule = {
    state: pageState,
    mutations: pageMutations,
    actions: pageActions
}


export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
        api: apiModule,
        page: pageModule
    }
})

