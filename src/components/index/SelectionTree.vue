<template>
    <div class="selection-tree">
        <div class="selection-groups" v-for="(item, index) in originTreeData">
            <div class="secondary-title">{{item.label}}</div>

            <TwoLevelTree v-if="item.deepestLevel === 2"
                          :rows="item.rows"
                          :groupIndex="String(index)"
                          class="two-level-tree">
            </TwoLevelTree>

            <ThreeLevelTree v-if="item.deepestLevel === 3" :treeData="item.children" :index="index"></ThreeLevelTree>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
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

    },
    mounted() {

    },
}
</script>

<style scoped>
    .selection-tree{
        padding: 0 12px;
    }
    .selection-groups{
        padding-bottom: 4px;
    }
    .secondary-title{
        font-size: 17px;
        font-weight: bold;
        padding-bottom: 16px;
    }
    .two-level-tree{
        padding-bottom: 8px;
    }
</style>
