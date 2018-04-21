var CurrentDomain = null;
if(typeof window  == "undefined"){
	CurrentDomain = window.location.protocol+"//"+window.location.host;
}

var env = {
	local: {
		name: 'local',
		apiHost: "http://longyan.dev.rs.com",
		ssoURL: "http://urms.dev.rs.com/passport/login?service=http://longyan.dev.rs.com/urmscallback", 
		hosts:{
			'default':"http://longyan.dev.rs.com"
		}
	},
	prd: {
		name: 'prd',
		apiHost: CurrentDomain,
		ssoURL: CurrentDomain + "/#/ty-login",
		hosts:{
			'default':CurrentDomain
		}
	}
};
// export default env;
module.exports = env;