//常量配置
import env from './env';
import envConfig from './env_config';

export default {
	init: function(platform) {
		var _env = env[envConfig];
		window._TY_ENV = _env;
		window._TY_ContentPath = "/config";
		window._TY_APIHost = _env.apiHost;
		window._TY_H5Host = _env.h5Host || '';
		window._TY_Page_Data = {};
		window._TY_HOSTS = _env.hosts || {};
		if (!window._TY_Home) {
			window._TY_Home = _env['home'] || "/home";
		}
		if (!window._TY_SSOURL){
			window._TY_SSOURL = _env.ssoURL;
		}
		window._TY_Platform = platform;
		window._TY_DS_Cache = {};
	}
};