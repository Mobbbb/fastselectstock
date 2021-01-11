import Vue from 'vue'
import Vuex from 'vuex'
import { SPACE_MAP, LIMIT_NUM_EACH_LINE, NOT_LEAF_MAP, MORE_AREA, STATIC_DATA } from '_c/config';
import { divideListIntoGroups, sliceExpandRows, calcStrSpaceWidth, getMapSection,
	getTreeDeepestLevel, sortTreeListData, treeDataTranslate } from '_c/libs/util';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		leavesNodes: [], // 叶子节点（即展开项）
		leavesParents: [], // 点击/选中节点（展开项的上一级）
		originListsExceptLeaves: [], // 除叶子节点之外的节点
		originTreeData: [], // 渲染节点的数据

		expandMap: {}, // 条件选股展开列表的集合, key值格式为『分组的索引-行索引』
		selectedMap: {}, // 选中的条件的集合, key值格式为『分组的索引-行索引-列索引』

		tipsConfig: {}, // 解释弹窗的数据
		rangeInputConfig: {}, // 区间范围输入弹框
	},
	mutations: {
		addLeavesNodes(state, nodes) {
			state.leavesNodes.push(nodes);
		},
		addLeavesParents(state, data) {
			state.leavesParents.push(data);
		},
		addOriginListsExceptLeaves(state, data) {
			state.originListsExceptLeaves.push(data);
		},
		setOriginListsExceptLeaves(state, data) {
			state.originListsExceptLeaves = data;
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
	},
	actions: {
		initTreeData({ state, commit, dispatch }, lists) {
			// 将树结构拆分为，叶子节点和非叶子节点的列表结构
			dispatch('splitTreeData', lists.data.tree);

			// 将非叶子节点按sort字段与兄弟节点排序
			commit('setOriginListsExceptLeaves', sortTreeListData(state.originListsExceptLeaves));

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
				item.spaceWidth = getMapSection(strSpaceWidth, SPACE_MAP);

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
		 * @description 获取并更新展开列表的数据
		 * @param state
		 * @param commit
		 * @param key
		 * @param expandIndex
		 * @param columnIndex
		 * @param expandItem
		 * @param rowData
		 */
		updateExpandData({ state, commit }, { key, expandIndex, columnIndex, expandItem, rowData }) {
			const { value, label = "", remark = "", type } = expandItem;
			const newExpandMap = Object.assign({}, state.expandMap);
			let { children = [] } = expandItem;

			// 根据不同类型，从不同渠道获取数据
			if (type === NOT_LEAF_MAP[0]) { // 从接口获取数据

			} else if (type === NOT_LEAF_MAP[1]) { // 从本地获取
				let divideResult = divideListIntoGroups(STATIC_DATA[label], LIMIT_NUM_EACH_LINE); // 分组
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
				rowData,
				expandIndex,
				columnIndex,
			};

			commit('setExpandMap', newExpandMap);
		},
	},
	modules: {

	}
})
