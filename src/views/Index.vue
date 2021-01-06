<template>
    <div class="home-index">
		<SelectionTree></SelectionTree>
		<div class="mianze">免责声明：xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
    </div>
</template>

<script>
import SelectionTree from '@/components/index/SelectionTree.vue';

export default {
    name: 'index',
	components: {
		SelectionTree,
	},
    data() {
    	return {

    	}
    },
    computed: {
    	
    },
    methods: {

    },
    mounted() {

    },
}
</script>

<style scoped>
	.home-index{
		padding: 0 12px;
	}
	.mianze{
		word-break: break-all;
	}
</style>
