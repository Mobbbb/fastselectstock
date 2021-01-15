<template>
	<div class="search-list-page">
		<div class="search-input-wrap">
			<input v-model="searchText"
				   type="text"
				   :placeholder="`请输入${titleLabel}名称`"
				   ref="searchInput"
				   class="search-input" @input="onInput">
			<div class="clear-icon" @click="clearInput" v-if="searchText !== ''"></div>
		</div>
		<div class="search-list-wrap" @touchmove.passive="touchMoveHandle">
			<div class="search-item-wrap" v-for="item in showSelectionLists" @click="clickItem(item)">
				<div class="search-item-title">{{item.label}}</div>
				<RiseFallText v-if="item.fluctuation" :rate="item.fluctuation"></RiseFallText>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { throttle } from '_c/libs/util';
import RiseFallText from '_c/components/base/RiseFallText.vue';
import HeaderBar from '_c/components/base/HeaderBar.vue';

export default {
	name: 'search-list-page',
	components: {
		RiseFallText,
		HeaderBar,
	},
	data() {
		return {
			searchText: '',
			throttleInput: null,
			showSelectionLists: [], // 展示的数据列表
		}
	},
	computed: {
		...mapState([
			'expandSpDataMap',
			'collapsedHeight',
		]),
		titleLabel() {
			return this.$route.query.parentTitle;
		},
		searchLists() { // 全部数据列表
			const expandSpData = this.expandSpDataMap.get(this.titleLabel) || {};
			return expandSpData.data || [];
		},
	},
	methods: {
		...mapMutations([
			'updateHideAfterAnimationStatus',
			'setRowHeightByKey',
		]),
		...mapActions([
			'changeSelectedStatus',
			'changeExpandListsShowStatus',
		]),
		clearInput() {
			this.searchText = '';
		},
		touchMoveHandle() {
			this.$refs.searchInput.blur();
		},
		clickItem(item) {
			const { groupIndex, rowIndex, columnIndex, parentTitle } = this.$route.query;
			this.changeSelectedStatus({
				isSelected: true,
				groupIndex,
				rowIndex,
				columnIndex,
				selectedItem: {
					label: item.label,
					type: item.type,
					parentTitle,
				},
			});
			// 设置收起高度、更改收起状态
			this.setRowHeightByKey({ key: `${groupIndex}-${rowIndex}`, height: this.collapsedHeight });
			this.changeExpandListsShowStatus({ indexConfig: { groupIndex, rowIndex }, isExpand: false });
			this.$router.go(-1);
		},
		onInput(e) {
			this.throttleInput(e);
		},
		inputHandle() { // 模糊搜索
			if (this.searchText) {
				this.showSelectionLists = this.searchLists.filter(item => item.label.indexOf(this.searchText) > -1);
			} else {
				this.showSelectionLists = this.searchLists;
			}
		},
	},
	activated() {
		this.searchText = '';
		this.inputHandle();
	},
	mounted() {
		this.throttleInput = throttle(() => {
			this.inputHandle();
		}, 500);
	},
}
</script>

<style scoped>
	.search-list-page{
		height: 100%;
	}
	.search-item-wrap{
		display: flex;
		align-items: center;
		height: 44px;
		padding: 0 16px;
	}
	.search-input-wrap{
		padding: 0 16px;
		height: 45px;
		display: flex;
		align-items: center;
		background: #e93030;
		margin-top: -1px;
		position: relative;
	}
	.search-input{
		height: 32px;
		line-height: 21px;
		border-radius: 8px;
		width: 100%;
		font-size: 16px;
		padding: 6px 38px 5px 34px;
		box-sizing: border-box;
		background-color: white;
		background-image: url("//i.thsi.cn/iwencai/xuangu/images/search_small.png");
		background-repeat: no-repeat;
		background-size: 22px 22px;
		background-position: 8px 5px;
		-webkit-tap-highlight-color: #b3b3b3;
		-moz-user-focus: unset;
		-webkit-appearance: none;
		outline: none;
		border: none;
		-webkit-user-select: text!important;
	}
	.clear-icon{
		width: 22px;
		height: 22px;
		background: url('//i.thsi.cn/iwencai/wencaiwap/close_icon.png');
		background-size: 100%;
		position: absolute;
		right: 24px;
		top: 12px;
	}
	.search-list-wrap{
		height: calc(100% - 44px);
		overflow: scroll;
		-webkit-overflow-scrolling: touch;
	}
	.search-item-title{
		font-size: 16px;
		font-weight: 400;
		height: 20px;
		line-height: 20px;
		padding-right: 8px;
	}
	.search-item-wrap .rise-fall-text{
		font-size: 16px;
	}
</style>
