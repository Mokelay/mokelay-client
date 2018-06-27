<template>
	<ul> 
		<li class="content" v-for="content in contents"> 
	    	<bb-lx-item></bb-lx-item>
		</li>
		<p @click="onClick" class="more">查看更多</p>
	</ul>
    
</template>

<script>
    export default {
        name: 'bb-text',
        props: {
            //内容
	        	//title:"这个是一个标题标题标题标题",
        		//time:"07:00:00",
        		//userNumber:"292",
        		//userText:"人打卡",
            contentsArray:{
            	type:Array,
            	default:function(){
            		return [{
            			title:"这个是第一个标题",
            			time:"07:00:00",
            			userNumber:"290",
            			userText:"人打卡",
            			text:"学习"
            		},{
            			title:"这个是第一个标题",
            			time:"07:00:00",
            			userNumber:"290",
            			userText:"人打卡", 
            			text:"学习"           		
            		}]
            	}
            },
            //点击加载更多动态数据
            itemMoreDs:{
                type:Object
            },
            //初始化动态数据
            itemDs:{
				type:Object
            },

        },
        data() {
            return {
               contents:this.contentsArray,
            }
        },
        computed:{

        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
          	this.getItem();
    		this.getItemMore(); 
        },
        methods: {
        	//初始化动态数据
	        getItem() {
	            const t = this;
	            if (t.itemDs) {
	                Util.getDSData(t.itemDs, _TY_Tool.buildTplParams(t), function (data) {
	                    data.forEach((item) => {
	                        const {dataKey, value} = item;
	                        t.contents = value;
	                    });
	                }, function (code, msg) {
	                });
	            }
	        },
        	//点击更多动态数据
        	getItemMore() {
	            const t = this;
	            if (t.itemMoreDs) {
	                Util.getDSData(t.itemMoreDs, _TY_Tool.buildTplParams(t), function (data) {
	                    data.forEach((item) => {
	                        const {dataKey, value} = item;
	                        //t.contents.push(value) = value;
	                        t.contents.push(value);
	                    });
	                }, function (code, msg) {
	                });
	            }
	        },
        	//点击事件
        	onClick:function(){
        		var aa = {
        			title:"这个是第三个标题",
            		time:"07:00:00",
            		userNumber:"290",
            		userText:"人打卡",
            		text:"学习"
        		};
        		var list= this.contents;
        		list.push(aa);
        		//console.log(list);
        	}            
        }
    }
</script>
<style lang='less' scoped>
    .content{
        width: 100%;
        display: flex;
        justify-content:left;
        align-items:center;
        margin-top:10px;
    }

    .more{
    	text-align:center;
    	font-size:14px;
    	line-height:30px;
    }
</style>