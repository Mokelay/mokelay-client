var CurrentDomain = null;
if (window) {
	CurrentDomain = window.location.protocol + "//" + window.location.host;
}

var env = {
	local: {
		name: 'local',
		apiHost: "http://www.mokelay.com",
		// apiHost: "http://longyan.dev.rs.com",
		h5Host: CurrentDomain,
		rsURL: "http://urms.dev.rs.com/passport/login?service=http://longyan.dev.rs.com/urmscallback",
		ssoURL: CurrentDomain + "/#/ty-login",
		hosts: {
			// 'default': "http://longyan.dev.rs.com"
			'default': "http://www.mokelay.com"
		},
		// questionnaireHost: "http://ty.saiyachina.com/survey"
		questionnaireHost: "http://www.mokelay.com/survey",
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
		questionnaireHost: "http://www.mokelay.com/survey",
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
		questionnaireHost: "http://www.mokelay.com/survey",
		home: "/home_ln"
	}
};
// export default env;
module.exports = env;