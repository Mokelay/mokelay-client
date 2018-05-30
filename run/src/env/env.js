var CurrentDomain = null;
if(window){
	CurrentDomain = window.location.protocol+"//"+window.location.host;
}

var env = {
	local: {
		name: 'local',
		apiHost: "http://longyan.dev.rs.com",
		ssoURL: "http://urms.dev.rs.com/passport/login?service=http://longyan.dev.rs.com/urmscallback", 
		hosts:{
			'default':"http://longyan.dev.rs.com"
		},
		questionnaireHost:"http://ty.saiyachina.com/survey",
	},
	prd: {
		name: 'prd',
		apiHost: CurrentDomain,
		ssoURL: CurrentDomain + "/#/ty-login",
		hosts:{
			'default':CurrentDomain
		},
		questionnaireHost:"http://ty.saiyachina.com/survey",
		home:"/home_ln"
	},
	demo:{
		name: 'demo',
		apiHost: "http://demo.greatbee.com",
		ssoURL: CurrentDomain + "/#/ty-login",
		hosts:{
			'default':"http://demo.greatbee.com"
		},
		home:"/home_ln"
	}
};
// export default env;
module.exports = env;