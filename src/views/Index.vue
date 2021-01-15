<template>
    <div class="home-index" @scroll="scroll" ref="homeIndex">
        <div class="main-title">新手选股</div>
        <div class="main-title-tips">不知道怎么选？不妨试试以下条件</div>
        <StrategyList></StrategyList>

        <div class="main-title">指标选股</div>
        <div class="main-title-tips">选择以下指标组成选股策略(可多选)</div>
		<SelectionTree></SelectionTree>
		<div class="statement">免责声明：本页面推荐的产品和信息基于人工智能算法模型，仅供投资者参考，不构成投资建议</div>
        <SelectedList></SelectedList>

        <TipsLayer v-if="tipsConfig.isShow"></TipsLayer>
        <InputLayer v-if="rangeInputConfig.isShow"></InputLayer>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import SelectionTree from '_c/components/index/SelectionTree.vue';
import TipsLayer from '_c/components/index/TipsLayer.vue';
import InputLayer from '_c/components/index/InputLayer.vue';
import SelectedList from '_c/components/index/SelectedList.vue';
import StrategyList from '_c/components/index/StrategyList.vue';

export default {
    name: 'index',
	components: {
		SelectionTree,
        TipsLayer,
        InputLayer,
        SelectedList,
        StrategyList,
	},
    data() {
    	return {
            scrollHeight: 0,
    	}
    },
    computed: {
        ...mapState([
            'tipsConfig',
            'rangeInputConfig',
        ]),
    },
    methods: {
        scroll(e) {
            this.scrollHeight = e.target.scrollTop;
        },
    },
    activated() {
        // 后退保持滚动高度
        this.$refs.homeIndex.scrollTop = this.scrollHeight;
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
    .main-title{
        height: 22px;
        font-size: 18px;
        font-weight: bold;
        line-height: 22px;
        padding: 20px 12px 6px 12px;
    }
    .main-title-tips{
        height: 16px;
        color: #b3b3b3;
        line-height: 16px;
        padding: 0 12px 12px 12px;
    }
	.statement{
		word-break: break-all;
        font-size: 13px;
        color: #b3b3b3;
        line-height: 18px;
        padding: 4px 0 16px 0;
    }
</style>
