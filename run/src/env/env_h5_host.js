var env = {
	local: {
		name: 'local',
		h5Host: '/run_dist/'
	},
	prd: {
		name: 'prd',
		// h5Host: 'http://greatbee-ty.oss-cn-hangzhou.aliyuncs.com/run_dist/'
		h5Host: 'http://ty-cdn.greatbee.com/ty-client-core/'
	},
	chisong: {
		name: 'chisong',
		h5Host: 'http://ty-cdn.greatbee.com/ty-client-core-chisong/'
	}

};
// export default env;
module.exports = env;