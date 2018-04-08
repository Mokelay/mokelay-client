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
        {paramName:'e',valueType:"template",variable:"<%=roure.query.param%>},
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
        buzz:'buzzName'  //巴斯方法名称  action:'buzz’时有效
    }
    @valueobj :参数来源 t, bb, row-data ,route
*/
util.resolveButton = function(button, valueobj) {
    var t = valueobj['bb'];
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
        //触发按钮执行完成事件
        t.$emit("button-finish", button, valueobj);
    } else if (button['action'] == 'execute-ds') {
        var ds = button['ds'];
        var valueKey = button.valueKey || 'row-data';
        var confirmTitle = button['confirmTitle'] ? util.tpl(button['confirmTitle'], _TY_Tool.buildTplParams(t, valueobj[valueKey])) : "提示";
        var confirmText = button['confirmText'] ? util.tpl(button['confirmText'], _TY_Tool.buildTplParams(t, valueobj[valueKey])) : "是否执行此操作";
        button['callBackStaticWords'] = button['callBackStaticWords'] ? button['callBackStaticWords'] : ''
        var messageInfo = button['callBackStaticWords'] ? util.tpl(button['callBackStaticWords'], _TY_Tool.buildTplParams(t, valueobj[valueKey])) : "操作成功";
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
            //为了解决容器类积木  获取不到 弹窗中的子积木，方案待定
            t.$refs[_TY_Tool.uuid()] = _page.$children[0]; //把bb-form 设置到$refs中
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
    if (vueObj && vueObj.$vnode && vueObj.$vnode.data && vueObj.$vnode.data.ref && vueObj.$vnode.data.ref == uuid && vueObj._isVue) {
        return vueObj;
    }
    return null;
}


let currentVue = null; //解决findBBByUuid方法查询慢的问题
//深度遍历，可能会影响性能，后面考虑改成层级遍历   $refs和$children 一起查询
let _findChildBB = function(uuid, children) {
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
            }
            if (vueItem.$children && vueItem.$children.length > 0) {
                //还有子 则继续遍历
                resultVue = _findChildBB(uuid, vueItem.$children);
                if (resultVue && resultVue != null) {
                    return resultVue;
                }
            }
            if (vueItem.$refs) {
                for (let j in vueItem.$refs) {
                    if (!vueItem.$refs[j]) {
                        continue;
                    }
                    if (uuid == j && vueItem.$refs[j]._isVue) {
                        //如果ref的key等于uuid，则表示该对象就是要找的uuid对象(通过ref方式查找；_checkVueHasRef是通过$children方式来查找)
                        return vueItem.$refs[j];
                    }
                    if (vueItem.$refs[j].$children && vueItem.$refs[j].$children.length > 0) {
                        resultVue = _findChildBB(uuid, vueItem.$refs[j].$children);
                        if (resultVue && resultVue != null) {
                            return resultVue;
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
util.findBBByUuid = function(uuid, fromRoot) {
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
            item.name = _ref.$attrs.aliasName || _ref.$vnode.componentOptions.tag; //设置组件名称
            item.bbAlias = _ref.$vnode.componentOptions.tag; //设置积木别名
            let isNull = true;
            for (let j in _ref.$refs) {
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
    });;
}

/**
 * 构建form表单组件 默认值
 * @param t
 * @param p_value
 * @param isObj   是否返回object
 */
util.buildDefaultValTpl = function(t, p_value, isObj) {
    if (!t.value && t.defaultValTpl) {
        let temp = util.tpl(t.defaultValTpl, util.buildTplParams(t));
        if (isObj) {
            t[p_value] = JSON.parse(temp);
        } else {
            t[p_value] = temp;
        }
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
        content = typeof content == 'string' ? eval("(" + content + ")") : content;
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
            'transform': `rotate(${layout.bgColor}deg)`,
            'opacity': layout.transparency,
            'width': layout.size.width && layout.size.width + 'px',
            'height': layout.size.height && layout.size.height + 'px',
            'border-style': layout.border.style,
            'border-color': layout.border.color,
            'border-size': layout.border.size,
            'border-radius': layout.border.radius,
            'margin': layout.border.margin,
            'box-shadow': `${layout.shadow.size} ${layout.shadow.direction} ${layout.shadow.vague} ${layout.shadow.color}`,
            'overflow-y': layout['overflow-y'],
            'overflow-x': layout['overflow-x']
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

window._TY_Tool = util;

export default util;