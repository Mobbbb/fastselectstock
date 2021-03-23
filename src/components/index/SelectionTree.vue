<template>
    <div class="selection-tree">
        <div class="selection-groups" v-for="(item, index) in originTreeData">
            <div class="secondary-title-wrap" @click="expandOrCollapseGroup(item)">
                <div class="secondary-title">{{item.label}}</div>
                <div class="group-collapse-icon" :class="item.showGroup ? '' : 'group-expand-icon'"></div>
            </div>

            <div v-show="item.showGroup">
                <TwoLevelTree v-if="item.deepestLevel === 2"
                              :rows="item.rows"
                              :groupIndex="String(index)"
                              class="two-level-tree">
                </TwoLevelTree>

                <ThreeLevelTree v-if="item.deepestLevel === 3" :treeData="item.children" :index="index"></ThreeLevelTree>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import TwoLevelTree from '_c/components/index/TwoLevelTree.vue';
import ThreeLevelTree from '_c/components/index/ThreeLevelTree.vue';

export default {
    name: 'index',
    components: {
        TwoLevelTree,
        ThreeLevelTree,
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapState([
            'originTreeData',
        ]),
    },
    methods: {
        ...mapMutations([
            'changeGroupShowStatus',
        ]),
        expandOrCollapseGroup(item) {
            const { showGroup, value } = item;
            this.changeGroupShowStatus({ key: value, status: !showGroup });
        },
    },
    mounted() {

    },
}
</script>

<style scoped>
    .selection-tree{
        padding: 4px 12px 0 12px;
    }
    .selection-groups{
        padding-bottom: 4px;
    }
    .secondary-title-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
    }
    .secondary-title{
        font-size: 17px;
        font-weight: bold;
        height: 21px;
        line-height: 21px;
    }
    .group-collapse-icon{
        width: 14px;
        height: 14px;
        background: url("../../assets/up-arrow.png");
        background-size: 100%;
    }
    .group-expand-icon{
        background-image: url("../../assets/down-arrow.png");
    }
    .two-level-tree{
        padding-bottom: 8px;
    }
</style>
