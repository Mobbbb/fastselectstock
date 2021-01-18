<template>
    <div class="expand-selections-wrap" v-if="isExpand">
        <div class="tips-arrow-icon" :style="tipsArrowOffsetLeft"></div>
        <div class="selections-title-wrap">
            <div class="selections-title">{{tipsConfig.title}}</div>
            <div class="tips-icon" @click="clickTips"></div>
        </div>
        <Row v-for="(row, inCellRowIndex) in expandLists" :key="inCellRowIndex" :gutter="8" class="selection-atom-row-wrap">
            <Col :span="24 / row.length" v-for="item in row" :key="item.value">
                <ExpandCell :item="item" @on-click="clickItem" v-if="item.label"></ExpandCell>
                <div class="empty-block" v-else></div>
            </Col>
        </Row>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { CELL_GAP, LIMIT_NUM_EACH_LINE } from '_c/config';
import { getRem } from '_c/libs/util';
import Row from '_c/components/grid/Row.vue';
import Col from '_c/components/grid/Col.vue';
import ExpandCell from '_c/components/index/ExpandCell.vue';

export default {
    name: 'expand-selections',
    props: {
        groupIndex: String,
        rowIndex: String,
    },
    components: {
        Row,
        Col,
        ExpandCell,
    },
    computed: {
        ...mapState([
            'expandMap',
        ]),
        expandSelectionsConfig() {
            return this.expandMap[`${this.groupIndex}-${this.rowIndex}`] || {};
        },
        expandLists() {
            return this.expandSelectionsConfig.expandLists || [];
        },
        tipsConfig() {
            return this.expandSelectionsConfig.tipsConfig || {};
        },
        columnIndex() {
            return this.expandSelectionsConfig.columnIndex;
        },
        isExpand() {
            return this.expandSelectionsConfig.expandIndex;
        },
        rowData() {
            return this.expandSelectionsConfig.rowData || [];
        },
        tipsArrowOffsetLeft() {
            if (!this.isExpand) return {};

            let left = -8 * getRem(); // 小三角图标的一半宽度
            const pagePadding = 48 * getRem();
            const prevCellNum = Number(this.columnIndex) + 1; // 当前点击的单元格之前的个数
            const wrapWidth = document.body.offsetWidth - pagePadding + CELL_GAP; // 行宽
            for (let columnIndex = 0; columnIndex < prevCellNum; columnIndex++) {
                // 单元格宽度
                const cellWidth = wrapWidth * this.rowData[columnIndex].spaceWidth / LIMIT_NUM_EACH_LINE - CELL_GAP;
                if (columnIndex === Number(this.columnIndex)) {
                    left += cellWidth / 2;
                } else {
                    left += cellWidth + CELL_GAP;
                }
            }

            return {
                left: `${left}px`,
            }
        },
    },
    methods: {
        ...mapMutations([
            'setTipsConfig',
        ]),
        clickItem(item) {
            item.parentTitle = this.tipsConfig.title;
            this.$emit('on-select', {
                rowIndex: this.rowIndex,
                columnIndex: this.columnIndex,
                selectedItem: item,
            });
        },
        clickTips() {
            const { title, content, subTips } = this.tipsConfig;
            this.setTipsConfig({
                title, content, subTips, isShow: true,
            });
        },
    },
    mounted() {
        
    },
}
</script>

<style scoped>
    .expand-selections-wrap{
        width: 100%;
        padding: 0 12px 12px 12px;
        margin-top: 12px;
        box-sizing: border-box;
        background: #f7f8fa;
        border: 1px solid #ebebeb;
        border-radius: 4px;
        position: relative;
    }
    .tips-arrow-icon{
        width: 16px;
        height: 7px;
        background: url("//i.thsi.cn/iwencai/xuangu/images/tips-arrow.png");
        background-size: 100%;
        position: absolute;
        top: -7px;
    }
    .selections-title-wrap{
        display: flex;
        align-items: center;
        margin-top: 12px;
    }
    .selections-title{
        font-size: 14px;
        height: 18px;
        line-height: 18px;
        font-weight: bold;
    }
    .tips-icon{
        width: 16px;
        height: 16px;
        background: url("//i.thsi.cn/iwencai/xuangu/images/tips-icon.png");
        background-size: 100%;
        margin-left: 2px;
    }
    .selection-atom-row-wrap{
        margin-top: 12px;
    }
</style>
