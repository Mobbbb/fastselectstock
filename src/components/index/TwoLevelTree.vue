<template>
    <div class="selection-wrap">
        <div class="animation-wrap"
             v-for="(row, rowIndex) in rows"
             :style="{height: `${heightMap[rowIndex]}px`}" @transitionend="transitionend(rowIndex)">
            <Row :key="rowIndex" :gutter="8" ref="selection-wrap" class="selection-row-wrap">
                <Col :span="item.spaceWidth * 8" v-for="(item, columnIndex) in row" :key="item.value">
                    <Cell :groupIndex="groupIndex"
                          :rowIndex="String(rowIndex)"
                          :columnIndex="String(columnIndex)"
                          :item="item"
                          @on-click="clickCell">
                    </Cell>
                </Col>
                <ExpandSelections :groupIndex="groupIndex"
                                  :rowIndex="String(rowIndex)"
                                  slot="extend-slot"
                                  @on-select="onSelect">
                </ExpandSelections>
            </Row>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { LIMIT_NUM_EACH_LINE } from '@/config';
import { divideListIntoGroups } from '@/libs/util';
import ExpandSelections from '@/components/index/ExpandSelections.vue';
import Cell from '@/components/index/Cell.vue';
import Row from '@/components/grid/Row.vue';
import Col from '@/components/grid/Col.vue';

export default {
    name: 'two-level-tree',
    props: {
        rows: Array,
        groupIndex: String,
    },
    components: {
        ExpandSelections,
        Cell,
        Row,
        Col,
    },
    data() {
        return {
            collapsedHeight: 0, // 单行收起时的高度
            heightMap: {}, // 每行高度的存储对象
            isCollapsed: false, // 当前是否正在收起中
        };
    },
    computed: {
        ...mapState([
            'expandMap',
            'selectedMap',
        ]),
    },
    methods: {
        ...mapMutations([
            'setExpandMap',
            'setSelectedMap',
            'updateExpandStatusByKey',
            'updateSelectedMapByKey',
        ]),
        onSelect({ selectedItem, rowIndex, columnIndex }) { // 选中展开的子选择项的回调
            // 设置为选中状态，并设置选中的子选项数据
            this.changeSelectedStatus(rowIndex, columnIndex, {
                isSelected: true,
                selectedItem,
            });
            // 收起展开的节点
            this.collapsePresets(rowIndex);
        },
        /**
         * @description 点击选项，1、激活、取消激活、取消选中；2、展开或收起子选项；
         * @param expandItem
         * @param rowIndex
         * @param columnIndex
         */
        clickCell({ expandItem, rowIndex, columnIndex }) {
            const currentExpandKey = expandItem.value;
            const { expandKey = "", expandIndex } = this.expandMap[`${this.groupIndex}-${rowIndex}`] || {};
            const { isSelected } = this.selectedMap[`${this.groupIndex}-${rowIndex}-${columnIndex}`] || {};

            if (!isSelected) {
                // 为选中状态设置初始值
                this.changeSelectedStatus(rowIndex, columnIndex, {}, true);
            } else {
                //取消选中状态，点击后不执行后续的展开操作
                this.changeSelectedStatus(rowIndex, columnIndex);
                return;
            }

            // 展开：先显示内部节点，然后将父容器的高度更新为内部节点的高度
            // 收起：先将父容器的高度重置为收起时的高度，然后在收起动画结束后隐藏内部节点
            if (expandKey === currentExpandKey && expandIndex) { // 收起(之前展开过)
                this.collapsePresets(rowIndex);
                // 隐藏展开的节点，在transitionend中进行
            } else if (expandKey === currentExpandKey && !expandIndex) { // 展开(之前展开过)
                // 显示展开的节点
                this.changeExpandListsShowStatus(rowIndex, columnIndex, true);
                // 将父容器高度更新为展开后的高度
                this.setHeightByRowIndexNextTick(rowIndex);
            } else { // 首次的展开
                // 显示展开的节点，并设置展开的数据
                this.changeExpandListsShowStatus(rowIndex, columnIndex, true, {
                    firstExpand: true,
                    expandItem,
                });
                // 将父容器高度更新为展开后的高度
                this.setHeightByRowIndexNextTick(rowIndex);
            }
        },
        transitionend(rowIndex) {
            if (this.isCollapsed) {
                // 隐藏展开的节点，收起动作不依赖列号，故传入无效值null
                this.changeExpandListsShowStatus(rowIndex, null, false);
            }
        },
        /**
         * @description 收起节点的前置操作
         * @param rowIndex
         */
        collapsePresets(rowIndex) {
            // 更改信号表示当前正在收起中
            this.isCollapsed = true;
            // 将父容器高度重置为收起状态的高度
            this.setHeightByRowIndex(rowIndex, this.collapsedHeight);
        },
        /**
         * @description 变更选中状态
         * @param rowIndex
         * @param columnIndex
         * @param selectedConfig = {
         *      status 是否选中，若status为true，则selectedItem必传
         *      selectedItem 选中的数据内容
         * }
         * @param firstClick 是否是首次点击，默认为false
         */
        changeSelectedStatus(rowIndex, columnIndex, selectedConfig = {}, firstClick = false) {
            const { isSelected = false, selectedItem = {} } = selectedConfig;
            if (firstClick) {
                // 首次点击，设置初始值
                let newSelectedMap = Object.assign({}, this.selectedMap);
                newSelectedMap[`${this.groupIndex}-${rowIndex}-${columnIndex}`] = {
                    isSelected,
                    selectedItem,
                }
                this.setSelectedMap(newSelectedMap);
            } else {
                this.updateSelectedMapByKey({
                    key: `${this.groupIndex}-${rowIndex}-${columnIndex}`,
                    isSelected,
                    selectedItem,
                });
            }
        },
        /**
         * @description 显示或隐藏展开的节点
         * @param rowIndex
         * @param columnIndex
         * @param status
         * @param expandConfig = {
         *      firstExpand 是否是首次展开，默认为false，若为true，expandItem必填
         *      expandItem 展开的数据内容
         * }
         */
        changeExpandListsShowStatus(rowIndex, columnIndex, status, expandConfig = {}) {
            this.isCollapsed = false; // 重置收起中的信号
            let newExpandMap = Object.assign({}, this.expandMap);
            const { firstExpand = false, expandItem = {} } = expandConfig;
            const { children = [], value, label = "", remark = "" } = expandItem;

            if (firstExpand) {
                // 设置展开数据并更新展开状态
                newExpandMap[`${this.groupIndex}-${rowIndex}`] = {
                    expandLists: divideListIntoGroups(children, LIMIT_NUM_EACH_LINE),
                    tipsConfig: {
                        title: label,
                        content: remark,
                        subTips: children,
                    },
                    expandIndex: status ? columnIndex : status,
                    expandKey: value,
                    columnIndex
                };
                this.setExpandMap(newExpandMap);
            } else {
                // 更新展开状态
                this.updateExpandStatusByKey({
                    key: `${this.groupIndex}-${rowIndex}`,
                    expandIndex: status ? columnIndex : status,
                    columnIndex,
                });
            }
        },
        /**
         * @description 更新指定行索引的高度，若未传staticHeight，将获取行节点的高度
         * @param rowIndex
         * @param staticHeight
         */
        setHeightByRowIndex(rowIndex, staticHeight = "") {
            this.heightMap[rowIndex] = staticHeight || this.$refs['selection-wrap'][rowIndex].$el.offsetHeight;
        },
        setHeightByRowIndexNextTick(rowIndex) {
            this.$nextTick(() => {
                this.setHeightByRowIndex(rowIndex);
            });
        },
        /**
         * @description 获取行的初始高度，以行索引为键存入heightMap
         */
        getRowHeightMap() {
            // 获取heightMap
            let heightMap = {};
            let selectionWraps = this.$refs['selection-wrap'] || [];
            selectionWraps.forEach((selectionWrap, rowIndex) => {
                heightMap[rowIndex] = selectionWrap.$el.offsetHeight;
            });
            this.heightMap = heightMap;

            // 获取首行的高度作为单行收起时的高度
            this.collapsedHeight = heightMap[0] || 0;
        },
    },
    mounted() {
        this.getRowHeightMap();
    },
}
</script>

<style scoped>
    .animation-wrap{
        transition: all 0.15s linear 0s;
        overflow: hidden;
    }
    .selection-row-wrap{
        padding-top: 12px;
    }
</style>
