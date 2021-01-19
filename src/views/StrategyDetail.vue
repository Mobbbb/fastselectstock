<template>
  	<div class="strategy-detail">
		<RequestLoading v-if="isLoading"></RequestLoading>
		<template v-else>
			<div v-for="(item, index) in strategyComponents" :key="index + '1'" class="jgy-item-wrap">
				<jgy :configData="item"/>
			</div>
			<div class="statement">免责声明：本页面推荐的产品和信息基于人工智能算法模型，仅供投资者参考，不构成投资建议</div>
		</template>
  	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import RequestLoading from '_c/components/base/RequestLoading.vue';

export default {
	name: 'strategy-detail',
	data() {
		return {
			isLoading: true,
		}
	},
	components: {
		RequestLoading,
	},
	computed: {
		...mapState([
			'strategyComponents',
		]),
	},
	methods: {
		...mapActions([
			'getStrategyDetailAction',
		]),
		async getStrategyDetail() {
			this.isLoading = true;
			const { query, simulateId } = this.$route.query;
			await this.getStrategyDetailAction({
				query,
				simulateId,
			});
			this.isLoading = false;
		},
	},
	activated() {
		this.getStrategyDetail();
	},
}
</script>

<style scoped>
	.strategy-detail{
		height: 100%;
		overflow: scroll;
		-webkit-overflow-scrolling: touch;
		background: #f5f5f5;
		padding: 1PX 12px 0;
		box-sizing: border-box;
	}
	.jgy-item-wrap{
		background: #ffffff;
		border-radius: 8px;
		padding: 1PX 12px;
		margin-top: 8px;
	}
	.statement{
		word-break: break-all;
		font-size: 13px;
		color: #b3b3b3;
		line-height: 18px;
		padding: 16px 0;
	}
</style>
