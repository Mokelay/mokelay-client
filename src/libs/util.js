import axios from 'axios';
import _ from 'underscore';
import Qs from 'qs';

let util = {};


//清除loading
var _clearLoading = function() {
    _TY_Root.$toast({
        type: "loading",
        duration: 1
    })
}

util.invoke = function(options) {
    return new Promise((resolve, reject) => {
        if (!util.ajax) {
            util.ajax = axios.create({
                baseURL: window._TY_APIHost,
                timeout: 30000,
                withCredentials: true
            });
        }
        util.ajax(options).then(function(response) {
            if (response && response['data'] && response['data']['code'] && response['data']['code'] == -420 && util.isWX()) {
                //微信端没有登录，跳转微信授权
                _clearLoading();
                location.href = response['data']['message'] || window._TY_SSOURL;
            } else if (response && response['data'] && response['data']['code'] && response['data']['code'] <= -400) {
                if(window._TY_BB_Edit){
                    window._TY_Toast({content:"提示：该页面需要有登陆态情况下才会展示正确数据"});
                    return;
                }
                //所有Code小于等于-400都是属于没有登录授权的，统一走SSOURL配置路径
                if (response['data']['code'] == -401) {
                    _clearLoading();
                    location.href = window._RS_SSOURL;
                } else {
                    if (location.href.indexOf("?redirect") < 0) {
                        _clearLoading();
                        location.href = window._TY_SSOURL + "?redirect=" + encodeURIComponent(location.href);
                    }
                }
            } else {
                resolve(response);
            }
            // if (response && response['data'] && response['data']['code'] && response['data']['code'] == -420 && util.isWX()) {
            //     //微信端没有登录，跳转微信授权
            //     location.href = response['data']['message'] || window._TY_SSOURL;
            // } else if (response && response['data'] && response['data']['code'] && response['data']['code'] == -401) {
            //     //龙眼专用 未登录
            //     location.href = window._TY_SSOURL;
            // } else if (response && response['data'] && response['data']['code'] && response['data']['code'] == -400) {
            //     //TY E端未登录
            //     location.href = document.location.protocol + "//" + document.location.host + "/#/ty-login";
            // } else if (response && response['data'] && response['data']['code'] && response['data']['code'] == -410) {
            //     //TY B端未登录
            //     location.href = document.location.protocol + "//" + document.location.host + "/#/ty_b_login";
            // } else {
            //     resolve(response);
            // }
        }).catch(function(error) {
            reject(error);
        });
    });
}

//为了能请求第三方或自定义额接口，保证图片上传到第三方文件服务器，这里不设置baseURL
util.post = function(url, param, options) {
    return util.invoke(_.extend({
        url: url,
        method: 'post',
        data: Qs.stringify(param),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, options));
}

util.get = function(url, param, options) {
    return util.invoke(_.extend({
        url: url,
        method: 'get',
        params: param
    }, options));
}

//深拷贝  对象/数组
util.deepClone = function(obj) {
    let cloneObj;
    if (!_.isObject(obj) || typeof obj === 'function') {
        return obj;
    }
    cloneObj = _.isArray(obj) ? [] : {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (!_.isObject(obj[i])) {
                // obj[i]为null和undefined都会进入这里
                cloneObj[i] = obj[i];
            } else {
                cloneObj[i] = util.deepClone(obj[i]);
            }
        }
    }
    return cloneObj;
}

util._resovleTpl = function(str, data) {
    try {
        return _.template(str)(data);
    } catch (e) {
        return "";
    }
}

util._tpl = function(tpl, data) {
    if (typeof tpl === 'string') {
        //字符串
        return util._resovleTpl(tpl, data);
    } else if (_.isArray(tpl)) {
        //数组
        for (let i = 0; i < tpl.length; i++) {
            let newObj = util._tpl(tpl[i], data);
            if (typeof newObj === 'object') {
                tpl[i] = newObj;
            }
        }
    } else if (_.isObject(tpl)) {
        //对象 js 对象和数组 都是object类型，不过上面已经过滤掉array了
        for (let o in tpl) {
            if (tpl.hasOwnProperty(o)) {
                let val = util._tpl(tpl[o], data);
                if (typeof val === 'string') {
                    //除string类型外，其他类型不需要返回
                    tpl[o] = val;
                }
            }
        }
    }
    return tpl;
};
/**
 * 模板解析工具  支持对象，数组，字符串
 * @param tpl
 * @param data
 */
util.tpl = function(tpl, data) {
    let result = tpl;
    if (typeof tpl === 'object') {
        //对象或者数组,为保证不改变请求参数值，先深拷贝
        result = util.deepClone(tpl);
    }
    //深拷贝对象 模板解析
    return util._tpl(result, data);
}

util.uuid = function(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];
    var i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
};

util.uuidTimestamp = function(len, radix) {
    return util.uuid(len, radix) + +new Date();
}

/**
 *  组装模板或者getDsData方法的参数
 */
util.buildTplParams = function(t, obj) {
    return _.extend({
        "bb": t,
        "router": t.$route.params,
        "route": t.$route,
        "external": t.external,
        "local": window.localStorage,
        "session": window.sessionStorage
    }, (obj ? obj : {}));
};

//获取DS
/**
DS配置案例
{
    type:"dynamic", //dynamic,static ，ds表示是后端动态数据，static表示静态数据

    //以下为type=static属性
    data:null, //静态数据，可以为任意数据类型

    //以下为type=dynamic的属性
    host:"", //如果为空，默认是window._TY_APIHost
    api:"/list-data",
    category:'config',//ds选择器 不是type字段而是category字段
    method:"post",
    inputs:[
        {paramName:'a',valueType:"constant",constant:123},
        {paramName:'a',valueType:"constant",variable:123},
        {paramName:'b',valueType:"inputValueObj",valueKey:"bb",variable:"pageSize"},
        {paramName:'c',valueType:"inputValueObj",valueKey:"router",variable:"page"},
        {paramName:'d',valueType:"inputValueObj",valueKey:"row-data",variable:"alias"},
        //TY2.0统一走tempalte
        {paramName:'e',valueType:"template",variable:"<%=route.query.param%>},
        {paramName:'a2',valueType:"template",variable:123},
    ],
    outputs:[
        {dataKey:"tableData",valueKey:"data-list-1"},
        {dataKey:"obj",valueKey:"data-obj-1",handle:"${buzzCode}"}
    ]
}

 type 是指接口的类型，目前分为配置接口config和自定义接口custom

bb-list中的table data获取数据的调用方式 , util.getDSData(ds, {"bb":this ,"router":this.$router.param} , function(){} );

bb-list中的button group中execute-ds的按钮调用方法，util.getDSData(ds, {"bb":this ,"router":this.$router.param , "row-data":row} , function(){} );
**/
util.getDSData = function(ds, inputValueObj, success, error) {
    const toast1 = inputValueObj.bb.$toast({
        type: 'loading',
        duration: 10000
    });
    var type = ds['type'] || "dynamic";
    if (type == "static") {
        toast1.clear();
        success(ds['data']);
        return;
    }

    var api = ds['api'];
    var host = window._TY_HOSTS[ds['host'] || ""] || window._TY_APIHost;
    var type = ds['category'] || 'config'; //默认是配置接口
    if (!api) {
        error(500, "请求参数无效");
        toast1.clear();
        return;
    }
    var method = ds['method'] || 'post';
    var requestParam = {};
    var inputs = ds['inputs'] || [];
    var outputs_default = ds['outputs'] || [];
    if (inputs && inputs.length > 0) {
        inputs.forEach(function(input) {
            //TY2.0默认全部走template
            var valueType = input['valueType'] || 'template';
            var paramValue = null;
            if (valueType == 'constant') {
                paramValue = input['constant'] == undefined ? input['variable'] : input['constant'];
            } else if (valueType == 'template') { //支持参数为自定义模板
                paramValue = util.tpl(input['variable'], Object.assign(util.buildTplParams(inputValueObj['bb'], inputValueObj[input['valueKey']]), inputValueObj));
            } else if (valueType == 'inputValueObj') {
                var _inputData = inputValueObj[input['valueKey']];
                if (_inputData && typeof input['variable'] == 'string') {
                    var paramArr = input['variable'].split('.');
                    if (paramArr.length > 1) { //支持参数形式 a.b[1].c.d[0][0].e
                        var paramValueStr = '_inputData' + '.' + input['variable'];
                        try {
                            paramValue = eval("(" + paramValueStr + ")");
                        } catch (error) {
                            console.log('DS上传参数配置有误:', error);
                        }
                    } else {
                        paramValue = _inputData[input['variable']];
                    }
                }
            }
            //格式化参数
            paramValue = typeof paramValue == "object" ? (paramValue == null ? "" : JSON.stringify(paramValue)) : paramValue;
            requestParam[input['paramName']] = paramValue;
        });
    }
    //老数据的custom接口地址存在api中，TY2.0的custom接口存在url中
    var apiUrl = ds['url'] || api;
    if (type == 'config') {
        //如果不是自定义接口
        apiUrl = window._TY_ContentPath + "/" + api;
    }
    //统一转换成小写
    method = method.toLowerCase();
    //设置请求参数
    var options = {
        baseURL: util.tpl(host, Object.assign(util.buildTplParams(inputValueObj['bb'], inputValueObj)))
    }
    util[method](apiUrl, requestParam, options).then(function(response) {
        toast1.clear();
        var data = response['data'];
        if (data['ok']) {
            var realDataMap = data['data'] || {};
            var outputs = _TY_Tool.deepClone(outputs_default);
            new Promise(function(resolve, reject) {
                const promiseArr = [];
                outputs.forEach(function(output) {
                    if (!output['valueKey'] && !output['handle']) {
                        //没有valueKey 并且也没有handle 直接返回data对象
                        output['value'] = realDataMap;
                        return true;
                    }
                    var _outputValue = null;
                    var paramArr = output['valueKey'].split('.');
                    if (paramArr.length > 1) { //支持参数形式  a.b[1].c.d[0][0].e
                        var paramValueStr = "realDataMap" + '.' + output['valueKey'];
                        try {
                            _outputValue = eval("(" + paramValueStr + ")");
                        } catch (error) {
                            console.log('DS取值参数配置有误:', error);
                        }
                    } else {
                        _outputValue = realDataMap[output['valueKey']];
                    }
                    if (output['handle']) {
                        //加载handle对应的buzz函数，进行执行，异步操作统一通过Promise处理
                        const item = new Promise((resolve, reject) => {
                            util.loadBuzz(output['handle'], function(code) {
                                output['value'] = eval(code);
                                resolve();
                            });
                        });
                        promiseArr.push(item);
                    } else {
                        output['value'] = _outputValue;
                    }
                });
                //等待forEach中的异步全部执行完
                Promise.all(promiseArr).then(values => {
                    resolve(outputs);
                });
            }).then((outputs) => {
                success(outputs)
            });
        } else {
            error(data['code'], data['message']);
        }
    }, function() {
        toast1.clear();
    }).catch(function(err) {
        toast1.clear();
        error(err);
    });
}

/**
 *按钮解析公共方法 
    @button:当前点击的按钮配置
    {
        action:'url 地址跳转|| execute-ds执行接口 || dialog-page弹窗 || code自定义代码 || buzz 巴斯代码',
        url:''跳转地址 action:'url’时有效
        urlType:'openWindow 在新标签中打开 
        ds:{} //按钮请求的接口配置 action:'execute-ds’时有效
        confirmTitle:'', //请求接口前的提示语标题   action:'execute-ds’时有效
        confirmText:'', //请求接口前的提示语内容   action:'execute-ds’时有效
        callBackStaticWords:'' //请求接口成功提示语
        dialogPage:'pageAlias',//弹窗中的页面名称   action:'dialog-page’时有效
        method:fn , //需要执行的方法 action:'code’时有效
        buzz:'buzzName', //巴斯方法名称  action:'buzz’时有效
        noConfirm:true //是否去除确认框
    }
    @valueobj :参数来源 t, bb, row-data ,route
*/
util.resolveButton = function(button, valueobj) {
    var t = valueobj['bb'];
    return new Promise((resolve, reject) => {
        if (button['action'] == 'url') {
            //URL跳转
            //为了兼容扩展dataparam的值的范围，注意URL参数的Encode
            var rowData = valueobj['row-data'] ? valueobj['row-data'] : {};
            var realObj = Object.assign({}, valueobj, rowData);
            var url = util.tpl(button['url'], _TY_Tool.buildTplParams(t, realObj));
            url = encodeURI(url);
            if (button['urlType'] == 'openWindow') {
                window.open(url);
            } else {
                if (url.indexOf("http") == 0) {
                    document.location.href = url;
                } else {
                    t.$router.push(url);
                }
            }
            resolve();
            //触发按钮执行完成事件
            t.$emit("button-finish", button, valueobj);
        } else if (button['action'] == 'execute-ds') {
            var ds = button['ds'];
            var valueKey = button.valueKey || 'row-data';
            var confirmTitle = button['confirmTitle'] ? util.tpl(button['confirmTitle'], _TY_Tool.buildTplParams(t, valueobj[valueKey])) : "提示";
            var confirmText = button['confirmText'] ? util.tpl(button['confirmText'], _TY_Tool.buildTplParams(t, valueobj[valueKey])) : "是否执行此操作";
            button['callBackStaticWords'] = button['callBackStaticWords'] ? button['callBackStaticWords'] : ''
            var messageInfo = button['callBackStaticWords'] ? util.tpl(button['callBackStaticWords'], _TY_Tool.buildTplParams(t, valueobj[valueKey])) : "操作成功";
            if (util.isPC()) {
                var postFun = function() {
                    util.getDSData(ds, valueobj, function(map) {
                        //TODO
                        t.$message({
                            type: 'success',
                            message: messageInfo
                        });
                        resolve();
                        // util.buttonCallback(button, valueobj, callback, map);
                        //触发按钮执行完成事件
                        t.$emit("button-finish", button, valueobj, map);
                        t.$emit("button-finish-success", button, valueobj, map);
                    }, function(err, msg) {
                        t.$message({
                            type: 'warning',
                            message: msg || messageInfo
                        });
                        reject();
                        // util.buttonCallback(button, valueobj, callback, err);
                        //触发按钮执行完成事件
                        t.$emit("button-finish", button, valueobj, err);
                        t.$emit("button-finish-error", button, valueobj, err);
                    });
                }
                if (button['noConfirm']) {
                    postFun();
                } else {
                    t.$confirm(confirmText, confirmTitle, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        postFun();
                    }).catch(() => {
                        t.$message({
                            type: 'info',
                            message: '操作未完成'
                        });
                        reject();
                    });
                }
            } else {
                var postFun = function() {
                    util.getDSData(ds, valueobj, function(map) {
                        //TODO
                        _TY_Toast({
                            content: messageInfo
                        });
                        resolve();
                        // util.buttonCallback(button, valueobj, callback, map);
                        //触发按钮执行完成事件
                        t.$emit("button-finish", button, valueobj, map);
                        t.$emit("button-finish-success", button, valueobj, map);
                    }, function(err, msg) {
                        _TY_Toast({
                            content: msg || messageInfo
                        });
                        reject();
                        // util.buttonCallback(button, valueobj, callback, err);
                        //触发按钮执行完成事件
                        t.$emit("button-finish", button, valueobj, err);
                        t.$emit("button-finish-error", button, valueobj, err);
                    });
                }
                if (button['noConfirm']) {
                    postFun();
                } else {
                    _TY_Modal({
                        title: confirmTitle,
                        message: confirmText,
                        btns: [{
                            text: '取消',
                            $action: (modal) => {
                                modal.doclose();
                                reject();
                            }
                        }, {
                            text: '确认',
                            $action: (modal) => {
                                postFun();
                                modal.doclose();
                            }
                        }]
                    });
                }
            }
        } else if (button['action'] == 'dialog-page') {
            //TODO 弹出一个页面对话框
            require.ensure(["art-dialog"], function(require) {
                t.dialogKey = _TY_Tool.uuid();
                var Vue = valueobj['bb'].vue;
                var _page = new Vue({
                    router: t.$router,
                    render: function(createElement) {
                        const pageItem = createElement('bb-page', {
                            props: {
                                pageAlias: button['dialogPage'],
                                params: valueobj
                            },
                            on: {
                                'after-unload': (val) => {
                                    //触发按钮执行完成事件
                                    t.$emit("button-finish", button, valueobj);
                                    //关闭并销毁dialog
                                    t.dialog.close().remove();
                                    t.dialog = null;
                                }
                            }
                        }, []);
                        return createElement('div', {}, [pageItem])
                    }
                }).$mount();
                var dialog = require('art-dialog');
                var d = dialog({
                    width: 800,
                    zIndex: 100,
                    title: button.dialogTitle || '消息',
                    content: _page.$el,
                    onclose: function() {
                        if (t.dialog) {
                            t.dialog.close().remove();
                            t.dialog = null;
                        }
                        delete t.$refs[t.dialogKey];
                    }
                });
                d.showModal();
                t.dialog = d;
                //为了解决容器类积木  获取不到 弹窗中的子积木，方案待定
                t.$refs[t.dialogKey] = _page.$children[0]; //把bb-form 设置到$refs中
            }, 'art-dialog');
            resolve();
        } else if (button['action'] == 'code') {
            //执行代码
            button['method'].call(this, valueobj['row-data']);
            resolve();
            //触发按钮执行完成事件
            t.$emit("button-finish", button, valueobj);
        } else if (button['action'] == 'buzz') {
            //如果是巴斯代码，远程加载
            util.loadBuzz(button.buzz, function(code) {
                t.util = util;
                eval(code);
                resolve();
                //触发按钮执行完成事件
                t.$emit("button-finish", button, valueobj);
            });
        }
    });
}

//检查vue对象是否含有uuid,通过$children来找
let _checkVueHasRef = function(uuid, vueObj) {
    //判断vue对象是否是该uuid组件逻辑
    if (vueObj && vueObj.$vnode && vueObj.$vnode.data && vueObj.$vnode.data.ref && vueObj.$vnode.data.ref == uuid && vueObj._isVue) {
        if (vueObj.$root && vueObj.$root.$el.parentElement && vueObj.$root.$el.parentElement.style.display == 'none') {
            //针对 bb-tabs模板查询vue对象问题，只会去找到当前展示的那个content的vue对象
            return null;
        }
        return vueObj;
    }
    return null;
}

// let currentVueArray = [];
let currentVue = null; //解决findBBByUuid方法查询慢的问题
//深度遍历，可能会影响性能，后面考虑改成层级遍历   $refs和$children 一起查询
let _findChildBB = function(uuid, children) {
    console.log("findChildBB......");
    let resultVue = null;
    if (currentVue) {
        return currentVue;
    }
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            let vueItem = children[i];
            resultVue = _checkVueHasRef(uuid, vueItem);
            if (resultVue && resultVue != null) {
                return resultVue;
                // currentVueArray.push(resultVue);
            }
            if (vueItem.$children && vueItem.$children.length > 0) {
                //还有子 则继续遍历
                resultVue = _findChildBB(uuid, vueItem.$children);
                if (resultVue && resultVue != null) {
                    return resultVue;
                    // currentVueArray.push(resultVue);
                }
            }
            if (vueItem.$refs) {
                for (let j in vueItem.$refs) {
                    if (!vueItem.$refs[j]) {
                        continue;
                    }
                    if (uuid == j && vueItem.$refs[j]._isVue) {
                        //如果ref的key等于uuid，则表示该对象就是要找的uuid对象(通过ref方式查找；_checkVueHasRef是通过$children方式来查找)
                        let resultVue = _checkVueHasRef(uuid, vueItem.$refs[j]);
                        if (resultVue && resultVue != null) {
                            return resultVue;
                            // currentVueArray.push(resultVue);
                        }
                    }
                    if (vueItem.$refs[j].$children && vueItem.$refs[j].$children.length > 0) {
                        resultVue = _findChildBB(uuid, vueItem.$refs[j].$children);
                        if (resultVue && resultVue != null) {
                            return resultVue;
                            // currentVueArray.push(resultVue);
                        }
                    }
                    if (vueItem.$refs[j].$refs) {
                        let child = [];
                        //构造_findChildBB方法第二个参数
                        for (let k in vueItem.$refs[j].$refs) {
                            if (vueItem.$refs[j].$refs[k]) {
                                child.push(vueItem.$refs[j].$refs[k]);
                            }
                        }
                        if (child && child.length > 0) {
                            resultVue = _findChildBB(uuid, child);
                            if (resultVue && resultVue != null) {
                                return resultVue;
                                // currentVueArray.push(resultVue);
                            }
                        }
                    }
                }
            }
        }
    }
    return resultVue;
}

/**
    根据uuid 查询这个uuid的积木vue对象
**/
util.findBBByUuid_deep = function(uuid, fromRoot) {
    let root = window._TY_Root; //初始根
    currentVue = null;
    if (!root) {
        return null; //没有页面
    }
    ////从root开始找，比如弹窗中的子积木就查询不到，所以还是从根dom开始找
    if (fromRoot) {
        root = root.$root;
    }
    //判断当前vue对象是不是要找的vue组件
    let resultVue = _checkVueHasRef(uuid, root);
    if (resultVue && resultVue != null) {
        return resultVue;
    } else if (root.$children && root.$children.length > 0) {
        resultVue = _findChildBB(uuid, root.$children);
    }
    if (!resultVue && root.$refs) {
        let child = [];
        //构造_findChildBB方法第二个参数
        for (let k in root.$refs) {
            if (root.$refs[k]) {
                child.push(root.$refs[k]);
            }
        }
        resultVue = _findChildBB(uuid, child);
    }
    // util.currentVueArray = currentVueArray;
    // return currentVueArray[currentVueArray.length - 1];
    return resultVue;
}


// 层级遍历 查询uuid对应的vue对象
let _findChildBB_layer = function(uuid, _vue) {
    let resultVue = null;
    if (_vue.$children && _vue.$children.length > 0) {
        //有子
        let _childs = _vue.$children;
        for (let i = 0; i < _childs.length; i++) {
            resultVue = _checkVueHasRef(uuid, _childs[i]);
            if (resultVue && resultVue != null) {
                return resultVue;
            }
        }
    }
    if (_vue.$refs) {
        //有refs
        for (let j in _vue.$refs) {
            if (!_vue.$refs[j]) {
                //ref为undefined 直接过滤掉
                continue;
            }
            if (uuid == j && _vue.$refs[j]._isVue) {
                //如果ref的key等于uuid，则表示该对象就是要找的uuid对象(通过ref方式查找)
                resultVue = _checkVueHasRef(uuid, _vue.$refs[j]);
                if (resultVue && resultVue != null) {
                    return resultVue;
                }
            }
        }
    }
    return resultVue;
}

//层级遍历层级切换临时变量  可能会有并发的问题，后面优化
let layerBBRow = [];

let _findChildBB_layer_foreach = function(uuid) {
    let resultVue = null;
    if (!layerBBRow || layerBBRow.length <= 0) {
        return null;
    }
    for (let i = 0; i < layerBBRow.length; i++) {
        resultVue = _findChildBB_layer(uuid, layerBBRow[i]);
        if (resultVue && resultVue != null) {
            return resultVue;
        }
    }
    //如果没有找到  切换下一行数据执行
    _findChildBB_layer_change_bbrow();
    resultVue = _findChildBB_layer_foreach(uuid);
    if (resultVue && resultVue != null) {
        return resultVue;
    }
}
//layerBBRow切换到 下一层
let _findChildBB_layer_change_bbrow = function() {
    let result = [];
    if (layerBBRow && layerBBRow.length > 0) {
        layerBBRow.forEach((item) => {
            if (item.$children && item.$children.length > 0) {
                //有子
                let _childs = item.$children;
                for (let i = 0; i < _childs.length; i++) {
                    if (result.indexOf(_childs[i]) >= 0) {
                        continue;
                    }
                    result.push(_childs[i]);
                }
            }
            if (item.$refs) {
                //有refs
                for (let j in item.$refs) {
                    if (!item.$refs[j]) {
                        //ref为undefined 直接过滤掉
                        continue;
                    }
                    if (item.$refs[j]._isVue) {
                        if (result.indexOf(item.$refs[j]) >= 0) {
                            continue;
                        }
                        result.push(item.$refs[j]);
                    }
                }
            }
        });
        layerBBRow = result;
    }
}

/**
    根据uuid 查询这个uuid的积木vue对象 层级遍历
**/
util.findBBByUuid = function(uuid, fromRoot) {
    let root = window._TY_Root; //初始根
    currentVue = null;
    if (!root) {
        return null; //没有页面
    }
    //判断当前vue对象是不是要找的vue组件
    let resultVue = null;
    resultVue = _checkVueHasRef(uuid, root);
    if (resultVue && resultVue != null) {
        return resultVue;
    }
    layerBBRow = [root];
    return _findChildBB_layer_foreach(uuid);
}

//针对外面包了一层div的组件，查询div下面的组件对象
let _findRefBB = function(vueObj) {
    if (vueObj && vueObj.$refs) {
        for (let i in vueObj.$refs) {
            let item = vueObj.$refs[i];
            if (item && item.$vnode) {
                return item;
            }
        }
    }
    return null;
}

/**
    获取当前容器组件的子积木列表
**/
util.loadChildBB = function(t) {
    let result = [];
    if (t && t.$refs) {
        //不是空对象
        for (let i in t.$refs) {

            let isArray = false;
            if (!t.$refs[i] && t.$refs[i] instanceof Array) {
                isArray = true;
            }
            if (!t.$refs[i] || (!t.$refs[i]._isVue && !isArray) || (isArray && !t.$refs[i][0]._isVue)) {
                //为undefined 或者 不是vue对象 
                continue;
            }
            let _ref = t.$refs[i];
            if (isArray) {
                _ref = t.$refs[i][0];
            }
            let item = {
                uuid: i
            };
            //有些组件只是外面封了一层div，去除外衣，取其内核组件
            let tmpVue = _ref;
            if (!_ref.$vnode) {
                tmpVue = _findRefBB(_ref) || _ref;
                if (tmpVue.$vnode) {
                    item.uuid = tmpVue.$vnode.data.ref;
                }
            }
            item.name = tmpVue.$attrs.aliasName || (tmpVue.$vnode ? tmpVue.$vnode.componentOptions.tag : tmpVue._vnode.tag); //设置组件名称
            item.bbAlias = (tmpVue.$vnode ? tmpVue.$vnode.componentOptions.tag : tmpVue._vnode.tag); //设置积木别名
            let isNull = true;
            for (let j in tmpVue.$refs) {
                isNull = false;
                break;
            }
            if (isNull) {
                //说明没有子组件了
                item.isleaf = true;
            } else {
                //说明还有子
                item.children = [];
            }
            result.push(item);
        }
    }
    return result;
}
//TODO修改老数据后删除仅供过渡老数据使用
/**
    获取当前积木的最近的bb-page容器
**/
util.nearestPage = function(t) {
    let vNode = {};
    if (t && t.$parent) {
        //不是空对象
        const nowNode = t.$parent;
        if (t.$parent.$vnode.tag.search("bb-page") != -1) {
            vNode = nowNode;
            return vNode;
        } else {
            return util.nearestPage(nowNode);
        }
    }
}



util.loadBuzz = function(buzz, handle) {
    var params = {
        alias: buzz
    };
    util.get(window._TY_ContentPath + '/read-buzz-by-alias', params).then(function(map) {
        var data = map.data.data.data;
        if (handle) {
            handle(data.code);
        }
    }).catch(function(err) {
        console.log(err);
    });
}

/**
 * 构建form表单组件 默认值
 * @param t
 * @param p_value
 * @param isObj   是否返回object
 */
util.buildDefaultValTpl = function(t, p_value, isObj) {
    if ((!t.value || JSON.stringify(t.value) === '{}') && t.defaultValTpl) {
        let temp = util.tpl(t.defaultValTpl, util.buildTplParams(t));
        if (isObj) {
            t[p_value] = JSON.parse(temp);
        } else {
            t[p_value] = temp;
        }
        t.$emit('input', t[p_value]);
        t.$emit('change', t[p_value]);
    }
}

/**
 * 渲染标准数据格式
 * @content: [{ //页面内容
        uuid: '',
        alias: 'bb-layout-canvas', //积木别名
        aliasName: '自由式布局', //中文名称
        attributes: {}, //积木属性
        animation: [{ //动画
        }],
        interactives: [{ //触发交互
        }],
        layout: {} //积木布局
    }]
 * @createElement: fn vue的方法
 * @t:当前容器积木的实例化对象
 */
util.bbRender = function(content, createElement, t) {
    const bbList = [];
    //onInteractiveFn 存储每个事件的方法数组
    if (content) {
        content = typeof content == 'string' ? eval("(" + content + ")") : content;
        content.forEach((bb, key) => {
            const attributes = bb['attributes'];
            let onArr = _setEventMethod(bb, t);
            //渲染积木属性和动画
            const style = util.setStyle(bb, t);
            const bbele = createElement(bb['alias'], {
                ref: bb['uuid'] || util.uuid(),
                props: attributes,
                attrs: {
                    aliasName: bb['aliasName']
                },
                on: onArr,
                style: style
            }, []);
            bbList.push(bbele);
        });
    }
    return bbList;
}

/**
 * canvas渲染标准数据格式
 * @param content
 * @param createElement
 * @param t
 * @returns {Array}
 * @createElement: fn vue的方法
 * @t:当前容器积木的实例化对象
 */
util.bbCanvasRender = function(content, createElement, t) {
    const bbList = [];
    //onInteractiveFn 存储每个事件的方法数组
    if (content) {
        content = typeof content == 'string' ? eval("(" + content + ")") : content;
        content.forEach((bb, key) => {
            const attributes = bb['attributes'];
            let onArr = _setEventMethod(bb, t);
            //渲染积木属性和动画
            const style = util.setStyle(bb, t);
            const bbele = createElement(bb['alias'], {
                ref: bb['uuid'] || util.uuid(),
                props: attributes,
                attrs: {
                    aliasName: bb['aliasName']
                },
                on: onArr,
                style: style
            }, []);
            const bbItem = createElement('div', {
                style: {
                    transform: `rotate(${bb.layout.rotate}deg)`,
                    flex: 1,
                    position: 'absolute',
                    left: bb.layout.position.x + 'px',
                    top: bb.layout.position.y + 'px',
                    "z-index": bb.layout.zIndex
                }
            }, [bbele]);

            bbList.push(bbItem);
        });
    }
    return bbList;
}
//建议css色值方法
util.setSimpleStyle = function(_css) {
    return util.setStyle({
        layout: _css
    });
}
/**
 *setStyle 设置积木样式
 *私有只在bbRender中使用
 * @t:当前容器积木的实例化对象
 * @bb:{ //需要解析交互的积木
    uuid: '',
    alias: 'bb-layout-canvas', //积木别名
    aliasName: '自由式布局', //中文名称
    attributes: {}, //积木属性
    animation: [{ //动画
    }],
    interactives: [{ //触发交互
    }],
    layout: {} //积木布局
}
 */
util.setStyle = function(bb, t) {
    const layout = bb.layout;
    let style = {
        // 'margin': '2px',
    };
    if (layout && JSON.stringify(layout) != '{}') {
        style = {
            'display': layout.display,
            'position': layout.positionType,
            'z-index': layout.zIndex,
            'background-image': `url(${layout.bgUrl})`,
            'background-repeat': layout.bgRepeat,
            'background-origin': layout.bgOrigin,
            'background-position': layout.bgPosition,
            'background-size': layout.bgSize,
            'background-attachment': layout.bgAttachment,
            'background-color': layout.bgColor,
            'transform': `rotate(${layout.bgColor}deg)`,
            'opacity': layout.transparency,
            'width': layout.size ? layout.size.width : "auto",
            'height': layout.size ? layout.size.height : "auto",
            'left': layout.position ? layout.position.x : "auto",
            'top': layout.position ? layout.position.y : "auto",
            'border-style': layout.border && layout.border.style,
            'border-color': layout.border && layout.border.color,
            'border-width': layout.border && layout.border.size,
            'border-radius': layout.border && layout.border.radius,
            'padding': layout.border && layout.border.padding,
            'margin': layout.border && layout.border.margin,
            'box-shadow': `${layout.shadow&&layout.shadow.size} ${layout.shadow&&layout.shadow.direction} ${layout.shadow&&layout.shadow.vague} ${layout.shadow&&layout.shadow.color}`,
            'overflow-y': layout['overflow-y'],
            'overflow-x': layout['overflow-x'],
            'font-family': layout.font && layout.font.family,
            'color': layout.font && layout.font.color,
            'font-size': layout.font && layout.font.size,
            'text-align': layout.font && layout.font.align,
            'text-decoration': layout.font && layout.font.decoration,
            'line-height': layout.font && layout.font.lineHeight,
        }
        if (layout.other) {
            style = Object.assign({}, style, layout.other);
        }
    }
    const animation = _setAnimation(bb);
    style['animation'] = animation;
    return style;
}
/**
 *setAnimation 设置积木动画 
 *私有只在bbRender中使用
 * @bb:{ //需要解析交互的积木
    uuid: '',
    alias: 'bb-layout-canvas', //积木别名
    aliasName: '自由式布局', //中文名称
    attributes: {}, //积木属性
    animation: [{ //动画
    }],
    interactives: [{ //触发交互
    }],
    layout: {} //积木布局
}
 */
let _setAnimation = function(bb) {
    const animations = bb['animation'];
    let animation = null;
    if (animations && animations.length > 0) {
        animations.forEach((ani, key) => {
            const playNum = ani.loop ? 'infinite' : ani.playNum;
            ani.style = ani.style ? ani.style : '';
            ani.time = ani.time ? ani.time : 0;
            ani.delay = ani.delay ? ani.delay : 0;
            ani.direction = ani.direction ? ani.direction : '';
            animation = animation ? `${animation},${ani.style} ${ani.time/1000}s ${ani.delay/1000}s ${ani.direction} ${playNum}` : `${ani.style} ${ani.time/1000}s ${ani.delay/1000}s ${ani.direction} ${playNum}`
        })
    }
    return animation;
}
/**
 *_setEventMethod
 *绑定公共方法到事件
 *私有只在bbRender中使用
 * @t:当前容器积木的实例化对象
 * @bb:{ //需要解析交互的积木
        uuid: '',
        alias: 'bb-layout-canvas', //积木别名
        aliasName: '自由式布局', //中文名称
        attributes: {}, //积木属性
        animation: [{ //动画
        }],
        interactives: [{ //触发交互
        }],
        layout: {} //积木布局
    }
    @t:
 */
let _setEventMethod = function(bb, t) {
    let on = {};
    const uuid = bb['uuid'];
    if (bb.interactives) {
        bb.interactives.forEach((interactive, index) => {
            on[interactive['fromContentEvent']] = _publicEmit.bind(this, t, bb, interactive['fromContentEvent']);
            if (interactive['fromContentUUID'] && interactive['fromContentUUID'] === 'Page_Ref_Root' && window._TY_Root) {
                //说明是触发根页面的事件，所以这里直接将事件绑定到根page上
                window._TY_Root.$off(interactive['fromContentEvent']); //先移除监听 去除重复的事件绑定
                // if (interactive['once']) {
                //     window._TY_Root.$once(interactive['fromContentEvent'], _publicEmit.bind(this, t, bb, interactive['fromContentEvent']));
                // } else {
                //这里once监听没有用，会导致 只要ds-success事件走一遍，其他的都不会再走了, once的逻辑应该放在下面来做
                window._TY_Root.$on(interactive['fromContentEvent'], _publicEmit.bind(this, t, bb, interactive['fromContentEvent']));
                // }
            }
        });
    }
    return on;
}
/**
 *公共方法处理绑定事件
 *私有只在bbRender中使用
    @t:当前容器积木的实例化对象
    @bb:触发事件的积木
    @fromContentEvent:当前触发事件名称
    @params:积木触发事件时传给方法的参数[data,data2....],例如linkage(data)
*/
let _publicEmit = function(t, bb, fromContentEvent, ...params) {
    const uuid = bb['uuid'];
    bb.interactives.forEach((interactive, index) => {
        if (fromContentEvent != interactive.fromContentEvent) {
            return;
        }
        // 放在_TY_Root 对象中 的 key，所有只执行一次的事件放在  _TY_Root._TY_eventOnce 数组中，如果不存在就执行一次后放进去，存在就不执行了
        let eventOnceKey = fromContentEvent + '-'; //事件名+方法名(或者自定义脚本别名)作为key

        const executeType = interactive['executeType'];
        //TODO假数据demo验证后立即删除，目前TY1.0下数据库中交互无executeArgument字段 且TY2.0中也无需添加（交互全部存在content中）
        // interactive['executeArgument'] = "[{uuid:'111111',alias:'bb-list'},{uuid:'222222',alias:'bb-uuid'}]";

        let executeArgument = typeof(interactive['executeArgument']) === 'string' ? eval(interactive['executeArgument']) : interactive['executeArgument'];

        //所有事件都触发 publicEmit 中间处理函数 由publicEmit 统一触发方法
        //事件所要执行的方法
        let fn = null;
        if (executeType == 'trigger_method') {
            //预定义方法
            const executeContentUUID = interactive['executeContentUUID'];
            const executeContentMethodName = interactive['executeContentMethodName'];
            eventOnceKey = eventOnceKey + executeContentMethodName;
            //给相同事件的创建方法数组
            const targetUUID = executeContentUUID;
            //通过uuid查找目标积木 
            //优先查找当前容器积木内的实例对象，找不到再通过util.findBBByUuid全局查找,加快查找速度
            const executeContent = util.findBBByUuid(executeContentUUID) || util.findBBByUuid(executeContentUUID, true);
            fn = executeContent ? executeContent[executeContentMethodName] : null;
        } else if (executeType == 'custom_script') {
            //自定义方法
            const buzz = interactive['executeScript'];
            eventOnceKey = eventOnceKey + buzz;
            fn = util.loadBuzz.bind(this, buzz, function(code) {
                eval(code);
            })
        } else if (executeType == 'container_method') {
            //容器方法
            const executeContentUUID = interactive['executeContentUUID'];
            const containerMethodName = interactive['containerMethodName'];
            eventOnceKey = eventOnceKey + containerMethodName;
            if (interactive['uuid'].toString().length < 5) {
                //TODO修改老数据后删除
                //如果当前交互的uuid长度小于5则可以认定是老数据
                const bbPage = util.nearestPage(t);
                fn = bbPage[containerMethodName];
            } else {
                //新数据交互
                fn = t[containerMethodName] || window._TY_Root[containerMethodName];
            }
        }
        if ((fromContentEvent === 'ds-success' || fromContentEvent === 'ds-error') && executeArgument) {
            //如果接口是 bb-page中的全局接口请求返回事件，用executeArgument（接口别名） 来区分哪个方法执行
            let api = params[1];
            if (api && api != executeArgument) {
                //如果配置了 api，但是和当前执行的接口不相同，就不执行当前方法
                return true;
            }
        }
        if (fn) {
            /**
             *执行目标方法 
             *私有只在bbRender中使用
                @params:积木触发事件时传给方法的参数[data,data2....],例如linkage(data)
                @customArg:交互配置时，用户传给目标方法的参数
                @t:当前容器积木的实例化对象
                @bb:触发事件的积木
                @fromContentEvent:当前触发事件名称
            */
            const customArg = {
                type: 'custom',
                arguments: executeArgument
            }
            //代码控制 once事件只执行一次
            if (interactive['once']) {
                if (_TY_Root._TY_eventOnce && _TY_Root._TY_eventOnce.indexOf(eventOnceKey) >= 0) {
                    //说明已经在全局变量里了，或者已经执行过一次了,直接return
                    return;
                } else {
                    if (!_TY_Root._TY_eventOnce) {
                        _TY_Root._TY_eventOnce = [];
                    }
                    _TY_Root._TY_eventOnce.push(eventOnceKey);
                }
            }

            const realParams = params.concat(customArg, t, bb, fromContentEvent);
            fn.apply(null, realParams);
        }
    });
}
//下面json格式化用到了
let _repeat = function(s, count) {
    return new Array(count + 1).join(s);
}
//json格式化工具 方法
util.jsonFormat = function(json) {
    let t = this;
    var i = 0,
        len = 0,
        tab = "    ",
        targetJson = "",
        indentLevel = 0,
        inString = false,
        currentChar = null;
    for (i = 0, len = json.length; i < len; i += 1) {
        currentChar = json.charAt(i);
        switch (currentChar) {
            case '{':
            case '[':
                if (!inString) {
                    targetJson += currentChar + "\n" + _repeat(tab, indentLevel + 1);
                    indentLevel += 1;
                } else {
                    targetJson += currentChar;
                }
                break;
            case '}':
            case ']':
                if (!inString) {
                    indentLevel -= 1;
                    targetJson += "\n" + _repeat(tab, indentLevel) + currentChar;
                } else {
                    targetJson += currentChar;
                }
                break;
            case ',':
                if (!inString) {
                    targetJson += ",\n" + _repeat(tab, indentLevel);
                } else {
                    targetJson += currentChar;
                }
                break;
            case ':':
                if (!inString) {
                    targetJson += ": ";
                } else {
                    targetJson += currentChar;
                }
                break;
            case ' ':
            case "\n":
            case "\t":
                if (inString) {
                    targetJson += currentChar;
                }
                break;
            case '"':
                if (i > 0 && json.charAt(i - 1) !== '\\') {
                    inString = !inString;
                }
                targetJson += currentChar;
                break;
            default:
                targetJson += currentChar;
                break;
        }
    }
    return targetJson;
}
//复制content并重新生成uuid
util.copyContent = function(content) {
    if (!content) {
        return;
    }
    //规范数据格式
    content = typeof content == 'string' ? JSON.parse(content) : content;
    content = JSON.stringify(content);
    var uuids = {};
    var items = content.match(/"uuid"\:\"?[a-zA-Z0-9_-]{1,}\"?\,?/g);
    var newContent = content;
    items.forEach((val, key) => {
        var uuid = val.split(':')[1];
        uuid = uuid.split(',')[0];
        var uuidString = '"' + _TY_Tool.uuid() + '"';
        uuids[uuid] = uuidString;
    });
    Object.keys(uuids).forEach((val, key) => {
        var newUUID = uuids[val];
        //去除双引号
        var oldUUID = val.match(/\"?[a-zA-Z0-9_-]{1,}\"?/g);
        newContent = newContent.replace(new RegExp(oldUUID, 'g'), newUUID);
    });
    return JSON.parse(newContent);
}

// 循环添加script
util.reloadJS = function(url) {
    if (!url || !url.length) {
        return;
    }

    let result = null;

    return (async () => {
        for (var i = 0; i < url.length; i++) {
            result = await createScript(url[i]);
        }
        if (i === url.length) {
            return result;
        }
    })();

    /**
     * 创建script
     * @param url
     * @returns {Promise}
     */
    function createScript(urlV) {
        let promise;
        let scriptElement = document.createElement('script');
        document.body.appendChild(scriptElement);

        promise = new Promise((resolve, reject) => {
            scriptElement.addEventListener('load', e => {
                resolve(e);
            }, false);

            scriptElement.addEventListener('error', e => {
                reject(e);
            }, false);
        });

        scriptElement.src = window.location.protocol + urlV;
        scriptElement.type = 'text/javascript';

        return promise;
    }
}

//判断当前环境是否是 pc 环境,区分移动端还是pc端
util.isPC = function() {
    var userAgentInfo = navigator.userAgent;
    //"iPad", 去除ipad ,ipad 用pc显示
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPod"
    ];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//判断当前环境是否是微信环境
util.isWX = function() {
    //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    var ua = window.navigator.userAgent.toLowerCase();
    //通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
//判断当前环境是否是ios
util.isIos = function() {
    var uaAll = window.navigator.userAgent.toLowerCase();
    if (uaAll.toLowerCase().indexOf('ios') != -1) {
        return true;
    } else {
        return false;
    }
};
//判断当前环境是否是安卓
util.isAndroid = function() {
    var uaAll = window.navigator.userAgent.toLowerCase();
    if (uaAll.toLowerCase().indexOf('android') != -1) {
        return true;
    } else {
        return false;
    }
};

//注册微信jssdk
util.get_wx = function() {
    const apiArray = ["chooseImage", "uploadImage", "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice", "stopVoice", "onVoicePlayEnd", "uploadVoice", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "getLocation", "openLocation", "scanQRCode"]
    const appUrl = encodeURI(window.location.href);
    const configUrl = `${_TY_ENV.apiHost}/config/xlx_c_wx_get_config?sign_url=${appUrl}`;
    console.log("configUrl:", configUrl);
    util.get(configUrl)
        .then(response => {
            let wx_config = response.data.data.wx_config;
            wx_config.jsApiList = apiArray;
            wx_config.debug = false;
            require.ensure(['weixin-js-sdk'], function(require) {
                var wx = require('weixin-js-sdk');
                wx.config(wx_config);
                wx.ready(function() {
                    wx.checkJsApi({
                        jsApiList: apiArray, // 需要检测的JS接口列表，所有JS接口列表见附录2,
                        success: function(res) {
                            console.log("微信可用api检测结果:", res);
                            window._TY_Tool.wx = wx;
                        },
                    });
                })
                wx.error(function(res) {
                    console.log("res:", res);
                });

            }, 'weixin-js-sdk');
        });
}

util.scanQRCode = function(successFn) {
    window._TY_Tool.wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
            successFn(res);
        }
    })
}


//等具体方案出来后 立即替换     转换积木编辑状态的积木editAlias和展示状态的积木transferAlias
util.transferContent = function(contents) {
    const newArry = [];
    let realContents;
    if (typeof contents == 'string') {
        try {
            realContents = eval("(" + contents + ")");
        } catch (error) {
            console.log("error:", error);
        }
    }
    if (typeof realContents == "object") {
        realContents.forEach((content, key) => {
            content.alias = content.transferAlias || content.showAlias
            newArry.push(content);
        });
        return newArry;
    } else {
        return contents
    }
}

//根据时间获取星期几  dateStr 必须是yyyy-MM-dd 或者 yyyy-MM-dd HH:mm:ss 结构
util.getDayByDate = function(dateStr) {
    if (!dateStr || dateStr.indexOf("-") < 0) {
        return null;
    }
    var arys1 = new Array();
    arys1 = dateStr.split(" ")[0].split('-'); //日期为输入日期，格式为 2018-07-02
    var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
    var week1 = String(ssdate.getDay()).replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六");
    var week = "星期" + week1;
    return {
        day: week1,
        week: week,
        fullDate: dateStr.split(" ")[0],
        date: String((ssdate.getMonth() + 1) + "月" + ssdate.getDate() + "日")
    }
}


window._TY_Tool = util;

export default util;