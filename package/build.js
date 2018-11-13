//批处理脚本，用于从服务端下载所有的page配置以及巴斯函数
var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');

//args数组，参数1是node执行路径，参数2是执行文件路径，参数3后面是命令行后面的参数
var args = process.argv;
var appAliass = "";
if (args.length > 2) {
    appAliass = args[2];
}
console.log(args);
console.log("appAliass=" + appAliass);

//如果传了参数 appAliass 应用别名
if (appAliass) {
    //查询应用下的所有页面内容
    var options = {
        host: 'mokelay.com',
        port: 80,
        path: '/config/ty_custom_build_package?appAliass=' + appAliass, //根据应用别名数组查询应用下面的所有积木
        method: 'GET',
        headers: {
            'accept': '*/*',
            'content-type': "application/x-www-form-urlencoded",
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'user-agent': 'nodejs rest client'
        }
    };
    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');
        var content = [];
        res.on('data', function(chunk) {
            content.push(chunk.toString());
        });
        res.on('end', function() {
            var response = JSON.parse(content.join(''));
            if (response && response.ok && response['data']['data_list']) {
                //应用列表
                var bbAliass = ['bb-indep-button']; //存储所有积木别名，初始化一些通用的组件
                var list = response.data.data_list.list;
                // console.log("list:", list);
                list.forEach(function(item, index) {
                    var content = item.content;
                    /*  content中解析bbAlias  \"et\": \"bb-input\"
                     *  "alias":"bb-xxx"
                     */
                    var regex = /\"alias\":\"(bb-[a-zA-Z_-]*)\"/ig;
                    var result = null;
                    while ((result = regex.exec(content)) != null) {
                        if (bbAliass.indexOf(result[1]) < 0) {
                            bbAliass.push(result[1]);
                        }
                    }
                    var regex2 = /\\"et\\":\\"(bb-[a-zA-Z_-]*)\\"/ig;
                    var result2 = null;
                    while ((result2 = regex2.exec(content)) != null) {
                        if (bbAliass.indexOf(result2[1]) < 0) {
                            bbAliass.push(result2[1]);
                        }
                    }
                    var regex3 = /\"et\":\"(bb-[a-zA-Z_-]*)\"/ig;
                    var result3 = null;
                    while ((result3 = regex3.exec(content)) != null) {
                        if (bbAliass.indexOf(result3[1]) < 0) {
                            bbAliass.push(result3[1]);
                        }
                    }
                    console.log("bbList:", bbAliass);

                    //删除之前添加的测试页面 删除以-test结尾的页面alias. 所有积木以bb-开头，所有页面不能以bb-开头
                    for (var i = 0; i < bbAliass.length; i++) {
                        if (bbAliass[i].endsWith("-test")) {
                            bbAliass.splice(i--, 1);
                        }
                    }

                });

                var code = `
                import layoutBB from './layout/';
                import './css/minireset.css';
                import './css/theme-default/index.css';
                import './css/iconfont/ty.css';
                import 'animate.css/animate.min.css';
                import './libs/touch.js';
                import './libs/flexble.js';
                //公用组件
                import { Toast } from 'vant';//用到了vant的toast

                import bbtoast from './buildingblock/independent/bbToast';
                import bbmodal from './buildingblock/independent/bbModal';
                import bbreadbb from 'bb-read-bb';
                import bb from './buildingblock/independent/bb';
                `;
                //添加应用中用到的积木
                bbAliass.forEach(function(bb, index) {
                    code = code + "                import " + bb.replace(/-/g, "") + " from '" + bb + "';\n"
                });

                code = code + `
                    export default {
                        install: function(Vue) {
                            console.log("开始加载积木....");
                `;
                bbAliass.forEach(function(bb, index) {
                    code = code + "                            Vue.component('" + bb + "', " + bb.replace(/-/g, "") + ");\n";
                });
                code = code + `
                            //布局积木安装
                            layoutBB.install(Vue);
                            Vue.component('bb-read-bb', bbreadbb);
                            Vue.component('bb', bb);
                            Vue.use(Toast);
                            //安装全局变量
                            window._TY_Toast = bbtoast;
                            window._TY_Modal = bbmodal;
                        }
                    };
                `;

                var p = path.join(__dirname, "..", "src", "index.js"); //主要生成index.js文件
                //生成index.js入口文件
                fs.writeFile(p, code, (err) => {
                    if (err) {
                        console.log("Write page error:");
                        console.log(err);
                    }
                })

            }
        });
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();

} else {
    //要生成的入口文件代码   默认是全部加载
    var code = `import pc from './pc';
    export default pc;`;
    //src 路径
    console.log(path.join(__dirname, "..", "src"));
    var p = path.join(__dirname, "..", "src", "index.js"); //主要生成index.js文件

    //生成index.js入口文件
    fs.writeFile(p, code, (err) => {
        if (err) {
            console.log("Write page error:");
            console.log(err);
        }
    })
}