<template>
    <div class="selection-tree">
        <div class="selection-groups" v-for="(item, index) in originTreeData">
            <div class="secondary-title">{{item.label}}</div>

            <TwoLevelTree v-if="item.deepestLevel === 2" :rows="item.rows" :groupIndex="String(index)"></TwoLevelTree>

            <ThreeLevelTree v-if="item.deepestLevel === 3" :treeData="item.children" :index="index"></ThreeLevelTree>

        </div>
    </div>
</template>

<script>
import { list, SPACE_MAP, LIMIT_NUM_EACH_LINE, NOT_LEAF_MAP } from '_c/config';
import { treeDataTranslate, calcStrSpaceWidth, getMapSection, divideListIntoGroups, sortTreeListData } from '_c/libs/util';
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
            leavesNodes: [], // 叶子节点（即展开项）
            originListsExceptLeaves: [], // 除叶子节点之外的节点
            originTreeData: [],
        }
    },
    computed: {

    },
    methods: {
        /**
         * @description 拆分叶子节点和非叶子节点
         */
        splitTreeData(lists) {
            lists.forEach(item => {
                // 添加属性
                let strSpaceWidth = calcStrSpaceWidth(item.label);
                item.spaceWidth = getMapSection(strSpaceWidth, SPACE_MAP);

                // 拆分
                if (item.children) {
                    this.originListsExceptLeaves.push(item);
                    this.splitTreeData(item.children);
                } else if (NOT_LEAF_MAP.includes(item.type)) {
                    this.originListsExceptLeaves.push(item);
                } else {
                    this.leavesNodes.push(item);
                }
            });
        },
        /**
         * @description 对倒数第二层级的数据进行分组后再重装入树
         */
        groupingRowData() {
            let parentsMap = {};
            let leavesParents = []; // 叶子节点的父亲（即倒数第二层）

            // 获取叶子节点的父亲
            this.originListsExceptLeaves.forEach(item => {
                this.leavesNodes.forEach(cell => {
                    if (cell.parents === item.value && !leavesParents.includes(item)) {
                        leavesParents.push(item);
                    }
                });
            });

            // 构造叶子节点的父亲与其祖父的对象映射
            leavesParents.forEach(item => {
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
            this.originListsExceptLeaves.forEach(item => {
                delete item.children;
                Object.keys(parentsMap).forEach(key => {
                    if (key === item.value) {
                        item.rows = parentsMap[key];
                    }
                });
            });
        },
        /**
         * @description 深度遍历直到达到最深层级
         */
        getTreeDeepestLevel(lists, tempLevel) {
            const isLegal = lists instanceof Array && lists.length;
            if (isLegal && lists[0].children) {
                return this.getTreeDeepestLevel(lists[0].children, tempLevel + 1);
            }
            return tempLevel;
        },
        /**
         * @description 为最外层节点设置当前节点的最深层级数
         */
        setTreeDeepestLevel() {
            let deepestLevel = 1;
            this.originTreeData.forEach(item => {
                deepestLevel ++;
                item.deepestLevel = this.getTreeDeepestLevel(item.children, deepestLevel);
                deepestLevel = 1;
            });
        },
    },
    mounted() {
        // 将树结构拆分为，叶子节点和非叶子节点的列表结构
        this.splitTreeData(list.data.tree);

        // 将非叶子节点按sort字段与兄弟节点排序
        this.originListsExceptLeaves = sortTreeListData(this.originListsExceptLeaves);

        // 将非叶子节点的最后一级按字符串长度进行分行，3个单位长度为一行
        this.groupingRowData();

        // 将列表结构变为树形结构
        this.originTreeData = treeDataTranslate(this.originListsExceptLeaves);

        // 为最外层节点设置该节点的深度
        this.setTreeDeepestLevel();
    },
}
</script>

<style scoped>
    .selection-tree{
        padding: 0 12px;
    }
    .selection-groups{
        margin-bottom: 24px;
    }
    .secondary-title{
        font-size: 17px;
        font-weight: bold;
    }
</style>
