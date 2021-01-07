<template>
    <div class="three-level-tree">
		<div class="secondary-selection-groups" v-for="(item, groupIndex) in treeData">
			<div class="third-title">{{item.label}}</div>
			<TwoLevelTree :rows="item.rows" :groupIndex="`${index}-${groupIndex}`"></TwoLevelTree>
		</div>
	</div>
</template>

<script>
import TwoLevelTree from '_c/components/index/TwoLevelTree.vue';

export default {
    name: 'three-level-tree',
	components: {
		TwoLevelTree,
	},
    props: {
        treeData: Array,
        index: Number,
    },
    methods: {
        
    },
}
</script>

<style scoped>
	.three-level-tree{

	}
	.third-title{
		font-size: 16px;
		color: #595959;
		line-height: 16px;
		margin-top: 16px;
	}
</style>
