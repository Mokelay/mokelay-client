<template>
	<div class="bb-indep-iframe"> 
		<iframe id="child" :src="realSrc" frameborder="0" scrolling="auto" style="height:100vh;width:50vw;"></iframe>
	</div>
</template>
<script> 
	export default {
		name:"bb-indep-iframe",
		props:{
			/*页面地址
				支持模板渲染
			*/
			src:{
				type:String
			},
		},
		data() {
			return {
				realSrc:_TY_Tool.tpl(this.src, _TY_Tool.buildTplParams(this))
      		};
        },
		computed:{
		},
		mounted:function(){
			this.listenMessage();
			const t = this;
			t.postParentInfo();

        },
        watch:{
        	src(val){
        		this.realSrc = _TY_Tool.tpl(val, _TY_Tool.buildTplParams(this))
        		console.log("src:",this.realSrc);
        	}
        },
		methods:{
			//监听消息
			listenMessage(){
				const t = this;
				window.addEventListener('message',function(event){
			        console.log(event);
			        console.log("src:",t.realSrc);

			        t.$emit(event.data.type,event.data.data);
			        //top.postMessage("子页面消息收到", 'http://ty.dev.rs.com:8080/#/test-wmj')
			    }, false);
			},
			//向子页面传递父页面的基础信息
			postParentInfo(){
				const t = this;
				const iframe = document.getElementById('child');
				iframe.onload = function(){
					iframe.contentWindow.postMessage({
			            type:"parentPage",
			            data:{
			            	href:window.location.href
			            }
			         	}, t.realSrc);  
					}
			}
		},
	}
</script>
<style lang='less' scoped> 
 
</style>