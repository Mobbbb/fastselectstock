import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		expandMap: {}, // 条件选股展开列表的集合, key值格式为『分组的索引-行索引』
		selectedMap: {}, // 选中的条件的集合, key值格式为『分组的索引-行索引-列索引』
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
	},
	actions: {

	},
	modules: {

	}
})
