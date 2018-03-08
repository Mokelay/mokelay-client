import axios from 'axios';
import _ from 'underscore';
import Qs from 'qs';

let util = {};

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
            if (response && response['data'] && response['data']['code'] && response['data']['code'] == -401) {
                //未登录
                location.href = window._TY_SSOURL;
            } else if (response && response['data'] && response['data']['code'] && response['data']['code'] == -400) {
                //TY未登录
                location.href = "http://" + document.location.host + "/#/ty-login";
            } else {
                resolve(response);
            }
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
        data: Qs.stringify(param)
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
    api:"/list-data",
    category:'config',//ds选择器 不是type字段而是category字段
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
            new Promise(function(resolve, reject) {
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
            }).then((outputs) => {
                success(outputs)
            });
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
        dataParam = Object.assign({}, dataParam, valueobj);
        var url = util.tpl(button['url'], dataParam);
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
        t.$emit("button-finish", button, valueobj);
    } else if (button['action'] == 'execute-ds') {
        var ds = button['ds'];
        var valueKey = button.valueKey || 'row-data';
        var confirmTitle = button['confirmTitle'] ? util.tpl(button['confirmTitle'], valueobj[valueKey]) : "提示";
        var confirmText = button['confirmText'] ? util.tpl(button['confirmText'], valueobj[valueKey]) : "是否执行此操作";
        button['callBackStaticWords'] = button['callBackStaticWords'] ? button['callBackStaticWords'] : ''
        var messageInfo = button['callBackStaticWords'] ? util.tpl(button['callBackStaticWords'], valueobj[valueKey]) : "操作成功";
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
                t.$emit("button-finish", button, valueobj, map);
            }, function(err, msg) {
                t.$message({
                    type: 'warning',
                    message: msg || messageInfo
                });
                // util.buttonCallback(button, valueobj, callback, err);
                //触发按钮执行完成事件
                t.$emit("button-finish", button, valueobj, err);
            });
        }).catch(() => {
            t.$message({
                type: 'info',
                message: '操作未完成'
            });
        });
    } else if (button['action'] == 'dialog-page') {
        //TODO 弹出一个页面对话框
        require.ensure(["art-dialog"], function(require) {
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
        }, 'art-dialog');
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

//检查vue对象是否含有uuid,通过$children来找
let _checkVueHasRef = function(uuid, vueObj) {
    //判断vue对象是否是该uuid组件逻辑
    if (vueObj && vueObj.$vnode && vueObj.$vnode.data && vueObj.$vnode.data.ref && vueObj.$vnode.data.ref == uuid) {
        return vueObj;
    }
    return null;
}

//深度遍历，可能会影响性能，后面考虑改成层级遍历
let _findChildBB = function(uuid, children) {
    let resultVue = null;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            let vueItem = children[i];
            resultVue = _checkVueHasRef(uuid, vueItem);
            if (resultVue && resultVue != null) {
                return resultVue;
            }
            if (vueItem.$children && vueItem.$children.length > 0) {
                //还有子 则继续遍历
                resultVue = _findChildBB(uuid, vueItem.$children);
                if (resultVue && resultVue != null) {
                    return resultVue;
                }
            }
        }
    }
    return resultVue;
}

/**
    根据uuid 查询这个uuid的积木vue对象
**/
util.findBBByUuid = function(uuid) {
    let root = window._TY_Root; //初始根
    if (!root) {
        return null; //没有页面
    }
    ////从root开始找，比如弹窗中的子积木就查询不到，所以还是从根dom开始找
    while (root.$parent) {
        root = root.$parent;
    }
    //判断当前vue对象是不是要找的vue组件
    let resultVue = _checkVueHasRef(uuid, root);
    if (resultVue && resultVue != null) {
        return resultVue;
    } else if (root.$children && root.$children.length > 0) {
        resultVue = _findChildBB(uuid, root.$children);
    }
    return resultVue;
}

/**
    获取当前容器组件的子积木列表
**/
util.loadChildBB = function(t) {
    let result = [];
    if (t && t.$refs) {
        //不是空对象
        for (let i in t.$refs) {
            if (!t.$refs[i] || !t.$refs[i]._isVue) {
                //为undefined 或者 不是vue对象 
                continue;
            }
            let item = {
                uuid: i
            };
            item.name = t.$refs[i].$attrs.aliasName || t.$refs[i].$vnode.componentOptions.tag; //设置组件名称
            item.bbAlias = t.$refs[i].$vnode.componentOptions.tag; //设置积木别名
            let isNull = true;
            for (let j in t.$refs[i].$refs) {
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
util.buildDefaultValTpl = function(t, p_value) {
    if (!t.value && t.defaultValTpl) {
        t[p_value] = util.tpl(t.defaultValTpl, util.buildTplParams(t));
        t.$emit('input', t[p_value]);
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
        content.forEach((bb, key) => {
            const attributes = bb['attributes'];
            let onArr = _setEventMethod(bb, t);
            //渲染积木属性和动画
            const style = _setStyle(bb, t);
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
                    flex: 1
                }
            }, [bbele]);
            //控制排序 TODO
            //bbList.splice(bb.layout.sort - 1,1,bbItem);
            bbList.push(bbItem);
        });
    }
    return bbList;
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
let _setStyle = function(bb, t) {
    const layout = bb.layout;
    let style = {
        'margin': '2px',
    };
    if (layout && JSON.stringify(layout) != '{}') {
        style = {
            'background-color': layout.bgColor,
            'transform': `rotate(${layout.bgColor})`,
            'opacity': layout.transparency,
            'width': layout.size.width,
            'height': layout.size.height,
            'border-style': layout.border.style,
            'border-color': layout.border.color,
            'border-size': layout.border.size,
            'border-radius': layout.border.radius,
            'margin': layout.border.margin,
            'box-shadow': `${layout.shadow.size} ${layout.shadow.direction} ${layout.shadow.vague} ${layout.shadow.color}`,
        }
    }
    const animation = _setAnimation(bb);
    style.animation = animation;
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
    animations.forEach((ani, key) => {
        const playNum = ani.loop ? 'infinite' : ani.playNum;
        animation = animation ? `${animation},${ani.style} ${ani.time} ${ani.delay} ${ani.direction} ${playNum}` : `${ani.style} ${ani.time} ${ani.delay} ${ani.direction} ${playNum}`
    })
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
        const executeType = interactive['executeType'];
        //所有事件都触发 publicEmit 中间处理函数 由publicEmit 统一触发方法
        //事件所要执行的方法
        let fn = null;
        if (executeType == 'trigger_method') {
            //预定义方法
            const executeContentUUID = interactive['executeContentUUID'];
            const executeContentMethodName = interactive['executeContentMethodName'];
            //给相同事件的创建方法数组
            const targetUUID = executeContentUUID;
            //通过uuid查找目标积木 
            //优先查找当前容器积木内的实例对象，找不到再通过util.findBBByUuid全局查找,加快查找速度
            const executeContent = t.$refs[executeContentUUID] || util.findBBByUuid(executeContentUUID);
            fn = executeContent ? executeContent[executeContentMethodName] : null;
        } else if (executeType == 'custom_script') {
            //自定义方法
            const buzz = interactive['executeScript'];
            fn = util.loadBuzz.bind(this, buzz, function(code) {
                eval(code);
            })
        } else if (executeType == 'container_method') {
            //容器方法
            const containerMethodName = interactive['containerMethodName'];
            fn = t[containerMethodName];
        }
        if (fn) {
            /**
             *执行目标方法 
             *私有只在bbRender中使用
                @params:积木触发事件时传给方法的参数[data,data2....],例如linkage(data)
                @t:当前容器积木的实例化对象
                @bb:触发事件的积木
                @fromContentEvent:当前触发事件名称
            */
            fn(params, t, bb, fromContentEvent);
        }
    });
}

window._TY_Tool = util;

export default util;