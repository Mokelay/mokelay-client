import axios from 'axios';
import Qs from 'qs';
import _ from 'underscore';

let util = {};

//为了能请求第三方或自定义额接口，保证图片上传到第三方文件服务器，这里不设置baseURL
util.axios = axios.create({
    timeout: 30000,
    withCredentials: true
});

util.invoke = function(method, url, param) {
    let params;
    if (method == 'get') {
        params = {
            params: param
        }
    } else {
        params = Qs.stringify(param);
    }

    return new Promise((resolve, reject) => {
        if (!util.ajax) {
            util.ajax = axios.create({
                baseURL: window._TY_APIHost,
                timeout: 30000,
                withCredentials: true
            });
        }
        util.ajax[method](url, params).then(function(response) {
            if (response && response['data'] && response['data']['code'] && response['data']['code'] == -401) {
                //未登录
                location.href = window._TY_SSOURL;
            } else if (response && response['data'] && response['data']['code'] && response['data']['code'] == -400) {
                //TY未登录
                location.href = window._TY_APIHost+"/#/ty-login";
            } else {
                resolve(response);
            }
        }).catch(function(error) {
            reject(error);
        });
    });
}

util.post = function(url, param) {
    return util.invoke("post", url, param);
}
util.get = function(url, param) {
    return util.invoke("get", url, param);
}

util.tpl = function(tpl, data) {
    try{
        return _.template(tpl)(data);
    }catch(e){
        return "";
    }
};

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

//获取DS
/**
DS配置案例
{
    api:"/list-data",
    type:'config',
    method:"post",
    inputs:[
        {paramName:'a',valueType:"constant",constant:123},
        {paramName:'b',valueType:"inputValueObj",valueKey:"bb",variable:"pageSize"},
        {paramName:'c',valueType:"inputValueObj",valueKey:"router",variable:"page"},
        {paramName:'d',valueType:"inputValueObj",valueKey:"row-data",variable:"alias"},
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
    var api = ds['api'];
    var type = ds['category'] || 'config'; //默认是配置接口
    if (!api) {
        error(500, "请求参数无效");
        return;
    }
    var method = ds['method'] || 'post';
    var requestParam = {};
    var inputs = ds['inputs'] || [];
    var outputs = ds['outputs'] || [];
    if (inputs && inputs.length > 0) {
        inputs.forEach(function(input) {
            var valueType = input['valueType'];
            var paramValue = null;
            if (valueType == 'constant') {
                paramValue = input['constant'];
            } else if (valueType == 'template') { //支持参数为自定义模板
                paramValue = util.tpl(input['variable'], inputValueObj[input['valueKey']]);
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
            requestParam[input['paramName']] = paramValue;
        });
    }
    var apiUrl = api;
    if (type == 'config') {
        //如果不是自定义接口
        apiUrl = window._TY_ContentPath + "/" + api;
    }
    util[method](apiUrl, requestParam).then(function(response) {
        var data = response['data'];
        if (data['ok']) {
            var realDataMap = data['data'];
            new Promise(function(resolve, reject){
                const promiseArr = [];
                outputs.forEach(function(output) {
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
            }).then((outputs)=>{success(outputs)});
        } else {
            error(data['code'], data['message']);
        }
    }).catch(function(err) {
        error(err);
    });
}

//统一的解析按钮逻辑
util.resolveButton = function(button, valueobj) {
    var t = valueobj['bb'];
    if (button['action'] == 'url') {
        //URL跳转
        //为了兼容扩展dataparam的值的范围，注意URL参数的Encode
        var dataParam = valueobj['row-data'] || {};
        dataParam = Object.assign({},dataParam, valueobj);
        var url = util.tpl(button['url'],dataParam);
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
        //触发按钮执行完成事件
        t.$emit("button-finish",button,valueobj);
    } else if (button['action'] == 'execute-ds') {
        var ds = button['ds'];
        var valueKey = button.valueKey || 'row-data';
        var confirmTitle = button['confirmTitle']?util.tpl(button['confirmTitle'], valueobj[valueKey]) : "提示";
        var confirmText = button['confirmText']?util.tpl(button['confirmText'], valueobj[valueKey]) : "是否执行此操作";
        button['callBackStaticWords'] = button['callBackStaticWords'] ? button['callBackStaticWords'] : ''
        var messageInfo = button['callBackStaticWords']?util.tpl(button['callBackStaticWords'], valueobj[valueKey]) : "操作成功";
        t.$confirm(confirmText, confirmTitle, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            util.getDSData(ds, valueobj, function(map) {
                //TODO
                t.$message({
                    type: 'success',
                    message: messageInfo
                });
                // util.buttonCallback(button, valueobj, callback, map);
                //触发按钮执行完成事件
                t.$emit("button-finish",button,valueobj,map);
            }, function(err, msg) {
                t.$message({
                    type: 'warning',
                    message: msg || messageInfo
                });
                // util.buttonCallback(button, valueobj, callback, err);
                //触发按钮执行完成事件
                t.$emit("button-finish",button,valueobj,err);
            });
        }).catch(() => {
            t.$message({
                type: 'info',
                message: '操作未完成'
            });
        });
    } else if (button['action'] == 'dialog-page') {
        //TODO 弹出一个页面对话框
        require.ensure(["art-dialog", "jquery"], function(require) {
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
                title: '消息',
                content: _page.$el
            });
            d.showModal();
            t.dialog = d;
        });
    } else if (button['action'] == 'code') {
        //执行代码
        button['method'].call(this, valueobj['row-data']);
        //触发按钮执行完成事件
        t.$emit("button-finish", button, valueobj);
    } else if (button['action'] == 'buzz') {
        //如果是巴斯代码，远程加载
        util.loadBuzz(button.buzz, function(code) {
            t.util = util;
            eval(code);
            //触发按钮执行完成事件
            t.$emit("button-finish", button, valueobj);
        });
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
    });;
}

/**
 * 构建form表单组件 默认值
 * @param t
 * @param p_value
 */
util.buildDefaultValTpl=function(t,p_value){
    if(!t.value&&t.defaultValTpl){
        t[p_value]=util.tpl(t.defaultValTpl,{
            bb:t,
            router:t.$route ? t.$route.params : {}
        });
        t.$emit('input',t[p_value]);
    }
}

window._TY_Tool = util;

export default util;