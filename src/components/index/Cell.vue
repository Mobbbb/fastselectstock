<template>
    <div class="selection-item" :class="isSelected || isActive ? 'selected-item' : ''" @click="clickItem">
        <div class="item-title">{{item.label}}</div>
        <div class="selected-title" v-if="isSelected">{{selectedValue}}</div>
        <div class="selected-title recommend-label" v-else-if="recommend">{{recommend}}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { SELECTION_TYPE_MAP } from '_c/config';

export default {
    name: 'selection-item',
    props: {
        item: Object,
        groupIndex: String,
        rowIndex: String,
        columnIndex: String,
    },
    components: {

    },
    data() {
        return {

        };
    },
    computed: {
        ...mapState([
            'expandMap',
            'selectedMap',
        ]),
        selectedConfig() {
            return this.selectedMap[`${this.groupIndex}-${this.rowIndex}-${this.columnIndex}`] || {};
        },
        expandSelectionsConfig() {
            return this.expandMap[`${this.groupIndex}-${this.rowIndex}`] || {};
        },
        selectedItem() {
            return this.selectedConfig.selectedItem || {};
        },
        selectedValue() {
            if (this.selectedItem.type === SELECTION_TYPE_MAP.INPUT) {
                return `${this.selectedItem.value1}-${this.selectedItem.value2}`;
            }

            return this.selectedItem.label;
        },
        isSelected() {
            return this.selectedConfig.isSelected || false;
        },
        isActive() {
            return this.expandSelectionsConfig.expandIndex === this.columnIndex;
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
        clickItem() {
            this.$emit('on-click', {
                expandItem: this.item,
                groupIndex: this.groupIndex,
                rowIndex: this.rowIndex,
                columnIndex: this.columnIndex,
            });
        },
    },
}
</script>

<style scoped>
    .selection-item{
        height: 46px;
        background: #f7f8fa;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .selected-item{
        color: #e93030;
        border: 1px solid #E93030;
        background: #fff5f5;
    }
    .item-title{
        height: 16px;
        line-height: 16px;
    }
    .selected-title{
        height: 14px;
        line-height: 14px;
        font-size: 12px;
        margin-top: 2px;
        color: #e93030;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 8px;
    }
    .recommend-label{
        color: #B3B3B3;
    }
</style>
