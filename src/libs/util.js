import axios from 'axios';
import Qs from 'qs';

let util = {};

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
    var re = /<%([^%>]+)?%>/g,
        re2 = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
    var code = 'var r=[];\n',
        cursor = 0;
    var add = function(line, js) {
        js ? code += line.match(re2) ? line + '\n' : 'r.push(' + line + ');\n' :
            code += 'r.push("' + line.replace(/"/g, '\\"') + '");\n';
    };
    var match = null;
    while (match = re.exec(tpl)) {
        add(tpl.slice(cursor, match.index));
        re2.test(match[1]) ? add(match[1], true) : add("this." + match[1], true);
        cursor = match.index + match[0].length;
    }
    add(tpl.substr(cursor, tpl.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
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
        {dataKey:"tableData",valueKey:"data-list-1"}
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
                    if (paramArr.length > 1) { //支持参数形式 a.b.c.d
                        paramValue = _inputData[paramArr[0]];
                        paramArr.splice(0, 1);
                        paramArr.forEach(function(key) {
                            paramValue = paramValue[key];
                        });
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
            outputs.forEach(function(output) {
                var paramArr = output['valueKey'].split('.');
                if (paramArr.length > 1) { //支持参数形式 a.b.c.d
                    output['value'] = realDataMap[paramArr[0]];
                    paramArr.splice(0, 1);
                    paramArr.forEach(function(key) {
                        output['value'] = output['value'][key];
                    });
                } else {
                    output['value'] = realDataMap[output['valueKey']];
                }
            });
            success(outputs);
        } else {
            error(data['code'], data['message']);
        }
    }).catch(function(err) {
        error(err);
    });
}

//统一的解析按钮逻辑
util.resolveButton = function(button, valueobj, callback) {
    var t = valueobj['bb'];
    if (button['action'] == 'url') {
        //URL跳转
        var url = util.tpl(button['url'], valueobj['row-data']);
        if (button['urlType'] == 'openWindow') {
            window.open(url);
        } else {
            if (url.indexOf("http") == 0) {
                document.location.href = url;
            } else {
                t.$router.push(url);
            }
        }
    } else if (button['action'] == 'execute-ds') {
        var ds = button['ds'];
        var valueKey = button.valueKey || 'row-data';
        var confirmTitle = util.tpl(button['confirmTitle'], valueobj[valueKey]) || "提示";
        var confirmText = util.tpl(button['confirmText'], valueobj[valueKey]) || "是否执行此操作";
        button['callBackStaticWords'] = button['callBackStaticWords'] ? button['callBackStaticWords'] : ''
        var messageInfo = util.tpl(button['callBackStaticWords'], valueobj[valueKey]) || "操作成功";
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
                util.buttonCallback(button, valueobj, callback, map);
            }, function(err, msg) {
                t.$message({
                    type: 'warning',
                    message: msg || messageInfo
                });
                util.buttonCallback(button, valueobj, callback, err);
            });
        }).catch(() => {
            t.$message({
                type: 'info',
                message: '操作未完成'
            });
        });
    } else if (button['action'] == 'dialog-page') {
        //TODO 弹出一个页面对话框
        var h = t.$createElement;
        t.$msgbox({
            title: '消息',
            message: h('bb-page', {
                props: {
                    pageAlias: button['dialogPage']
                }
            }, []),
            beforeClose: function(action, instance, done) {
                done();
            }
        });
    } else if (button['action'] == 'code') {
        //执行代码
        button['method'].call(this, valueobj['row-data']);
    } else if (button['action'] == 'buzz') {
        //如果是巴斯代码，远程加载
        //TODO
        var params = {
            alias: button.buzz
        };
        util.get(window._TY_ContentPath + '/read-buzz-by-alias', params).then(function(map) {
            var data = map.data.data.data;
            var code = data.code;
            t.util = util;
            eval(code)(t);
        }).catch(function(err) {});;
    }
}
util.buttonCallback = function(button, valueobj, callback, map) {
    switch (button['callback']) {
        case 'refresh':
            valueobj.getData();
            break;
        case 'custom':
            callback(button, valueobj, map)
            break;
    }
}

window._TY_Tool = util;

export default util;