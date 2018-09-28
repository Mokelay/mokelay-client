var CurrentDomain = null;
if (window) {
	CurrentDomain = window.location.protocol + "//" + window.location.host;
}

var env = {
	local: {
		name: 'local',
		apiHost: "https://social-crm.xiaoyi.com",
		// apiHost: "http://longyan.dev.rs.com",
		h5Host: CurrentDomain,
		rsURL: "http://urms.dev.rs.com/passport/login?service=http://longyan.dev.rs.com/urmscallback",
		ssoURL: CurrentDomain + "/#/ty-login",
		hosts: {
			// 'default': "http://longyan.dev.rs.com"
			'default': "https://social-crm.xiaoyi.com"
		},
		// questionnaireHost: "http://ty.saiyachina.com/survey"
		questionnaireHost: "https://social-crm.xiaoyi.com/survey",
		home: "/home_ln"
	},
	prd: {
		name: 'prd',
		apiHost: CurrentDomain,
		h5Host: CurrentDomain,
		ssoURL: CurrentDomain + "/#/ty-login",
		hosts: {
			'default': CurrentDomain
		},
		questionnaireHost: "https://social-crm.xiaoyi.com/survey",
		home: "/home_ln"
	},
	chisong: {
		name: 'chisong',
		apiHost: CurrentDomain,
		h5Host: CurrentDomain,
		ssoURL: CurrentDomain + "/#/ty-login",
		hosts: {
			'default': CurrentDomain
		},
		questionnaireHost: "https://social-crm.xiaoyi.com/survey",
		home: "/home_ln"
	},
	"ty-client-xiaoyi": {
		name: 'ty-client-xiaoyi',
		apiHost: CurrentDomain,
		h5Host: CurrentDomain,
		ssoURL: CurrentDomain + "/#/ty-login",
		hosts: {
			'default': CurrentDomain
		},
		questionnaireHost: "http://www.mokelay.com/survey",
		home: "/home_ln"
	}
};
// export default env;
module.exports = env;