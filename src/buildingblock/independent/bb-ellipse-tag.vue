<script>
	//	圆角tag
	export default {
		name: 'bb-ellipse-tag',
		render: function (createElement) {
			const tagList = this.renderTag(createElement);
			return createElement('div', { 'class':'ellipse-tag' }, [tagList])
		},
		props: {
			className: {
				type: String,
				default: ""
			},
			tagList: {
				type: Array,
				default: function () {
					return []
				}
			}
		},
		data() {
			return {
				active: false
			}
		},
		watch: {
			isShow: function (val, oldVal) {
				this.active = val;
			}
		},
		
		methods: {
			renderTag(createElement) {
				const tags = [];
				this.tagList.map((item, index) => {
					tags.push(createElement('div', { 'class': [ 'tag-item' , this.className ? this.className : ''] }, [item]))
				});
				return tags;
			},
			closeFn() {
				this.$emit('closeDia');
			}
		}
	}
</script>

<style scoped lang="less">
	.ellipse-tag {
		div {
			display: inline-block;
			padding: 0 10px;
			height: 28px;
			line-height: 28px;
		}
		div + div {
			margin-left: 10px;
		}
		.tag-item {
			border-radius: 20px;
			border: 1px solid #E4E4E4;
			color: #9a9a9a;
		}
	}
</style>