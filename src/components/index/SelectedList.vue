<template>
    <div class="selected-list">
        <div class="layer-mask" v-if="isExpandBlock" @touchmove.prevent @click="expandOrCollapse"></div>
        <div class="bottom-pop-content" v-if="isExpandBlock">
            <div class="content-title-wrap">
                <div class="content-title">已选条件：{{selectedNum}}条</div>
                <div class="close-icon" @click="expandOrCollapse"></div>
            </div>
            <div class="selected-item-wrap">
                <div class="selected-item" v-for="item in selectedTextArr">
                    <div class="item-title">{{item.query}}</div>
                    <div class="delete-icon" @click="deleteItem(item.key)"></div>
                </div>
            </div>
            <div class="block-height"></div>
        </div>
        <div class="bottom-fixed-wrap">
            <div class="bottom-left-wrap">
                <div class="arrow-icon" :class="isExpandBlock ? 'collapse-icon' : ''" @click="expandOrCollapse"></div>
                <div class="bottom-text">
                    <span>已选</span>
                    <span class="selected-num" :class="searchAble ? 'red-num' : ''">{{selectedNum}}</span>
                    <span>项</span>
                </div>
            </div>
            <div class="search-btn" :class="searchAble ? 'red-bg' : ''">开始选股</div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SELECTION_TYPE_MAP } from '_c/config';

export default {
    name: 'selected-list',
    data() {
        return {
            isExpandBlock: false,
        }
    },
    computed: {
        ...mapState([
            'selectedMap',
        ]),
        selectedTextArr() {
            let arr = [];
            Object.keys(this.selectedMap).forEach(key => {
                if (this.selectedMap[key].isSelected) {
                    const { parentTitle, label, type, value1, value2 } = this.selectedMap[key].selectedItem;
                    if (type === SELECTION_TYPE_MAP.INPUT) {
                        arr.push({
                            key,
                            query: `${parentTitle}${value1}-${value2}`,
                        });
                    } else {
                        arr.push({
                            key,
                            query: `${parentTitle}${label}`,
                        });
                    }
                }
            });

            return arr;
        },
        selectedNum() {
            return this.selectedTextArr.length;
        },
        searchAble() {
            return this.selectedTextArr.length > 0;
        },
    },
    methods: {
        ...mapMutations([
            'updateSelectedMapByKey',
        ]),
        expandOrCollapse() {
            if (!this.searchAble) return;

            this.isExpandBlock = !this.isExpandBlock;
        },
        deleteItem(key) {
            this.updateSelectedMapByKey({
                key,
                isSelected: false,
            });
        },
    },
}
</script>

<style scoped>
    .selected-list{
        height: 48px;
        width: 100%;
    }
    .layer-mask{
        position: fixed;
        z-index: 97;
        background-color: rgba(0, 0, 0, 0.4);
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .bottom-pop-content{
        position: fixed;
        z-index: 98;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        border-radius: 12px 12px 0 0;
    }
    .content-title-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        height: 52px;
        position: relative;
    }
    .content-title-wrap:before{
        position: absolute;
        left: 0;
        bottom: 0;
        content: '';
        width: 100%;
        height: 1PX;
        transform: scaleY(0.5);
        transform-origin: 0 0;
        background: #ebebeb;
    }
    .content-title{
        font-size: 17px;
        font-weight: bold;
        height: 21px;
        line-height: 21px;
    }
    .close-icon{
        width: 12px;
        height: 12px;
        background: url("//i.thsi.cn/iwencai/xuangu/images/close-icon.png");
        background-size: 100%;
    }
    .selected-item-wrap{
        height: 240px;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 16px;
        box-sizing: border-box;
    }
    .selected-item{
        display: flex;
        margin-top: 16px;
        padding: 0 16px;
        font-size: 16px;
        justify-content: space-between;
        align-items: center;
    }
    .item-title{
        height: 21px;
        line-height: 21px;
    }
    .delete-icon{
        width: 16px;
        height: 16px;
        background: url("//i.thsi.cn/iwencai/xuangu/images/delete-icon.png");
        background-size: 100%;
    }
    .block-height{
        height: 48px;
        width: 100%;
    }
    .bottom-fixed-wrap{
        position: fixed;
        z-index: 99;
        left: 0;
        right: 0;
        bottom: 0;
        height: 48px;
        line-height: 48px;
        background: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .bottom-fixed-wrap:before{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        content: '';
        width: 100%;
        height: 1PX;
        transform: scaleY(0.5);
        transform-origin: 0 0;
        background: #ebebeb;
    }
    .bottom-left-wrap{
        display: flex;
        align-items: center;
        color: #595959;
        font-size: 16px;
    }
    .arrow-icon{
        width: 16px;
        height: 16px;
        background: url("//i.thsi.cn/iwencai/xuangu/images/expand-arrow.png");
        background-size: 100%;
        margin: 0 12px;
    }
    .collapse-icon{
        background-image: url("//i.thsi.cn/iwencai/xuangu/images/collapse-arrow.png");
    }
    .bottom-text{
        display: flex;
        align-items: center;
    }
    .selected-num{
        font-weight: bold;
        color: #B3B3B3;
        font-size: 20px;
        height: 20px;
        line-height: 20px;
        margin: 0 6px;
    }
    .search-btn{
        width: 125px;
        height: 100%;
        text-align: center;
        background: #fbabab;
        font-size: 16px;
        font-weight: bold;
        color: white;
    }
    .red-bg{
        background: #e93030;
    }
    .red-num{
        color: #e93030;
    }
</style>
