import Vue from 'vue'
import Vuex from 'vuex'
import { SPACE_MAP, LIMIT_NUM_EACH_LINE, NOT_LEAF_MAP, EXPAND_SPECIAL_MAP,
	SELECTION_TYPE_MAP, EXPAND_API_TYPE, STRATEGY_NUM_EACH_PAGE } from '_c/config';
import { divideListIntoGroups, sliceExpandRows, calcStrSpaceWidth, getNumFromSection,
	getTreeDeepestLevel, treeDataTranslate, getRem, dynamicGrouping } from '_c/libs/util';
import { fetchExpandApi, fetchConfigListsApi, fetchRobotIndexApi } from '_c/api';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		leavesNodes: [], // 叶子节点（即展开项）
		leavesParents: [], // 点击/选中节点（展开项的上一级）
		originListsExceptLeaves: [], // 除叶子节点之外的节点
		originTreeData: [], // 渲染节点的数据

		expandMap: {}, // 条件选股展开列表的集合, key值格式为『分组的索引-行索引』
		selectedMap: {}, // 选中的条件的集合, key值格式为『分组的索引-行索引-列索引』
		rowHeightMap: {}, // 当前行高度的集合, key值格式为『分组的索引-行索引』
		collapsedHeight: 58 * getRem(), // 单行收起时的高度

		tipsConfig: {}, // 解释弹窗的数据
		rangeInputConfig: {}, // 区间范围输入弹框

		expandSpDataMap: EXPAND_SPECIAL_MAP, // 特殊的展开项集合（行业、概念、地区）

		strategyLists: [], // 新手策略列表
		strategyComponents: [], // 策略详情组件列表
	},
	mutations: {
		emptyTreeData(state) {
			state.leavesNodes = [];
			state.leavesParents = [];
			state.originListsExceptLeaves = [];
		},
		addLeavesNodes(state, nodes) {
			state.leavesNodes.push(nodes);
		},
		addLeavesParents(state, data) {
			state.leavesParents.push(data);
		},
		addOriginListsExceptLeaves(state, data) {
			state.originListsExceptLeaves.push(data);
		},
		setOriginTreeData(state, data) {
			state.originTreeData = data;
		},
		changeGroupShowStatus(state, { key, status }) {
			state.originTreeData.forEach(item => {
				if (item.value === key) {
					item.showGroup = status;
				}
			});
		},
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
		setExpandSpDataMap(state, { key, data }) {
			state.expandSpDataMap.set(key, data);
		},
		setStrategyLists(state, lists) {
			state.strategyLists = lists;
		},
		setStrategyComponents(state, data) {
			state.strategyComponents = data;
		},
		setRowHeightByKey(state, { key, height }) {
			Vue.set(state.rowHeightMap, key, height);
		},
	},
	actions: {
		initTreeData({ state, commit, dispatch }, lists) {
			commit('emptyTreeData');

			// 将树结构拆分为，叶子节点和非叶子节点的列表结构
			dispatch('splitTreeData', lists);

			// 将非叶子节点的最后一级按字符串长度进行分行，3个单位长度为一行
			dispatch('groupingRowData');

			// 将列表结构变为树形结构
			commit('setOriginTreeData', treeDataTranslate(state.originListsExceptLeaves));

			// 为最外层节点设置该节点的深度和显示状态
			dispatch('setRootTreeData');
		},
		/**
		 * @description 拆分叶子节点和非叶子节点
		 */
		splitTreeData({ commit, dispatch }, lists) {
			lists.forEach(item => {
				// 添加属性
				let strSpaceWidth = calcStrSpaceWidth(item.label);
				item.spaceWidth = getNumFromSection(strSpaceWidth, SPACE_MAP);

				// 拆分
				if (item.children) {
					commit('addOriginListsExceptLeaves', item);
					dispatch('splitTreeData', item.children);
				} else if (NOT_LEAF_MAP.includes(item.type)) {
					commit('addLeavesParents', item);
				} else {
					commit('addLeavesNodes', item);
				}
			});
		},
		/**
		 * @description 对倒数第二层级的数据进行分组后再重装入树
		 */
		groupingRowData({ state, commit }) {
			let parentsMap = {};

			// 获取叶子节点的父亲
			state.originListsExceptLeaves.forEach(item => {
				state.leavesNodes.forEach(cell => {
					if (cell.parents === item.value && !state.leavesParents.includes(item)) {
						commit('addLeavesParents', item);
					}
				});
			});

			// 构造叶子节点的父亲与其祖父的对象映射
			state.leavesParents.forEach(item => {
				if (parentsMap[item.parents]) {
					parentsMap[item.parents].push(item);
				} else {
					parentsMap[item.parents] = [];
					parentsMap[item.parents].push(item);
				}
			});

			// 对叶子节点的父亲按一定规则进行分组，并存储至其祖父的键名下
			Object.keys(parentsMap).forEach(key => {
				parentsMap[key] = divideListIntoGroups(parentsMap[key], LIMIT_NUM_EACH_LINE);
			});

			// 将分组的数据放入对应的位置
			state.originListsExceptLeaves.forEach(item => {
				delete item.children;
				Object.keys(parentsMap).forEach(key => {
					if (key === item.value) {
						item.rows = parentsMap[key];
					}
				});
			});
		},
		/**
		 * @description 为根节点设置属性
		 */
		setRootTreeData({ state }) {
			let deepestLevel = 1;
			state.originTreeData.forEach(item => {
				deepestLevel ++;
				item.deepestLevel = getTreeDeepestLevel(item.children, deepestLevel); // 设置最深层级数
				Vue.set(item, 'showGroup', true); // 设置是否显示组
				deepestLevel = 1;
			});
		},


		/**
		 * @description 变更选中状态
		 * @param state
		 * @param commit
		 * @param rowIndex
		 * @param groupIndex
		 * @param columnIndex
		 * @param isSelected 是否选中，若为true，则selectedItem必传
		 * @param selectedItem 选中的数据内容
		 */
		changeSelectedStatus({ state, commit }, { groupIndex, rowIndex, columnIndex, isSelected, selectedItem = {} }) {
			const { isSelected: tempValue } = state.selectedMap[`${groupIndex}-${rowIndex}-${columnIndex}`] || {};
			const firstClick = typeof tempValue === 'undefined';

			if (firstClick) {
				// 首次点击，设置初始值
				let newSelectedMap = Object.assign({}, state.selectedMap);
				newSelectedMap[`${groupIndex}-${rowIndex}-${columnIndex}`] = {
					isSelected,
					selectedItem,
				}
				commit('setSelectedMap', newSelectedMap);
			} else {
				commit('updateSelectedMapByKey', {
					key: `${groupIndex}-${rowIndex}-${columnIndex}`,
					isSelected,
					selectedItem,
				});
			}
		},
		/**
		 * @description 显示或隐藏展开的节点
		 * @param state
		 * @param commit
		 * @param dispatch
		 * @param indexConfig
		 * @param isExpand 是否展开，若为true，expandItem必填
		 * @param expandItem 展开的数据内容
		 */
		async changeExpandListsShowStatus({ state, commit, dispatch }, { indexConfig = {}, isExpand, expandItem = {} }) {
			const { groupIndex, rowIndex, columnIndex = null, rowData = {} } = indexConfig;
			const { value } = expandItem;
			const { expandKey } = state.expandMap[`${groupIndex}-${rowIndex}`] || {};
			const changeExpandItem = value !== expandKey;

			if (changeExpandItem) {
				// 更新展开数据
				await dispatch('updateExpandData', {
					key: `${groupIndex}-${rowIndex}`,
					expandIndex: isExpand ? columnIndex : isExpand,
					columnIndex,
					expandItem,
					rowData,
				});
			} else {
				// 更新展开状态
				commit('updateExpandStatusByKey', {
					key: `${groupIndex}-${rowIndex}`,
					expandIndex: isExpand ? columnIndex : isExpand,
					columnIndex,
				});
			}
		},

		/**
		 * @description 获取并更新展开列表的数据
		 * @param state
		 * @param commit
		 * @param dispatch
		 * @param key
		 * @param expandIndex
		 * @param columnIndex
		 * @param expandItem
		 * @param rowData
		 */
		async updateExpandData({ state, commit, dispatch }, { key, expandIndex, columnIndex, expandItem, rowData }) {
			const { value, label = "", remark = "", type } = expandItem;
			const newExpandMap = Object.assign({}, state.expandMap);
			let { children = [] } = expandItem;

			// 根据不同类型，从不同渠道获取数据
			if (type === NOT_LEAF_MAP[0]) { // 从接口获取数据
				await dispatch('fetchExpandData', state.expandSpDataMap.get(label));
				let divideResult = dynamicGrouping(state.expandSpDataMap.get(label).data); // 分组
				children = sliceExpandRows(divideResult, state.expandSpDataMap.get(label).more); // 截断溢出的行数
			} else if (type === NOT_LEAF_MAP[1]) { // 从本地获取
				let divideResult = dynamicGrouping(state.expandSpDataMap.get(label).data); // 分组
				children = sliceExpandRows(divideResult, state.expandSpDataMap.get(label).more); // 截断溢出的行数
			} else {
				children = dynamicGrouping(children); // 分组
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
				rowData,
				expandIndex,
				columnIndex,
			};

			commit('setExpandMap', newExpandMap);
		},
		/**
		 * @description 从接口中获取展开的数据（行业、概念）
		 * @param state
		 * @param commit
		 * @param api
		 * @param data
		 * @returns {Promise<void>}
		 */
		async fetchExpandData({ state, commit }, { api, data = [] }) {
			if (data.length) return;

			const map = {}; // 行业、概念数据获取
			const lists = await fetchExpandApi(api) || [];
			// 按fluctuation字段对接口获取的展开列表进行排序
			lists.sort((a, b) => b.fluctuation - a.fluctuation);
			lists.forEach(item => {
				if (EXPAND_API_TYPE.includes(item.type)) {
					if (!map[item.type]) map[item.type] = [];

					item.label = item.conceptName;
					item.value = item.conceptCode;
					item.spaceWidth = getNumFromSection(calcStrSpaceWidth(item.label), SPACE_MAP);

					map[item.type].push(item);

					item.type = SELECTION_TYPE_MAP.SELECT_DEFAULT;
				}
			});
			for (let [key, value] of state.expandSpDataMap) {
				if (EXPAND_API_TYPE.includes(value.type)) {
					const newData = Object.assign({}, value);
					newData.data = map[value.type] || [];
					// 将行业、概念数据装入map
					commit('setExpandSpDataMap', { key, data: newData });
				}
			}
		},

		/**
		 * @description 获取策略列表
		 * @param commit
		 * @param dispatch
		 * @returns {Promise<void>}
		 */
		async getStrategyLists({ commit, dispatch }) {
			let lists = await dispatch('getConfigListsByType', 'wencaiNoviceStrategy');
			const { list = [] } = lists;
			list.forEach(item => item.spaceWidth = 1); // 为策略单元格添加单元格宽度，供下一步分组使用
			// 将策略以每2个为一组的方式分成二维数组
			commit('setStrategyLists', divideListIntoGroups(list, STRATEGY_NUM_EACH_PAGE));
		},

		/**
		 * @description 获取选股条件配置
		 * @param commit
		 * @param dispatch
		 * @returns {Promise<{}>}
		 */
		async getConditionLists({ commit, dispatch }) {
			// 先行渲染旧数据
			let oldTree = localStorage.getItem('condition-lists') || '[]';
			dispatch('initTreeData', JSON.parse(oldTree));

			let lists = await dispatch('getConfigListsByType', 'wencaiCondition');
			const { tree = [] } = lists;

			if (tree.length) { // 若请求到了合法数据，就使用接口的数据
				localStorage.setItem('condition-lists', JSON.stringify(tree));
				dispatch('initTreeData', tree);
			}
		},

		/**
		 * @description 根据type类型获取对应的配置结果
		 * @param type
		 * @returns {Promise<*|{}>}
		 */
		async getConfigListsByType({}, type) {
			let result = await fetchConfigListsApi(type) || {};
			return result[type] || {};
		},

		/**
		 * @description 根据策略id和问句,获取对应的结果页内容
		 * @param commit
		 * @param query
		 * @param simulateId
		 * @returns {Promise<void>}
		 */
		async getStrategyDetailAction({ commit }, { query, simulateId }) {
			let result = await fetchRobotIndexApi({ query, simulateId }) || {};
			const { components = [] } = result;
			commit('setStrategyComponents', components);
		},
	},
	modules: {

	}
})
