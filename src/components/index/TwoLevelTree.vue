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
import { mapState, mapMutations, mapActions } from 'vuex';
import { SELECTION_TYPE_MAP } from '_c/config';
import ExpandSelections from '_c/components/index/ExpandSelections.vue';
import Cell from '_c/components/index/Cell.vue';
import Row from '_c/components/grid/Row.vue';
import Col from '_c/components/grid/Col.vue';

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
            'updateExpandData',
            'setSelectedMap',
            'updateExpandStatusByKey',
            'updateSelectedMapByKey',
            'showRangeInput',
        ]),
        ...mapActions([
            'updateExpandData',
        ]),
        /**
         * @description 点击展开的选项
         * @param expandItem
         * @param rowIndex
         * @param columnIndex
         */
        onSelect({ selectedItem, rowIndex, columnIndex }) { // 选中展开的子选择项的回调
            if (selectedItem.type === SELECTION_TYPE_MAP.INPUT) {
                // 展示自定义区间范围输入弹框
                this.showRangeInput({
                    selectedItem,
                    confirmCallback: (value1, value2) => {
                        // 设置自定义输入框输入的数据
                        selectedItem.value1 = value1;
                        selectedItem.value2 = value2;
                        // 设置为选中状态，并设置选中的子选项数据
                        this.changeSelectedStatus(rowIndex, columnIndex, true, selectedItem);
                        // 收起展开的节点
                        this.collapsePresets(rowIndex);
                    },
                });
            } else if (selectedItem.type === SELECTION_TYPE_MAP.SELECT) {
                // 设置为选中状态，并设置选中的子选项数据
                this.changeSelectedStatus(rowIndex, columnIndex, true, selectedItem);
                // 收起展开的节点
                this.collapsePresets(rowIndex);
            } else if (selectedItem.type === SELECTION_TYPE_MAP.MORE_AREA) {

            }
        },
        /**
         * @description 点击选项，1、取消选中；2、展开或收起子选项；
         * @param expandItem
         * @param rowIndex
         * @param columnIndex
         */
        clickCell({ expandItem, rowIndex, columnIndex }) {
            const currentExpandKey = expandItem.value;
            const { expandKey = "", expandIndex: isExpand } = this.expandMap[`${this.groupIndex}-${rowIndex}`] || {};
            const { isSelected } = this.selectedMap[`${this.groupIndex}-${rowIndex}-${columnIndex}`] || {};

            // 取消选中状态
            this.changeSelectedStatus(rowIndex, columnIndex, false);

            // 若当前是选中状态，点击后不执行后续的展开操作
            if (isSelected) return;

            // 展开：先显示内部节点，然后将父容器的高度更新为内部节点的高度
            // 收起：先将父容器的高度重置为收起时的高度，然后在收起动画结束后隐藏内部节点
            if (expandKey === currentExpandKey && isExpand) { // 收起
                this.collapsePresets(rowIndex);
                // 隐藏展开的节点，在transitionend中进行
            } else { // 展开
                // 显示展开的节点，并设置展开的数据
                this.changeExpandListsShowStatus(rowIndex, columnIndex, true, expandItem);
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
         * @param isSelected 是否选中，若为true，则selectedItem必传
         * @param selectedItem 选中的数据内容
         */
        changeSelectedStatus(rowIndex, columnIndex, isSelected, selectedItem = {}) {
            const { isSelected: tempValue } = this.selectedMap[`${this.groupIndex}-${rowIndex}-${columnIndex}`] || {};
            const firstClick = typeof tempValue === 'undefined';

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
         * @param isExpand 是否展开，若为true，expandItem必填
         * @param expandItem 展开的数据内容
         */
        changeExpandListsShowStatus(rowIndex, columnIndex, isExpand, expandItem = {}) {
            const { value } = expandItem;
            const { expandKey } = this.expandMap[`${this.groupIndex}-${rowIndex}`] || {};
            const changeExpandItem = value !== expandKey;

            this.isCollapsed = false; // 重置收起中的信号

            if (changeExpandItem) {
                // 更新展开数据
                this.updateExpandData({
                    key: `${this.groupIndex}-${rowIndex}`,
                    expandIndex: isExpand ? columnIndex : isExpand,
                    columnIndex,
                    expandItem,
                });
            } else {
                // 更新展开状态
                this.updateExpandStatusByKey({
                    key: `${this.groupIndex}-${rowIndex}`,
                    expandIndex: isExpand ? columnIndex : isExpand,
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
        padding-bottom: 12px;
    }
</style>