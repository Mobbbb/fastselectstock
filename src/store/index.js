import Vue from 'vue'
import Vuex from 'vuex'
import { LIMIT_NUM_EACH_LINE, NOT_LEAF_MAP, AREA_DATA, MORE_AREA } from '_c/config';
import { divideListIntoGroups, sliceExpandRows } from '_c/libs/util';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		expandMap: {}, // 条件选股展开列表的集合, key值格式为『分组的索引-行索引』
		selectedMap: {}, // 选中的条件的集合, key值格式为『分组的索引-行索引-列索引』

		tipsConfig: {}, // 解释弹窗的数据
		rangeInputConfig: {}, // 区间范围输入弹框
	},
	mutations: {
		setExpandMap(state, map) {
			state.expandMap = map;
		},
		setSelectedMap(state, map) {
			state.selectedMap = map;
		},
		updateSelectedMapByKey(state, { key, isSelected, selectedItem = {} }) {
			state.selectedMap[key].isSelected = isSelected;
			state.selectedMap[key].selectedItem = selectedItem;
		},
		updateExpandStatusByKey(state, { key, expandIndex, columnIndex }) {
			state.expandMap[key].expandIndex = expandIndex;
			state.expandMap[key].columnIndex = columnIndex;
		},
		setTipsConfig(state, config) {
			state.tipsConfig = config;
		},
		changeTipsLayerShowStatus(state, status) {
			state.tipsConfig.isShow = status;
		},
		showRangeInput(state, { selectedItem, confirmCallback }) {
			selectedItem.isShow = true;
			selectedItem.confirmCallback = confirmCallback;
			state.rangeInputConfig = selectedItem;
		},
		hideRangeInput(state) {
			state.rangeInputConfig = { isShow: false };
		},
	},
	actions: {
		/**
		 * @description 获取并更新展开列表的数据
		 * @param state
		 * @param commit
		 * @param key
		 * @param expandIndex
		 * @param columnIndex
		 * @param expandItem
		 */
		updateExpandData({ state, commit }, { key, expandIndex, columnIndex, expandItem }) {
			const { value, label = "", remark = "", type } = expandItem;
			const newExpandMap = Object.assign({}, state.expandMap);
			let { children = [] } = expandItem;

			// 根据不同类型，从不同渠道获取数据
			if (type === NOT_LEAF_MAP[0]) { // 从接口获取数据

			} else if (type === NOT_LEAF_MAP[1]) { // 从本地获取
				let divideResult = divideListIntoGroups(AREA_DATA, LIMIT_NUM_EACH_LINE); // 分组
				children = sliceExpandRows(divideResult, MORE_AREA); // 截断溢出的行数
			} else {
				// 按sort字段对展开列表进行排序
				children.sort((a, b) => a.sort - b.sort);
				children = divideListIntoGroups(children, LIMIT_NUM_EACH_LINE); // 分组
			}

			// 设置展开数据并更新展开状态
			newExpandMap[key] = {
				expandLists: children,
				tipsConfig: {
					title: label,
					content: remark,
					subTips: children,
				},
				expandKey: value,
				expandIndex,
				columnIndex,
			};

			commit('setExpandMap', newExpandMap);
		},
	},
	modules: {

	}
})
