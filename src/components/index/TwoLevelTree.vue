<template>
    <div class="selection-wrap">
        <div class="animation-wrap"
             v-for="(row, rowIndex) in rows"
             :style="{height: `${rowHeightMap[`${groupIndex}-${rowIndex}`]}px`}" @transitionend="transitionend(rowIndex)">
            <Row :key="rowIndex" :gutter="CELL_GAP" ref="selection-wrap" class="selection-row-wrap">
                <Col :span="item.spaceWidth * 8" v-for="(item, columnIndex) in row" :key="item.value">
                    <Cell :groupIndex="groupIndex"
                          :rowIndex="String(rowIndex)"
                          :columnIndex="String(columnIndex)"
                          :item="item"
                          @on-click="clickCell($event, row)">
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
import { SELECTION_TYPE_MAP, MORE_TYPE, CELL_GAP, SELECT_MAP } from '_c/config';
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
            CELL_GAP,
        };
    },
    computed: {
        ...mapState([
            'rowHeightMap',
            'expandMap',
            'selectedMap',
            'needToHideAfterAnimation',
            'collapsedHeight',
        ]),
    },
    methods: {
        ...mapMutations([
            'showRangeInput',
            'updateHideAfterAnimationStatus',
            'setRowHeightByKey',
        ]),
        ...mapActions([
            'changeSelectedStatus',
            'changeExpandListsShowStatus',
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
                        this.changeSelectedStatus({
                            isSelected: true,
                            groupIndex: this.groupIndex,
                            rowIndex,
                            columnIndex,
                            selectedItem,
                        });
                        // 收起展开的节点
                        this.collapsePresets(rowIndex);
                    },
                });
            } else if (SELECT_MAP.includes(selectedItem.type)) {
                // 设置为选中状态，并设置选中的子选项数据
                this.changeSelectedStatus({
                    isSelected: true,
                    groupIndex: this.groupIndex,
                    rowIndex,
                    columnIndex,
                    selectedItem,
                });
                // 收起展开的节点
                this.collapsePresets(rowIndex);
            } else if (MORE_TYPE.includes(selectedItem.type)) {
                // 跳转至列表选择页
                this.$router.push({
                    name: 'SearchList',
                    query: {
                        parentTitle: selectedItem.parentTitle,
                        groupIndex: this.groupIndex,
                        columnIndex,
                        rowIndex,
                    },
                });
            }
        },
        /**
         * @description 点击选项，1、取消选中；2、展开或收起子选项；
         * @param expandItem
         * @param rowIndex
         * @param columnIndex
         * @param rowData
         */
        async clickCell({ expandItem, rowIndex, columnIndex }, rowData) {
            const currentExpandKey = expandItem.value;
            const { expandKey = "", expandIndex: isExpand } = this.expandMap[`${this.groupIndex}-${rowIndex}`] || {};
            const { isSelected } = this.selectedMap[`${this.groupIndex}-${rowIndex}-${columnIndex}`] || {};

            // 取消选中状态
            this.changeSelectedStatus({
                isSelected: false,
                groupIndex: this.groupIndex,
                rowIndex,
                columnIndex,
            });

            // 若当前是选中状态，点击后不执行后续的展开操作
            if (isSelected) return;

            // 展开：先显示内部节点，然后将父容器的高度更新为内部节点的高度
            // 收起：先将父容器的高度重置为收起时的高度，然后在收起动画结束后隐藏内部节点
            if (expandKey === currentExpandKey && isExpand) { // 收起
                this.collapsePresets(rowIndex);
                // 隐藏展开的节点，在transitionend中进行
            } else { // 展开
                // 显示展开的节点，并设置展开的数据
                const indexConfig = { groupIndex: this.groupIndex, rowIndex, columnIndex, rowData };
                await this.changeExpandListsShowStatus({ indexConfig, expandItem, isExpand: true });
                // 将父容器高度更新为展开后的高度
                this.setHeightByRowIndexNextTick(rowIndex);
            }
        },
        transitionend(rowIndex) {
            if (this.needToHideAfterAnimation) {
                // 隐藏展开的节点，收起动作只依赖行号
                const indexConfig = { groupIndex: this.groupIndex, rowIndex };
                this.changeExpandListsShowStatus({ indexConfig, isExpand: false });
            }
        },
        /**
         * @description 收起节点的前置操作
         * @param rowIndex
         */
        collapsePresets(rowIndex) {
            // 收起动画结束后隐藏节点
            this.updateHideAfterAnimationStatus(true);
            // 将父容器高度重置为收起状态的高度
            this.setHeightByRowIndex(rowIndex, this.collapsedHeight);
        },
        /**
         * @description 更新指定行索引的高度，若未传staticHeight，将获取行节点的高度
         * @param rowIndex
         * @param staticHeight
         */
        setHeightByRowIndex(rowIndex, staticHeight = "") {
            const height = staticHeight || this.$refs['selection-wrap'][rowIndex].$el.offsetHeight;
            this.setRowHeightByKey({ key: `${this.groupIndex}-${rowIndex}`, height });
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
            this.rows.forEach((item, rowIndex) => {
                this.setRowHeightByKey({ key: `${this.groupIndex}-${rowIndex}`, height: this.collapsedHeight });
            });
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
