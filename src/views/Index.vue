<template>
    <div class="home-index">
		<SelectionTree></SelectionTree>
		<div class="mianze">免责声明：xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>

        <TipsLayer v-if="tipsConfig.isShow"></TipsLayer>
        <InputLayer v-if="rangeInputConfig.isShow"></InputLayer>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import SelectionTree from '_c/components/index/SelectionTree.vue';
import TipsLayer from '_c/components/index/TipsLayer.vue';
import InputLayer from '_c/components/index/InputLayer.vue';

export default {
    name: 'index',
	components: {
		SelectionTree,
        TipsLayer,
        InputLayer,
	},
    data() {
    	return {

    	}
    },
    computed: {
        ...mapState([
            'tipsConfig',
            'rangeInputConfig',
        ]),
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
        height: 100%;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
	}
	.mianze{
		word-break: break-all;
	}
</style>
