<template>
    <div class="expand-selections-wrap" v-if="isExpand">
        <div class="selections-title-wrap">
            <div class="selections-title">{{tipsConfig.title}}</div>
            <div class="tips-icon" @click="clickTips">?</div>
        </div>
        <Row v-for="(row, inCellRowIndex) in expandLists" :key="inCellRowIndex" :gutter="8" class="selection-atom-row-wrap">
            <Col :span="item.spaceWidth * 8" v-for="item in row" :key="item.value">
                <ExpandCell :item="item" @on-click="clickItem"></ExpandCell>
            </Col>
        </Row>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
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
            'selectedMap',
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
        recommend() {
            let recommend = '';
            const children = this.item.children || [];
            children.forEach(item => {
                recommend = item.recommend || '';
            });
            recommend = recommend.split('|') || [''];
            recommend = recommend[0].replace('：', ':');

            return recommend;
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
    }
    .tips-icon{

    }
    .selection-atom-row-wrap{
        margin-top: 12px;
    }
</style>
